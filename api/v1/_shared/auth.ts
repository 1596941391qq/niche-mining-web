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
  
  // 处理 header 可能是数组的情况
  const authHeaderValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  if (!authHeaderValue || typeof authHeaderValue !== 'string' || !authHeaderValue.startsWith('Bearer ')) {
    console.log('No valid Authorization header found');
    return null;
  }

  const token = authHeaderValue.substring(7).trim();
  
  // 检查 token 是否包含 ...（表示不完整的 API key）
  if (token.includes('...')) {
    console.log('Invalid token: contains "..." which indicates incomplete API key');
    return null;
  }
  
  console.log('Authenticating with token (first 20 chars):', token.substring(0, 20) + '...');

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

      if (!apiKey) {
        console.log('API key not found in database for hash:', keyHash.substring(0, 16) + '...');
        return null;
      }

      if (!apiKey.is_active) {
        console.log('API key is not active:', apiKey.id);
        return null;
      }

      // 检查是否过期
      if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
        console.log('API key has expired:', apiKey.id, 'expires_at:', apiKey.expires_at);
        return null;
      }

      // 更新最后使用时间（异步，不阻塞）
      updateApiKeyLastUsed(apiKey.id).catch((err) => {
        console.error('Failed to update API key last used:', err);
      });

      // 获取用户信息
      const user = await getUserById(apiKey.user_id);
      if (!user) {
        console.log('User not found for API key:', apiKey.id, 'user_id:', apiKey.user_id);
        return null;
      }

      return {
        userId: apiKey.user_id,
        authType: 'api_key',
        apiKeyId: apiKey.id,
      };
    }
  } catch (error) {
    // API key 验证失败
    console.error('API key verification error:', error);
    // 重新抛出错误以便上层处理，或者返回 null
    // 这里返回 null 以便继续执行，但记录错误
  }

  return null;
}

/**
 * 从请求中提取 token（用于向后兼容）
 */
export function extractToken(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  
  // 处理 header 可能是数组的情况
  const authHeaderValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  
  if (!authHeaderValue || typeof authHeaderValue !== 'string' || !authHeaderValue.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeaderValue.substring(7);
}

