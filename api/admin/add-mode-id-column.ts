import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';

/**
 * 数据库迁移脚本：添加 mode_id 列到 credits_transactions 表
 *
 * 用途：为现有的 credits_transactions 表添加 mode_id 列
 *
 * 访问：GET/POST /api/admin/add-mode-id-column
 *
 * ⚠️ 注意：这是一次性迁移脚本，执行后可以删除
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 简单的访问控制（生产环境应该使用更安全的验证）
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.ADMIN_SECRET || 'admin-secret-key';

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Set ADMIN_SECRET environment variable and pass as Bearer token'
    });
  }

  try {
    console.log('🔄 Starting database migration: Adding mode_id column...');

    // 1. 检查列是否已存在
    const checkColumn = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'credits_transactions'
        AND column_name = 'mode_id'
    `;

    if (checkColumn.rows.length > 0) {
      console.log('✅ mode_id column already exists, skipping migration');
      return res.status(200).json({
        success: true,
        message: 'mode_id column already exists',
        alreadyExists: true
      });
    }

    // 2. 添加 mode_id 列
    await sql`
      ALTER TABLE credits_transactions
      ADD COLUMN mode_id VARCHAR(50)
    `;
    console.log('✅ Added mode_id column to credits_transactions');

    // 3. 创建索引以提高查询性能
    await sql`
      CREATE INDEX IF NOT EXISTS idx_credits_transactions_mode_id
      ON credits_transactions(mode_id)
    `;
    console.log('✅ Created index on mode_id column');

    // 4. 获取表的统计信息
    const stats = await sql`
      SELECT
        COUNT(*) as total_rows,
        COUNT(mode_id) as rows_with_mode_id
      FROM credits_transactions
    `;

    const result = {
      success: true,
      message: 'Successfully added mode_id column',
      stats: {
        totalRows: parseInt(stats.rows[0].total_rows),
        rowsWithModeId: parseInt(stats.rows[0].rows_with_mode_id),
        rowsWithoutModeId: parseInt(stats.rows[0].total_rows) - parseInt(stats.rows[0].rows_with_mode_id)
      }
    };

    console.log('✅ Migration completed:', result);

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: 'Migration failed',
      details: errorMessage
    });
  }
}
