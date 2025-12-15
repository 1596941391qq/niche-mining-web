import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../lib/auth.js';
import { getUserById } from '../lib/db.js';

/**
 * 用于子项目验证 token 的端点
 * 支持 CORS，允许子项目调用
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从 Authorization header 或 query 参数获取 token
    const authHeader = req.headers.authorization;
    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = (req.query.token as string) || (req.body?.token as string) || null;
    }

    if (!token) {
      return res.status(200).json({ valid: false, error: 'No token provided' });
    }

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(200).json({ valid: false, error: 'Invalid token' });
    }

    // 获取用户信息
    const user = await getUserById(payload.userId);
    if (!user) {
      return res.status(200).json({ valid: false, error: 'User not found' });
    }

    // 返回验证结果和用户基本信息
    return res.status(200).json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ valid: false, error: 'Verification failed' });
  }
}

