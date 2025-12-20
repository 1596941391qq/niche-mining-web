import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * 测试验证支付（手动指定 checkout_id）
 * GET /api/admin/test-verify-payment?checkout_id=xxx
 *
 * 用于调试支付验证问题
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { checkout_id } = req.query;

    if (!checkout_id) {
      return res.status(400).json({ error: 'checkout_id is required' });
    }

    const apiKey = process.env.PAYMENT_302_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'PAYMENT_302_API_KEY not configured' });
    }

    console.log('Testing verify for checkout_id:', checkout_id);

    // 调用 302.AI API
    const verifyResponse = await fetch(`https://api.302.ai/v1/checkout/${checkout_id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await verifyResponse.text();
    console.log('302.AI Response Status:', verifyResponse.status);
    console.log('302.AI Response Body:', responseText);

    let checkoutData;
    try {
      checkoutData = JSON.parse(responseText);
    } catch (e) {
      return res.status(200).json({
        raw_response: responseText,
        error: 'Invalid JSON response'
      });
    }

    return res.status(200).json({
      success: true,
      data: checkoutData,
      status_field: checkoutData.status || checkoutData.data?.status
    });

  } catch (error) {
    console.error('Test verify error:', error);
    return res.status(500).json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
