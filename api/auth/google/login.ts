import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGoogleAuthUrl, generateState } from '../../lib/google-oauth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 检查环境变量
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'GOOGLE_CLIENT_ID environment variable is not set'
      });
    }
    
    // 生成 state（CSRF 防护）
    const state = generateState();
    
    // 设置 state cookie（24小时过期）
    // 注意：本地开发时 Secure 标志可能导致 cookie 无法设置，所以根据环境调整
    const isProduction = process.env.VERCEL_ENV === 'production';
    const cookieOptions = isProduction 
      ? 'HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400'
      : 'HttpOnly; SameSite=Lax; Path=/; Max-Age=86400';
    res.setHeader('Set-Cookie', `oauth_state=${state}; ${cookieOptions}`);
    
    // 重定向到 Google OAuth 授权页面
    res.redirect(generateGoogleAuthUrl(state));
  } catch (error) {
    console.error('Google login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Failed to initiate Google login',
      details: errorMessage
    });
  }
}

