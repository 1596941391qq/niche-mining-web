import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

// 重命名为 AppJWTPayload 避免与 jose 库的 JWTPayload 冲突
export interface AppJWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * 生成 JWT token
 */
export async function generateToken(payload: Omit<AppJWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRES_IN}s`)
    .sign(JWT_SECRET);

  return token;
}

/**
 * 验证 JWT token
 */
export async function verifyToken(token: string): Promise<AppJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // 使用 unknown 作为中间类型来避免类型冲突
    return payload as unknown as AppJWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * 从请求中获取 token（支持 cookie 和 Authorization header）
 */
export function getTokenFromRequest(request: Request): string | null {
  // 1. 尝试从 Authorization header 获取
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. 尝试从 cookie 获取（对于 Vercel Serverless，需要使用 cookies()）
  // 注意：在 Serverless Functions 中，我们需要通过不同的方式处理
  // 这里我们主要依赖 header 方式，cookie 方式需要在调用处处理
  
  return null;
}

/**
 * 设置认证 cookie
 */
export function createAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return `auth_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${JWT_EXPIRES_IN}${
    isProduction ? '; Domain=.vercel.app' : ''
  }`;
}

/**
 * 清除认证 cookie
 */
export function createLogoutCookie(): string {
  return 'auth_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0';
}

