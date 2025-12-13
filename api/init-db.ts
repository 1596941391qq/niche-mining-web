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
    // 检查环境变量
    const hasDbUrl = !!(
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL
    );

    if (!hasDbUrl) {
      return res.status(500).json({ 
        error: 'Database connection not configured',
        message: 'Missing POSTGRES_URL, DATABASE_URL, or POSTGRES_PRISMA_URL environment variable',
        hint: 'Please ensure your Prisma Postgres database is connected to this project in Vercel Dashboard'
      });
    }

    await initUsersTable();
    return res.status(200).json({ 
      message: 'Database initialized successfully',
      tables: ['users']
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return res.status(500).json({ 
      error: 'Failed to initialize database',
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      hint: 'Check Vercel function logs for detailed error information'
    });
  }
}

