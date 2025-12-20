import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';

/**
 * 检查支付订单状态（用于调试）
 * GET /api/admin/check-payment-status
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 仅开发环境可用
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    // 查询所有订单
    const ordersResult = await sql`
      SELECT
        po.id,
        po.checkout_id,
        po.user_id,
        po.plan_id,
        po.amount,
        po.status,
        po.created_at,
        po.paid_at,
        us.plan_id as user_current_plan,
        u.email
      FROM payment_orders po
      LEFT JOIN user_subscriptions us ON po.user_id = us.user_id AND us.status = 'active'
      LEFT JOIN users u ON po.user_id = u.id
      ORDER BY po.created_at DESC
      LIMIT 20
    `;

    // 检查异常订单：status=pending 但用户套餐已升级
    const anomalies = ordersResult.rows.filter(order => {
      return order.status === 'pending' && order.user_current_plan === order.plan_id;
    });

    return res.status(200).json({
      total_orders: ordersResult.rows.length,
      orders: ordersResult.rows,
      anomalies: {
        count: anomalies.length,
        details: anomalies,
        message: anomalies.length > 0
          ? '⚠️ 发现未支付订单但套餐已升级的异常情况！'
          : '✅ 未发现异常订单'
      }
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    return res.status(500).json({
      error: 'Failed to check payment status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
