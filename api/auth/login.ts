import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserByEmail } from '../lib/db.js';
import { generateToken } from '../lib/auth.js';
import bcrypt from 'bcryptjs';

// 获取前端 URL
function getFrontendUrl(): string {
  if (!process.env.VERCEL_ENV) {
    return 'http://localhost:3000';
  }
  return 'https://www.nichedigger.ai';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 查找用户
    const user = await getUserByEmail(email);
    if (!user) {
      // 不暴露用户是否存在，统一返回错误
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 检查用户是否使用密码登录
    if (user.auth_provider !== 'email') {
      if (user.auth_provider === 'google') {
        return res.status(400).json({ 
          error: 'This email is registered with Google. Please use Google login.',
          authProvider: 'google'
        });
      }
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 验证密码
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 更新最后登录时间
    const { sql } = await import('../lib/db.js');
    await sql`
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // 生成 JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // 设置 cookie
    const isSecure = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_URL?.startsWith('https');
    const secureCookie = isSecure ? 'Secure; ' : '';

    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; ${secureCookie}SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24}`,
    ]);

    // 返回成功响应
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

