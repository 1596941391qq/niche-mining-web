import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';

/**
 * 重置开发用户的测试数据
 * POST /api/test/reset-dev-data
 *
 * ⚠️ 仅在开发环境使用
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 🚨 安全检查：在生产环境中立即阻止
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const DEV_MARKER = '__DEVELOPMENT_ONLY_DO_NOT_USE_IN_PRODUCTION__';
    const devGoogleId = `dev_${DEV_MARKER}_local_test`;

    // 查找开发用户
    const userResult = await sql`
      SELECT * FROM users
      WHERE google_id = ${devGoogleId}
        OR email = 'dev@local.test'
        OR email = 'dev@local.test.invalid'
        OR google_id LIKE 'dev_%test%'
      ORDER BY created_at ASC
      LIMIT 1
    `;

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Dev user not found',
        message: 'Please run /api/test/init-dev-user first'
      });
    }

    const user = userResult.rows[0];
    console.log('🔄 Resetting dev data for user:', user.id, user.email);

    // 1. 删除所有交易记录
    const deletedTx = await sql`
      DELETE FROM credits_transactions
      WHERE user_id = ${user.id}
    `;
    console.log(`🗑️  Deleted ${deletedTx.rowCount} transaction records`);

    // 2. 重置 credits
    await sql`
      UPDATE user_credits
      SET used_credits = 0, total_credits = 10000
      WHERE user_id = ${user.id}
    `;
    console.log('✅ Reset credits to 10000');

    // 3. 创建初始 bonus 交易
    await sql`
      INSERT INTO credits_transactions
        (user_id, type, credits_delta, credits_before, credits_after, description)
      VALUES
        (${user.id}, 'bonus', 10000, 0, 10000, 'Initial dev credits')
    `;

    // 4. 创建七天测试数据
    const testTransactions = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(10, 0, 0, 0);

      const modes = ['keyword_mining', 'batch_translation', 'deep_mining'];
      const dailyModes = modes.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1);

      for (const mode of dailyModes) {
        const credits = Math.floor(Math.random() * 50) + 10;
        testTransactions.push({
          date: new Date(date),
          mode,
          credits
        });
      }
    }

    console.log(`📊 Creating ${testTransactions.length} test transactions...`);

    let insertCount = 0;
    for (const tx of testTransactions) {
      const description = `Test transaction for ${tx.mode}`;
      try {
        await sql`
          INSERT INTO credits_transactions
            (user_id, type, credits_delta, credits_before, credits_after, description, mode_id, created_at, related_entity)
          VALUES
            (${user.id}, 'usage', ${-tx.credits}, 10000, ${10000 - tx.credits},
             ${description}, ${tx.mode}, ${tx.date}, 'seo_agent')
        `;
        insertCount++;
      } catch (err) {
        console.error('❌ Failed to insert transaction:', err);
      }
    }

    const totalUsed = testTransactions.reduce((sum, tx) => sum + tx.credits, 0);
    await sql`
      UPDATE user_credits
      SET used_credits = ${totalUsed}
      WHERE user_id = ${user.id}
    `;

    console.log(`✅ Created ${insertCount} test transactions (${totalUsed} credits used)`);

    // 验证数据
    const verifyData = await sql`
      SELECT
        DATE(created_at) as date,
        mode_id,
        COUNT(*) as count,
        SUM(ABS(credits_delta)) as total_credits
      FROM credits_transactions
      WHERE user_id = ${user.id}
        AND type = 'usage'
        AND mode_id IS NOT NULL
      GROUP BY DATE(created_at), mode_id
      ORDER BY date ASC
    `;

    return res.status(200).json({
      success: true,
      message: 'Dev data reset successfully',
      stats: {
        deletedRecords: deletedTx.rowCount,
        createdRecords: insertCount,
        totalCreditsUsed: totalUsed,
        remainingCredits: 10000 - totalUsed
      },
      sevenDayData: verifyData.rows
    });

  } catch (error) {
    console.error('Reset dev data error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to reset dev data',
      details: errorMessage
    });
  }
}
