import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { generateToken } from '../lib/auth.js';
import crypto from 'crypto';

/**
 * 验证并兑换 Transfer Token
 * 子应用使用此端点来验证 transfer token 并获取用户的 JWT token
 * POST /api/auth/exchange-transfer-token
 *
 * 支持 CORS，允许子项目调用
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transferToken } = req.body;

    if (!transferToken) {
      return res.status(400).json({ error: 'Transfer token is required' });
    }

    // 1. 计算 SHA256 哈希值
    const tokenHash = crypto
      .createHash('sha256')
      .update(transferToken)
      .digest('hex');

    // 2. 从数据库查找并验证 transfer token
    const sessions = await sql`
      SELECT user_id, expires_at FROM sessions
      WHERE token_hash = ${tokenHash}
    `;

    if (sessions.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid transfer token' });
    }

    const session = sessions.rows[0];

    // 3. 检查是否过期
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      // 删除过期的 token
      await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;
      return res.status(401).json({ error: 'Transfer token expired' });
    }

    // 4. 获取用户信息
    const users = await sql`
      SELECT id, email, name, picture FROM users WHERE id = ${session.user_id}
    `;

    if (users.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users.rows[0];

    // 5. 生成新的 JWT token 给子应用
    const jwtToken = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // 6. 删除已使用的 transfer token（一次性使用）
    await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;

    console.log('✅ Transfer token exchanged for user:', user.email);

    // 7. 返回 JWT token 和用户信息
    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });

  } catch (error) {
    console.error('Exchange transfer token error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to exchange transfer token',
      details: errorMessage,
    });
  }
}
