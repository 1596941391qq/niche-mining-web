import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initUsersTable } from './lib/db';

/**
 * 初始化数据库表的 API 端点
 * 访问: GET /api/init-db
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initUsersTable();
    return res.status(200).json({ 
      message: 'Database initialized successfully',
      tables: ['users']
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

