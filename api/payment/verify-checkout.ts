import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';

/**
 * 处理支付成功回调
 * GET /api/payment/verify-checkout?checkout_id=xxx&302_signature=xxx
 *
 * 这个端点被 success_url 调用（前端页面跳转后调用）
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { checkout_id, '302_signature': signature } = req.query;

    if (!checkout_id) {
      return res.status(400).json({ error: 'checkout_id is required' });
    }

    console.log('🔍 Verifying checkout:', checkout_id);

    // 从数据库查找订单
    const orderResult = await sql`
      SELECT * FROM payment_orders
      WHERE checkout_id = ${checkout_id as string}
    `;

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // 如果订单已经处理过，直接返回成功
    if (order.status === 'completed') {
      console.log('✅ Order already processed:', checkout_id);
      return res.status(200).json({
        success: true,
        status: 'already_processed',
        order: {
          checkout_id: order.checkout_id,
          plan_id: order.plan_id,
          amount: order.amount,
          paid_at: order.paid_at
        }
      });
    }

    // 调用 302.AI API 验证支付状态
    const apiKey = process.env.PAYMENT_302_API_KEY;
    if (!apiKey) {
      throw new Error('PAYMENT_302_API_KEY not configured');
    }

    const verifyResponse = await fetch(`https://api.302.ai/v1/checkout/${checkout_id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error('302.AI verify error:', errorText);
      return res.status(500).json({
        error: 'Failed to verify payment',
        details: errorText
      });
    }

    const checkoutData = await verifyResponse.json();

    console.log('📊 Checkout status:', checkoutData.status);

    // 如果支付成功，处理订单
    if (checkoutData.status === 'completed' || checkoutData.status === 'paid') {
      await processPaymentSuccess(order);

      return res.status(200).json({
        success: true,
        status: 'payment_verified',
        order: {
          checkout_id: order.checkout_id,
          plan_id: order.plan_id,
          amount: order.amount
        }
      });
    } else {
      // 支付未完成
      return res.status(200).json({
        success: false,
        status: checkoutData.status,
        message: 'Payment not completed yet'
      });
    }

  } catch (error) {
    console.error('Verify checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to verify checkout',
      details: errorMessage
    });
  }
}

/**
 * 处理支付成功后的业务逻辑
 * - 升级用户订阅
 * - 充值 credits
 * - 更新订单状态
 */
async function processPaymentSuccess(order: any) {
  const { user_id, plan_id, checkout_id, amount } = order;

  console.log('💰 Processing payment success:', { user_id, plan_id, amount });

  try {
    // 1. 获取套餐信息
    const planResult = await sql`
      SELECT * FROM subscription_plans WHERE plan_id = ${plan_id}
    `;

    if (planResult.rows.length === 0) {
      throw new Error('Plan not found');
    }

    const plan = planResult.rows[0];
    const creditsToAdd = plan.credits_monthly;

    // 2. 更新或创建用户订阅
    const existingSubscription = await sql`
      SELECT * FROM user_subscriptions
      WHERE user_id = ${user_id} AND status = 'active'
    `;

    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    if (existingSubscription.rows.length > 0) {
      // 更新现有订阅
      await sql`
        UPDATE user_subscriptions
        SET
          plan_id = ${plan_id},
          current_period_start = ${periodStart},
          current_period_end = ${periodEnd},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id} AND status = 'active'
      `;
      console.log('✅ Updated user subscription');
    } else {
      // 创建新订阅
      await sql`
        INSERT INTO user_subscriptions
          (user_id, plan_id, status, billing_period, current_period_start, current_period_end)
        VALUES
          (${user_id}, ${plan_id}, 'active', 'monthly', ${periodStart}, ${periodEnd})
      `;
      console.log('✅ Created new subscription');
    }

    // 3. 充值 credits
    const creditsResult = await sql`
      SELECT * FROM user_credits WHERE user_id = ${user_id}
    `;

    if (creditsResult.rows.length > 0) {
      const currentCredits = creditsResult.rows[0];
      const newTotal = parseInt(currentCredits.total_credits) + creditsToAdd;

      await sql`
        UPDATE user_credits
        SET
          total_credits = ${newTotal},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id}
      `;

      // 记录充值交易
      await sql`
        INSERT INTO credits_transactions
          (user_id, type, credits_delta, credits_before, credits_after, description, related_entity, related_entity_id)
        VALUES
          (${user_id}, 'purchase', ${creditsToAdd}, ${currentCredits.total_credits}, ${newTotal},
           'Credits from ${plan.name_en} subscription purchase', 'payment', ${checkout_id})
      `;

      console.log(`✅ Added ${creditsToAdd} credits (new total: ${newTotal})`);
    } else {
      // 创建 credits 记录
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      nextReset.setDate(1);

      await sql`
        INSERT INTO user_credits
          (user_id, total_credits, used_credits, bonus_credits, last_reset_at, next_reset_at)
        VALUES
          (${user_id}, ${creditsToAdd}, 0, 0, ${new Date()}, ${nextReset})
      `;

      await sql`
        INSERT INTO credits_transactions
          (user_id, type, credits_delta, credits_before, credits_after, description, related_entity, related_entity_id)
        VALUES
          (${user_id}, 'purchase', ${creditsToAdd}, 0, ${creditsToAdd},
           'Initial credits from ${plan.name_en} subscription purchase', 'payment', ${checkout_id})
      `;

      console.log(`✅ Created credits account with ${creditsToAdd} credits`);
    }

    // 4. 更新订单状态
    await sql`
      UPDATE payment_orders
      SET
        status = 'completed',
        paid_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE checkout_id = ${checkout_id}
    `;

    console.log('✅ Payment processing completed successfully');

  } catch (error) {
    console.error('❌ Error processing payment:', error);
    throw error;
  }
}
