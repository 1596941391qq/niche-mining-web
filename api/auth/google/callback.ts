import type { VercelRequest, VercelResponse } from '@vercel/node';
import { exchangeCodeForToken, getUserInfo } from '../../lib/google-oauth';
import { findOrCreateUser } from '../../lib/db';
import { generateToken } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error } = req.query;

    // 处理 OAuth 错误
    if (error) {
      console.error('OAuth error:', error);
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      return res.redirect(`${baseUrl}/?error=oauth_failed`);
    }

    // 验证必要参数
    if (!code || !state) {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      return res.redirect(`${baseUrl}/?error=invalid_request`);
    }

    // 验证 state（CSRF 防护）
    const cookies = req.headers.cookie || '';
    const stateCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('oauth_state='))
      ?.split('=')[1];
    
    if (!stateCookie || stateCookie !== state) {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
      return res.redirect(`${baseUrl}/?error=invalid_state`);
    }

    // 用授权码换取 access token
    const accessToken = await exchangeCodeForToken(code as string);

    // 获取用户信息
    const googleUserInfo = await getUserInfo(accessToken);

    // 查找或创建用户
    const user = await findOrCreateUser({
      id: googleUserInfo.id,
      email: googleUserInfo.email,
      name: googleUserInfo.name,
      picture: googleUserInfo.picture,
    });

    // 生成 JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // 构建前端 URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const frontendUrl = `${baseUrl}/?token=${token}`;
    
    // 设置响应头
    res.setHeader('Set-Cookie', [
      `oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`, // 清除 state
      `auth_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24}`, // 设置 token
    ]);
    
    res.redirect(frontendUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    return res.redirect(`${baseUrl}/?error=auth_failed`);
  }
}

