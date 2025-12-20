import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';

/**
 * 查询支付订单状态
 * GET /api/admin/get-order-status?checkout_id=xxx
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { checkout_id } = req.query;

    if (!checkout_id) {
      return res.status(400).json({ error: 'checkout_id is required' });
    }

    // 查询订单
    const orderResult = await sql`
      SELECT
        po.*,
        u.email as user_email,
        u.name as user_name,
        sp.name_en as plan_name,
        sp.credits_monthly
      FROM payment_orders po
      LEFT JOIN users u ON po.user_id = u.id
      LEFT JOIN subscription_plans sp ON po.plan_id = sp.plan_id
      WHERE po.checkout_id = ${checkout_id as string}
    `;

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // 查询用户当前状态
    const userStatus = await sql`
      SELECT
        us.plan_id as current_plan,
        uc.total_credits,
        uc.used_credits
      FROM users u
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
      LEFT JOIN user_credits uc ON u.id = uc.user_id
      WHERE u.id = ${order.user_id}
    `;

    const user = userStatus.rows[0];

    return res.status(200).json({
      success: true,
      order: {
        checkout_id: order.checkout_id,
        plan_id: order.plan_id,
        plan_name: order.plan_name,
        amount: order.amount,
        status: order.status,
        created_at: order.created_at,
        paid_at: order.paid_at,
        credits_monthly: order.credits_monthly
      },
      user: {
        email: order.user_email,
        current_plan: user?.current_plan,
        total_credits: user?.total_credits,
        used_credits: user?.used_credits
      },
      mismatch: order.status === 'completed' && (
        user?.current_plan !== order.plan_id ||
        (order.credits_monthly && user?.total_credits < order.credits_monthly)
      )
    });

  } catch (error) {
    console.error('Error getting order status:', error);
    return res.status(500).json({
      error: 'Failed to get order status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
