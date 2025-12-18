import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { generateToken } from '../lib/auth.js';

/**
 * 初始化开发测试用户
 * GET /api/test/init-dev-user
 *
 * ⚠️ 严格限制：仅在开发环境使用！
 * 在生产环境中此端点会返回 404
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 🚨 安全检查：在生产环境中立即阻止
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 0. 自动数据库迁移：添加 mode_id 列（如果尚未添加）
    try {
      const checkColumn = await sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'credits_transactions'
          AND column_name = 'mode_id'
      `;

      if (checkColumn.rows.length === 0) {
        console.log('🔄 Running database migration: Adding mode_id column...');

        await sql`
          ALTER TABLE credits_transactions
          ADD COLUMN mode_id VARCHAR(50)
        `;

        await sql`
          CREATE INDEX IF NOT EXISTS idx_credits_transactions_mode_id
          ON credits_transactions(mode_id)
        `;

        console.log('✅ Database migration completed: mode_id column added');
      } else {
        console.log('✅ mode_id column already exists, skipping migration');
      }
    } catch (migrationError) {
      console.warn('⚠️ Database migration failed (non-critical):', migrationError);
      // 不抛出错误，允许继续执行
    }

    // 🔒 使用安全的开发用户标识符（包含环境标记，防止与生产数据冲突）
    const DEV_MARKER = '__DEVELOPMENT_ONLY_DO_NOT_USE_IN_PRODUCTION__';
    const devGoogleId = `dev_${DEV_MARKER}_local_test`;
    const devEmail = 'dev@local.test.invalid'; // .invalid TLD 确保不是真实域名
    const devName = '🔧 本地开发测试用户 (DEV ONLY)';
    const devPicture = 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser&backgroundColor=10b981'; // emerald背景头像

    // 1. 通过google_id查找开发用户（防御性查询：确保只匹配开发标记）
    const existingUser = await sql`
      SELECT * FROM users
      WHERE google_id = ${devGoogleId}
        AND google_id LIKE ${'%' + DEV_MARKER + '%'}
        AND email LIKE '%.invalid'
    `;

    let user;

    if (existingUser.rows.length > 0) {
      // 开发用户已存在，直接使用（不UPDATE，避免破坏数据）
      user = existingUser.rows[0];

      // 更新last_login_at和picture（防御性更新：确保只更新开发用户）
      if (!user.picture) {
        const updated = await sql`
          UPDATE users
          SET last_login_at = CURRENT_TIMESTAMP, picture = ${devPicture}
          WHERE google_id = ${devGoogleId}
            AND google_id LIKE ${'%' + DEV_MARKER + '%'}
            AND email LIKE '%.invalid'
          RETURNING *
        `;
        if (updated.rows.length > 0) {
          user.picture = devPicture;
        }
      } else {
        await sql`
          UPDATE users
          SET last_login_at = CURRENT_TIMESTAMP
          WHERE google_id = ${devGoogleId}
            AND google_id LIKE ${'%' + DEV_MARKER + '%'}
            AND email LIKE '%.invalid'
        `;
      }

      console.log('✅ Dev user found (safe):', user.id, user.email);
    } else {
      // 创建新的开发用户（安全检查：再次确认不是生产环境）
      if (process.env.NODE_ENV === 'production') {
        throw new Error('🚨 BLOCKED: Attempted to create dev user in production!');
      }

      const created = await sql`
        INSERT INTO users (email, name, picture, google_id, last_login_at)
        VALUES (${devEmail}, ${devName}, ${devPicture}, ${devGoogleId}, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      user = created.rows[0];
      console.log('✅ Dev user created with UUID:', user.id, 'Email:', user.email);
    }

    // 2. 确保用户有订阅
    const subscriptionCheck = await sql`
      SELECT * FROM user_subscriptions WHERE user_id = ${user.id} AND status = 'active'
    `;

    if (subscriptionCheck.rows.length === 0) {
      const periodStart = new Date();
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await sql`
        INSERT INTO user_subscriptions
          (user_id, plan_id, status, billing_period, current_period_start, current_period_end)
        VALUES
          (${user.id}, 'pro', 'active', 'monthly', ${periodStart}, ${periodEnd})
        ON CONFLICT DO NOTHING
      `;
      console.log('✅ Dev user subscription created');
    }

    // 3. 确保用户有Credits
    const creditsCheck = await sql`
      SELECT * FROM user_credits WHERE user_id = ${user.id}
    `;

    if (creditsCheck.rows.length === 0) {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      nextReset.setDate(1);

      await sql`
        INSERT INTO user_credits
          (user_id, total_credits, used_credits, bonus_credits, last_reset_at, next_reset_at)
        VALUES
          (${user.id}, 10000, 0, 0, ${new Date()}, ${nextReset})
      `;

      await sql`
        INSERT INTO credits_transactions
          (user_id, type, credits_delta, credits_before, credits_after, description)
        VALUES
          (${user.id}, 'bonus', 10000, 0, 10000, 'Initial dev credits')
      `;
      console.log('✅ Dev user credits created');
    }

    // 3.1. 创建测试交易记录（用于七天花费图表）
    // 检查是否已有 usage 类型的交易记录
    const usageCheck = await sql`
      SELECT COUNT(*) as count FROM credits_transactions
      WHERE user_id = ${user.id} AND type = 'usage'
    `;

    if (parseInt(usageCheck.rows[0].count) === 0) {
      console.log('🔄 Creating test transaction data for 7-day chart...');

      const testTransactions = [];
      const now = new Date();

      // 过去7天的测试数据
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(10, 0, 0, 0);

        // 每天随机1-3个不同模式的交易
        const modes = ['keyword_mining', 'batch_translation', 'deep_mining'];
        const dailyModes = modes.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1);

        for (const mode of dailyModes) {
          const credits = Math.floor(Math.random() * 50) + 10; // 10-60 credits
          testTransactions.push({
            date,
            mode,
            credits
          });
        }
      }

      // 插入测试交易
      for (const tx of testTransactions) {
        const description = `Test transaction for ${tx.mode}`;
        await sql`
          INSERT INTO credits_transactions
            (user_id, type, credits_delta, credits_before, credits_after, description, mode_id, created_at, related_entity)
          VALUES
            (${user.id}, 'usage', ${-tx.credits}, 10000, ${10000 - tx.credits},
             ${description}, ${tx.mode}, ${tx.date}, 'seo_agent')
        `;
      }

      // 更新 used_credits
      const totalUsed = testTransactions.reduce((sum, tx) => sum + tx.credits, 0);
      await sql`
        UPDATE user_credits
        SET used_credits = ${totalUsed}
        WHERE user_id = ${user.id}
      `;

      console.log(`✅ Created ${testTransactions.length} test transactions (total ${totalUsed} credits used)`);
    }

    // 4. 生成真实的JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    return res.status(200).json({
      success: true,
      message: 'Development user initialized successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      },
      token,
      instructions: {
        step1: 'Copy the token below',
        step2: 'Open browser console (F12) at http://localhost:3000',
        step3: 'Run: localStorage.setItem("auth_token", "YOUR_TOKEN")',
        step4: 'Or use auto-login: visit http://localhost:3000?devLogin=true'
      }
    });

  } catch (error) {
    console.error('Init dev user error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to initialize dev user',
      details: errorMessage
    });
  }
}
