// 在本地开发环境中加载 .env.local 文件
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 只在本地开发且未设置 VERCEL 环境变量时加载
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && !process.env.VERCEL_ENV) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const projectRoot = join(__dirname, '../..');
    config({ path: join(projectRoot, '.env.local') });
  } catch (error) {
    // dotenv 加载失败不影响运行
  }
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Google OAuth 配置
 */
// 获取 Google OAuth 配置
function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
  }
  if (!clientSecret) {
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is not set');
  }
  
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/auth/google/callback`
      : 'http://localhost:3000/api/auth/google/callback');
  
  return {
    clientId,
    clientSecret,
    redirectUri,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
  };
}

/**
 * 生成 Google OAuth 授权 URL
 */
export function generateGoogleAuthUrl(state: string): string {
  const config = getGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * 用授权码换取 access token
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const config = getGoogleOAuthConfig();
  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * 使用 access token 获取用户信息
 */
export async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const config = getGoogleOAuthConfig();
  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user info: ${error}`);
  }

  const userInfo = await response.json();
  
  if (!userInfo.verified_email) {
    throw new Error('Google email not verified');
  }

  return userInfo as GoogleUserInfo;
}

/**
 * 生成随机 state 字符串（用于 CSRF 防护）
 */
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

