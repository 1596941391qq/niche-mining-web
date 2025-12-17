import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';

/**
 * 测试 API：为指定用户设置订阅和 Credits
 * POST /api/test/setup-credits
 *
 * Body: {
 *   "userId": "uuid-here",
 *   "plan": "free" | "pro" | "enterprise",
 *   "credits": 1000
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, plan = 'pro', credits = 10000 } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // 1. 检查用���是否存在
    const userCheck = await sql`
      SELECT id, email, name FROM users WHERE id = ${userId}
    `;

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userCheck.rows[0];

    // 2. 创建或更新用户订阅
    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // 删除旧订阅
    await sql`
      DELETE FROM user_subscriptions WHERE user_id = ${userId}
    `;

    // 创建新订阅
    await sql`
      INSERT INTO user_subscriptions
        (user_id, plan_id, status, billing_period, current_period_start, current_period_end)
      VALUES
        (${userId}, ${plan}, 'active', 'monthly', ${periodStart}, ${periodEnd})
    `;

    // 3. 创建或更新 Credits 账户
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1);

    // 先尝试删除旧记录
    await sql`
      DELETE FROM user_credits WHERE user_id = ${userId}
    `;

    // 创建新的 credits 记录
    await sql`
      INSERT INTO user_credits
        (user_id, total_credits, used_credits, bonus_credits, last_reset_at, next_reset_at)
      VALUES
        (${userId}, ${credits}, 0, 0, ${new Date()}, ${nextReset})
    `;

    // 4. 记录 Credits 交易
    await sql`
      INSERT INTO credits_transactions
        (user_id, type, credits_delta, credits_before, credits_after, description)
      VALUES
        (${userId}, 'bonus', ${credits}, 0, ${credits}, 'Test credits setup')
    `;

    return res.status(200).json({
      success: true,
      message: 'Test credits setup successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        subscription: {
          plan,
          status: 'active',
          periodStart,
          periodEnd
        },
        credits: {
          total: credits,
          used: 0,
          remaining: credits,
          nextReset
        }
      }
    });

  } catch (error) {
    console.error('Setup credits error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to setup credits',
      details: errorMessage
    });
  }
}
