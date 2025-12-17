import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';

/**
 * 获取用户 Credits 信息
 * GET /api/user/credits
 *
 * Headers:
 *   Authorization: Bearer <JWT_TOKEN>
 *
 * Response: {
 *   userId: string,
 *   credits: {
 *     total: number,
 *     used: number,
 *     remaining: number,
 *     bonus: number
 *   },
 *   subscription: {
 *     plan: string,
 *     status: string,
 *     creditsMonthly: number
 *   }
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 验证 JWT Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = payload.userId;

    // 2. 查询用户 Credits 信息
    const creditsResult = await sql`
      SELECT
        total_credits,
        used_credits,
        bonus_credits,
        (total_credits - used_credits) AS remaining_credits,
        last_reset_at,
        next_reset_at
      FROM user_credits
      WHERE user_id = ${userId}
    `;

    if (creditsResult.rows.length === 0) {
      // 用户没有 credits 记录，返回默认值
      return res.status(200).json({
        userId,
        credits: {
          total: 0,
          used: 0,
          remaining: 0,
          bonus: 0
        },
        subscription: null,
        message: 'No credits account found. Please contact support.'
      });
    }

    const creditsData = creditsResult.rows[0];

    // 3. 查询用户订阅信息
    const subscriptionResult = await sql`
      SELECT
        us.plan_id,
        us.status,
        us.current_period_start,
        us.current_period_end,
        sp.name_en AS plan_name,
        sp.credits_monthly
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.plan_id
      WHERE us.user_id = ${userId} AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `;

    const subscription = subscriptionResult.rows.length > 0
      ? {
          plan: subscriptionResult.rows[0].plan_id,
          planName: subscriptionResult.rows[0].plan_name,
          status: subscriptionResult.rows[0].status,
          creditsMonthly: subscriptionResult.rows[0].credits_monthly,
          currentPeriodStart: subscriptionResult.rows[0].current_period_start,
          currentPeriodEnd: subscriptionResult.rows[0].current_period_end
        }
      : null;

    // 4. 返回完整信息
    return res.status(200).json({
      userId,
      credits: {
        total: creditsData.total_credits,
        used: creditsData.used_credits,
        remaining: creditsData.remaining_credits,
        bonus: creditsData.bonus_credits,
        lastResetAt: creditsData.last_reset_at,
        nextResetAt: creditsData.next_reset_at
      },
      subscription
    });

  } catch (error) {
    console.error('Get user credits error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to get user credits',
      details: errorMessage
    });
  }
}
