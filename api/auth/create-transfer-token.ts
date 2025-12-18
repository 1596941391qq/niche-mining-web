import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../lib/auth.js';
import { sql } from '../lib/db.js';
import crypto from 'crypto';

/**
 * 创建 Transfer Token API
 * 用于生成一次性传输令牌，以便将登录状态共享到子项目
 * POST /api/auth/create-transfer-token
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 验证用户的主 JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);

    // 验证 JWT token 并获取真实的 userId
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = payload.userId;
    console.log('✅ Creating transfer token for user:', userId);

    // 2. 生成随机 Transfer Token (64位十六进制字符串)
    const transferToken = crypto.randomBytes(32).toString('hex');

    // 3. 计算 SHA256 哈希值
    const tokenHash = crypto
      .createHash('sha256')
      .update(transferToken)
      .digest('hex');

    // 4. 存入数据库 (5分钟过期)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后

    await sql`
      INSERT INTO sessions (user_id, token_hash, expires_at)
      VALUES (${userId}, ${tokenHash}, ${expiresAt})
    `;

    console.log('✅ Transfer token created and stored in database');

    // 5. 返回明文 transfer token（仅此一次）
    return res.status(200).json({
      transferToken,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('Create transfer token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
