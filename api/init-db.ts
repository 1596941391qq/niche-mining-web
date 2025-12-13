import { initUsersTable } from './lib/db';

/**
 * 初始化数据库表的脚本
 * 可以通过 Vercel CLI 运行：vercel dev 或部署后通过 API 调用
 */
export default async function handler() {
  try {
    await initUsersTable();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database initialized successfully' }),
    };
  } catch (error) {
    console.error('Database initialization error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to initialize database' }),
    };
  }
}

