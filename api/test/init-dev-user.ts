import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, initUsersTable, initSessionsTable, initSubscriptionTables, initPaymentTables } from '../lib/db.js';
import { generateToken } from '../lib/auth.js';

/**
 * 初始化开发测试用户和数据库表
 * GET /api/test/init-dev-user
 *
 * ⚠️ 仅在开发环境使用
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 安全检查：生产环境返回 404
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔄 Initializing database tables...');

    // 初始化所有表
    await initUsersTable();
    await initSessionsTable();
    await initSubscriptionTables();
    await initPaymentTables();

    console.log('✅ All tables initialized');

    // 开发用户标识
    const devEmail = 'dev@local.test';
    const devGoogleId = 'dev_local_test_user';
    const devName = '本地开发测试用户';
    const devPicture = 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser&backgroundColor=10b981';

    // 查找或创建开发用户
    let userResult = await sql`
      SELECT * FROM users WHERE email = ${devEmail} OR google_id = ${devGoogleId}
      LIMIT 1
    `;

    let user;
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      // 更新登录时间
      await sql`
        UPDATE users
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE id = ${user.id}
      `;
      console.log('✅ Found existing dev user:', user.email);
    } else {
      // 创建新用户
      const created = await sql`
        INSERT INTO users (email, name, picture, google_id, last_login_at)
        VALUES (${devEmail}, ${devName}, ${devPicture}, ${devGoogleId}, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      user = created.rows[0];
      console.log('✅ Created dev user:', user.email);
    }

    // 确保用户有订阅
    const subCheck = await sql`
      SELECT * FROM user_subscriptions WHERE user_id = ${user.id} AND status = 'active'
    `;

    if (subCheck.rows.length === 0) {
      const periodStart = new Date();
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await sql`
        INSERT INTO user_subscriptions
          (user_id, plan_id, status, billing_period, current_period_start, current_period_end)
        VALUES
          (${user.id}, 'free', 'active', 'monthly', ${periodStart}, ${periodEnd})
      `;
      console.log('✅ Created free subscription');
    }

    // 确保用户有 credits
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
      console.log('✅ Created credits account with 10000 credits');
    }

    // 生成 JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    return res.status(200).json({
      success: true,
      message: 'Development environment initialized',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      },
      token,
      instructions: {
        step1: 'Copy the token below',
        step2: 'Open http://localhost:3000 in browser',
        step3: 'Open Console (F12) and run:',
        step4: `localStorage.setItem('auth_token', '${token}')`,
        step5: 'Refresh the page'
      }
    });

  } catch (error) {
    console.error('❌ Init error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Initialization failed',
      details: errorMessage
    });
  }
}
