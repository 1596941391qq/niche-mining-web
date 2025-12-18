import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { generateToken } from '../lib/auth.js';

/**
 * 初始化开发测试用户
 * GET /api/test/init-dev-user
 *
 * 仅在开发环境使用，创建一个真实的测试用户到数据库
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 仅开发环境
  const isDev = process.env.NODE_ENV !== 'production';

  if (!isDev) {
    return res.status(403).json({ error: 'This endpoint is only available in development' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 使用特殊的google_id来标识开发用户，而不是硬编码user_id
    const devGoogleId = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION';
    const devEmail = 'dev@local.test';
    const devName = '本地开发测试用户';

    // 1. 通过google_id查找开发用户（安全！不会覆盖真实用户）
    const existingUser = await sql`
      SELECT * FROM users WHERE google_id = ${devGoogleId}
    `;

    let user;

    if (existingUser.rows.length > 0) {
      // 开发用户已存在，直接使用（不UPDATE，避免破坏数据）
      user = existingUser.rows[0];

      // 只更新last_login_at
      await sql`
        UPDATE users
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE google_id = ${devGoogleId}
      `;

      console.log('✅ Dev user found:', user.id);
    } else {
      // 创建新的开发用户（让数据库自动生成UUID）
      const created = await sql`
        INSERT INTO users (email, name, google_id, last_login_at)
        VALUES (${devEmail}, ${devName}, ${devGoogleId}, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      user = created.rows[0];
      console.log('✅ Dev user created with new UUID:', user.id);
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
        name: user.name
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
