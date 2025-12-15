import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGoogleAuthUrl, generateState } from '../../lib/google-oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 预览部署禁用 OAuth（Google 不支持动态域名）
    if (process.env.VERCEL_ENV === 'preview') {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
      return res.redirect(`${baseUrl}/?error=oauth_disabled_in_preview`);
    }

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

    console.log('Login initiated:', {
      state,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
    });

    // 设置 state cookie（24小时过期）
    // 注意：Vercel 预览部署也使用 HTTPS，所以需要 Secure 标志
    const isSecure = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_URL?.startsWith('https');
    const cookieOptions = isSecure
      ? 'HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400'
      : 'HttpOnly; SameSite=Lax; Path=/; Max-Age=86400';

    console.log('Setting cookie with options:', cookieOptions);
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

