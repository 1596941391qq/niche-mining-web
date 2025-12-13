import { sql } from '@vercel/postgres';

// @vercel/postgres 的 sql 函数会自动使用 POSTGRES_URL 环境变量
// Vercel Prisma Postgres 会自动设置 POSTGRES_URL（连接池字符串）
// 这个环境变量已经在你的 Vercel 项目中配置好了

export { sql };

export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  google_id: string;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
}

/**
 * 初始化用户表（如果不存在）
 */
export async function initUsersTable() {
  try {
    // 先测试数据库连接
    await sql`SELECT 1`;
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture VARCHAR(500),
        google_id VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP
      );
    `;
    
    // 创建索引以提高查询性能
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `;
    
    console.log('Users table initialized successfully');
  } catch (error) {
    console.error('Error initializing users table:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Database initialization failed: ${errorMessage}`);
  }
}

/**
 * 根据 Google ID 查找或创建用户
 */
export async function findOrCreateUser(googleUser: {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}): Promise<User> {
  try {
    // 确保表存在
    await initUsersTable();
    
    // 首先尝试查找现有用户
    const existingUser = await sql<User>`
      SELECT * FROM users WHERE google_id = ${googleUser.id}
    `;

    if (existingUser.rows.length > 0) {
      // 更新最后登录时间和用户信息
      const updatedUser = await sql<User>`
        UPDATE users 
        SET 
          email = ${googleUser.email},
          name = ${googleUser.name || null},
          picture = ${googleUser.picture || null},
          updated_at = CURRENT_TIMESTAMP,
          last_login_at = CURRENT_TIMESTAMP
        WHERE google_id = ${googleUser.id}
        RETURNING *
      `;
      return updatedUser.rows[0];
    }

    // 创建新用户
    const newUser = await sql<User>`
      INSERT INTO users (email, name, picture, google_id, last_login_at)
      VALUES (${googleUser.email}, ${googleUser.name || null}, ${googleUser.picture || null}, ${googleUser.id}, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    return newUser.rows[0];
  } catch (error) {
    console.error('Error finding or creating user:', error);
    throw error;
  }
}

/**
 * 根据 ID 获取用户
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await sql<User>`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
}

/**
 * 根据 email 获取用户
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql<User>`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

