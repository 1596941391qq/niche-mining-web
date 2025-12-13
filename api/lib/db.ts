import { createPool } from '@vercel/postgres';

/**
 * 环境变量分析：
 * 
 * 1. POSTGRES_URL: postgres://...@db.prisma.io:5432/... (直接连接，端口 5432)
 * 2. DATABASE_URL: postgres://...@db.prisma.io:5432/... (直接连接，端口 5432，和 POSTGRES_URL 相同)
 * 3. PRISMA_DATABASE_URL: prisma+postgres://accelerate.prisma-data.net/... (Prisma Accelerate，不适用于 @vercel/postgres)
 * 
 * 问题：Vercel Prisma Postgres 只提供了直接连接字符串，没有提供连接池字符串。
 * 
 * 解决方案：将端口从 5432 改为 6543（Vercel Postgres 连接池端口）
 * 
 * 注意：这不是最佳实践，理想情况下 Vercel 应该提供 POSTGRES_URL（连接池版本）
 * 但在当前情况下，这是可行的解决方案。
 */
function convertToPooledConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString);

    // 跳过 Prisma Accelerate URL（不适用于 @vercel/postgres）
    if (url.protocol === 'prisma+postgres:') {
      throw new Error('PRISMA_DATABASE_URL (Accelerate) is not supported by @vercel/postgres');
    }

    // 如果端口是 5432（直接连接），改为 6543（连接池）
    if (url.port === '5432') {
      url.port = '6543';
    }

    // 确保 sslmode 参数存在
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    return url.toString();
  } catch (error) {
    console.error('Error parsing connection string:', error);
    throw error;
  }
}

// 获取连接字符串（优先使用 POSTGRES_URL，跳过 PRISMA_DATABASE_URL）
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'No database connection string found. ' +
    'Please ensure POSTGRES_URL or DATABASE_URL is set. ' +
    'Note: PRISMA_DATABASE_URL (Accelerate) is not supported by @vercel/postgres.'
  );
}

// 转换为连接池字符串（将端口从 5432 改为 6543）
const pooledConnectionString = convertToPooledConnectionString(connectionString);

// 创建连接池
const pool = createPool({ connectionString: pooledConnectionString });

// 创建 sql 包装函数以支持模板字符串语法
// @vercel/postgres 的 pool 对象需要通过 query 方法使用
export const sql = <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<{ rows: T[] }> => {
  // 构建 SQL 查询字符串
  let queryText = '';
  for (let i = 0; i < strings.length; i++) {
    queryText += strings[i];
    if (i < values.length) {
      queryText += `$${i + 1}`;
    }
  }

  // 使用 pool.query 执行查询
  return pool.query<T>(queryText, values);
};

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

