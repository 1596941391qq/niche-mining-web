import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPasswordUser, getUserByEmail, ensureUserHasCreditsAndSubscription } from '../lib/db.js';
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
    const { email, password, name } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 验证密码强度（至少8位）
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // 检查邮箱是否已存在
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      // 如果用户存在且是 Google 用户，提示使用 Google 登录
      if (existingUser.auth_provider === 'google') {
        return res.status(400).json({ 
          error: 'This email is already registered with Google. Please use Google login.',
          authProvider: 'google'
        });
      }
      // 如果用户存在且是密码用户，提示已注册
      if (existingUser.auth_provider === 'email') {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    // 哈希密码
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const user = await createPasswordUser({
      email,
      passwordHash,
      name: name || null,
    });

    // 确保用户拥有必需的 credits 和 subscription 记录
    const provisionResult = await ensureUserHasCreditsAndSubscription(user.id);

    if (provisionResult.subscriptionCreated || provisionResult.creditsCreated) {
      console.log('✅ Auto-provisioned user data:', {
        userId: user.id,
        subscriptionCreated: provisionResult.subscriptionCreated,
        creditsCreated: provisionResult.creditsCreated,
      });
    }

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
    return res.status(201).json({
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
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // 如果是邮箱已存在的错误，返回特定错误
    if (errorMessage.includes('already registered') || errorMessage.includes('Email already')) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    return res.status(500).json({ 
      error: 'Registration failed',
      details: errorMessage
    });
  }
}

