import type { VercelRequest, VercelResponse } from '@vercel/node';
import { exchangeCodeForToken, getUserInfo } from '../../lib/google-oauth.js';
import { findOrCreateUser, ensureUserHasCreditsAndSubscription } from '../../lib/db.js';
import { generateToken } from '../../lib/auth.js';

// 获取前端 URL（避免重定向到预览域名）
function getFrontendUrl(): string {
  // 本地开发
  if (!process.env.VERCEL_ENV) {
    return 'http://localhost:3000';
  }
  // 生产环境和预览环境都使用生产域名
  return 'https://www.nichedigger.ai';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error } = req.query;

    // 处理 OAuth 错误
    if (error) {
      console.error('OAuth error:', error);
      const baseUrl = getFrontendUrl();
      return res.redirect(`${baseUrl}/?error=oauth_failed`);
    }

    // 验证必要参数
    if (!code || !state) {
      const baseUrl = getFrontendUrl();
      return res.redirect(`${baseUrl}/?error=invalid_request`);
    }

    // 验证 state（CSRF 防护）
    const cookies = req.headers.cookie || '';
    const cookiePairs = cookies.split(';').map(c => c.trim());
    const stateCookie = cookiePairs
      .find(c => c.startsWith('oauth_state='))
      ?.substring('oauth_state='.length);

    console.log('State verification:', {
      receivedState: state,
      cookieState: stateCookie,
      allCookies: cookies,
    });

    if (!stateCookie || stateCookie !== state) {
      const baseUrl = getFrontendUrl();
      console.error('State mismatch!', {
        expected: stateCookie,
        received: state,
      });
      return res.redirect(`${baseUrl}/?error=invalid_state&debug=1`);
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

    // 🔧 确保用户拥有必需的 credits 和 subscription 记录
    // 对于新用户或缺少记录的老用户，会自动创建
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

    // 构建前端 URL
    const baseUrl = getFrontendUrl();
    const frontendUrl = `${baseUrl}/?token=${token}`;

    // 根据环境设置 cookie（与 login.ts 保持一致）
    const isSecure = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_URL?.startsWith('https');
    const secureCookie = isSecure ? 'Secure; ' : '';

    // 设置响应头
    res.setHeader('Set-Cookie', [
      `oauth_state=; HttpOnly; ${secureCookie}SameSite=Lax; Path=/; Max-Age=0`, // 清除 state
      `auth_token=${token}; HttpOnly; ${secureCookie}SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24}`, // 设置 token
    ]);

    res.redirect(frontendUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    const baseUrl = getFrontendUrl();
    return res.redirect(`${baseUrl}/?error=auth_failed`);
  }
}

