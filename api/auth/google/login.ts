import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGoogleAuthUrl, generateState } from '../../lib/google-oauth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 生成 state（CSRF 防护）
    const state = generateState();
    
    // 设置 state cookie（24小时过期）
    res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24}`);
    
    // 重定向到 Google OAuth 授权页面
    res.redirect(generateGoogleAuthUrl(state));
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ error: 'Failed to initiate Google login' });
  }
}

