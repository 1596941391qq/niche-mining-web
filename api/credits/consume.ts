import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';

/**
 * 消费 Credits API
 * POST /api/credits/consume
 *
 * ✅ 支持 CORS - 允许子应用调用
 *
 * 从token中获取userId，确保安全性
 * Body: {
 *   "credits": 50,
 *   "description": "API Usage",
 *   "relatedEntity": "seo_agent",
 *   "modeId": "keyword_mining"
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头 - 允许子应用跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证token并获取userId
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - token required' });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = payload.userId;
    const { credits, description = 'API Usage', relatedEntity = 'api', modeId } = req.body;

    if (!credits || credits <= 0) {
      return res.status(400).json({ error: 'credits (> 0) is required' });
    }

    // 1. 获取当前 credits 余额
    const creditsResult = await sql`
      SELECT total_credits, used_credits
      FROM user_credits
      WHERE user_id = ${userId}
    `;

    if (creditsResult.rows.length === 0) {
      return res.status(404).json({ error: 'User credits not found' });
    }

    const currentCredits = creditsResult.rows[0];
    const remaining = currentCredits.total_credits - currentCredits.used_credits;

    // 2. 检查余额是否足够
    if (remaining < credits) {
      return res.status(400).json({
        error: 'Insufficient credits',
        remaining,
        required: credits
      });
    }

    // 3. 更新 used_credits
    const newUsedCredits = currentCredits.used_credits + credits;
    await sql`
      UPDATE user_credits
      SET used_credits = ${newUsedCredits},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;

    // 4. 记录交易
    await sql`
      INSERT INTO credits_transactions
        (user_id, type, credits_delta, credits_before, credits_after, description, related_entity, mode_id)
      VALUES
        (${userId}, 'usage', ${-credits}, ${remaining}, ${remaining - credits}, ${description}, ${relatedEntity}, ${modeId || null})
    `;

    return res.status(200).json({
      success: true,
      consumed: credits,
      remaining: remaining - credits,
      total: currentCredits.total_credits,
      used: newUsedCredits
    });

  } catch (error) {
    console.error('Consume credits error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to consume credits',
      details: errorMessage
    });
  }
}
