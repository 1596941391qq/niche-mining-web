import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../../lib/auth';
import { getUserById } from '../../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从 Authorization header 获取 token
    const authHeader = req.headers.authorization;
    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // 从 cookie 获取
      const cookies = req.headers.cookie || '';
      const authCookie = cookies
        .split(';')
        .find(c => c.trim().startsWith('auth_token='))
        ?.split('=')[1];
      token = authCookie || null;
    }

    if (!token) {
      return res.status(200).json({ user: null, authenticated: false });
    }

    // 验证 token
    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(200).json({ user: null, authenticated: false });
    }

    // 获取用户信息
    const user = await getUserById(payload.userId);
    if (!user) {
      return res.status(200).json({ user: null, authenticated: false });
    }

    // 返回用户信息（不包含敏感信息）
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        lastLoginAt: user.last_login_at,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ error: 'Failed to get session' });
  }
}

