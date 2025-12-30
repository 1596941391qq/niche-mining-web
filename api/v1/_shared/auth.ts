import type { VercelRequest } from '@vercel/node';
import { verifyToken } from '../../lib/auth.js';
import { getApiKeyByHash, updateApiKeyLastUsed, getUserById } from '../../lib/db.js';
import { createHash } from 'crypto';

/**
 * 认证结果
 */
export interface AuthResult {
  userId: string;
  authType: 'jwt' | 'api_key';
  apiKeyId?: string;
}

/**
 * 从请求中提取并验证认证信息
 * 支持 JWT token 和 API key 两种方式
 */
export async function authenticateRequest(req: VercelRequest): Promise<AuthResult | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // 尝试作为 JWT token 验证
  try {
    const payload = await verifyToken(token);
    if (payload) {
      const user = await getUserById(payload.userId);
      if (user) {
        return {
          userId: payload.userId,
          authType: 'jwt',
        };
      }
    }
  } catch (error) {
    // JWT 验证失败，继续尝试 API key
  }

  // 尝试作为 API key 验证
  try {
    // API key 格式: nm_live_<hex>
    if (token.startsWith('nm_live_')) {
      const keyHash = createHash('sha256').update(token).digest('hex');
      const apiKey = await getApiKeyByHash(keyHash);

      if (apiKey && apiKey.is_active) {
        // 检查是否过期
        if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
          return null;
        }

        // 更新最后使用时间（异步，不阻塞）
        updateApiKeyLastUsed(apiKey.id).catch((err) => {
          console.error('Failed to update API key last used:', err);
        });

        // 获取用户信息
        const user = await getUserById(apiKey.user_id);
        if (user) {
          return {
            userId: apiKey.user_id,
            authType: 'api_key',
            apiKeyId: apiKey.id,
          };
        }
      }
    }
  } catch (error) {
    // API key 验证失败
    console.error('API key verification error:', error);
  }

  return null;
}

/**
 * 从请求中提取 token（用于向后兼容）
 */
export function extractToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

