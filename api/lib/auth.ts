import { SignJWT, jwtVerify } from 'jose';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

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
    return payload as unknown as AppJWTPayload;
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.warn('JWT expired at:', new Date(error.payload?.exp * 1000));
    } else {
      console.error('Token verification failed:', error);
    }
    return null;
  }
}

/**
 * API 认证包装器：统一处理 CORS、Token 验证和错误捕获
 */
export function withAuth(handler: (req: VercelRequest, res: VercelResponse, payload: AppJWTPayload) => Promise<any>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // 1. 统一 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    try {
      // 2. 验证 Token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' });
      }

      const token = authHeader.substring(7);
      const payload = await verifyToken(token);

      if (!payload || !payload.userId) {
        return res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
      }

      // 3. 执行实际的业务逻辑
      return await handler(req, res, payload);
    } catch (error: any) {
      console.error('API Error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  };
}

