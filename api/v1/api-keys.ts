import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../lib/auth.js';
import {
  createApiKey,
  getUserApiKeys,
  deleteApiKey,
  getUserById,
} from '../lib/db.js';
import { setCorsHeaders, handleOptions, sendErrorResponse } from './_shared/request-handler.js';

/**
 * API Key 管理端点
 * 
 * POST /api/v1/api-keys - 创建新的 API key
 * GET /api/v1/api-keys - 获取用户的所有 API keys
 * DELETE /api/v1/api-keys/:id - 删除指定的 API key
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      return handleOptions(res);
    }

    // 提取并验证 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization token required. Please provide Bearer token in Authorization header.',
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token.',
      });
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found.',
      });
    }

    // 路由到相应的处理函数
    switch (req.method) {
      case 'POST':
        return await handleCreateApiKey(req, res, user.id);
      case 'GET':
        return await handleGetApiKeys(req, res, user.id);
      case 'DELETE':
        return await handleDeleteApiKey(req, res, user.id);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: `Method ${req.method} is not supported.`,
        });
    }
  } catch (error: any) {
    console.error('API Keys API error:', error);
    return sendErrorResponse(res, error, 'Failed to process API keys request');
  }
}

/**
 * 创建新的 API Key
 */
async function handleCreateApiKey(
  req: VercelRequest,
  res: VercelResponse,
  userId: string
) {
  try {
    const body = req.body || {};
    const { name, expiresAt } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'name is required and must be a non-empty string',
      });
    }

    if (name.length > 255) {
      return res.status(400).json({
        error: 'Invalid field',
        message: 'name must be 255 characters or less',
      });
    }

    // 解析过期时间（如果提供）
    let expiresAtDate: Date | undefined;
    if (expiresAt) {
      expiresAtDate = new Date(expiresAt);
      if (isNaN(expiresAtDate.getTime())) {
        return res.status(400).json({
          error: 'Invalid field',
          message: 'expiresAt must be a valid date string',
        });
      }
    }

    const result = await createApiKey(userId, name.trim(), expiresAtDate);

    return res.status(201).json({
      success: true,
      data: {
        id: result.id,
        name: name.trim(),
        apiKey: result.apiKey, // 只在创建时返回完整 key
        keyPrefix: result.keyPrefix,
        expiresAt: expiresAtDate || null,
        createdAt: new Date().toISOString(),
      },
      warning: 'Please save your API key securely. You will not be able to see it again.',
    });
  } catch (error: any) {
    console.error('Create API key error:', error);
    if (error.message?.includes('limit reached')) {
      return res.status(403).json({
        error: 'API key limit reached',
        message: error.message,
      });
    }
    return sendErrorResponse(res, error, 'Failed to create API key');
  }
}

/**
 * 获取用户的所有 API Keys
 */
async function handleGetApiKeys(
  req: VercelRequest,
  res: VercelResponse,
  userId: string
) {
  try {
    const apiKeys = await getUserApiKeys(userId);

    // 不返回完整的 key，只返回前缀
    const sanitizedKeys = apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.key_prefix,
      lastUsedAt: key.last_used_at ? new Date(key.last_used_at).toISOString() : null,
      expiresAt: key.expires_at ? new Date(key.expires_at).toISOString() : null,
      isActive: key.is_active,
      createdAt: new Date(key.created_at).toISOString(),
      updatedAt: new Date(key.updated_at).toISOString(),
    }));

    return res.json({
      success: true,
      data: {
        apiKeys: sanitizedKeys,
        count: sanitizedKeys.length,
      },
    });
  } catch (error: any) {
    console.error('Get API keys error:', error);
    return sendErrorResponse(res, error, 'Failed to get API keys');
  }
}

/**
 * 删除 API Key
 */
async function handleDeleteApiKey(
  req: VercelRequest,
  res: VercelResponse,
  userId: string
) {
  try {
    const keyId = req.query.id as string;

    if (!keyId) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'id parameter is required',
      });
    }

    const deleted = await deleteApiKey(keyId, userId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not found',
        message: 'API key not found or you do not have permission to delete it',
      });
    }

    return res.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete API key error:', error);
    return sendErrorResponse(res, error, 'Failed to delete API key');
  }
}

