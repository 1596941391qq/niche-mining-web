/**
 * 环境变量分析：
 * 
 * 1. POSTGRES_URL: postgres://...@db.prisma.io:5432/... (直接连接，端口 5432)
 * 2. DATABASE_URL: postgres://...@db.prisma.io:5432/... (直接连接，端口 5432)
 * 3. PRISMA_DATABASE_URL: prisma+postgres://accelerate.prisma-data.net/... (Prisma Accelerate)
 * 
 * 问题：Vercel Prisma Postgres 提供的是直接连接字符串，@vercel/postgres 的 createPool 需要连接池字符串。
 * 
 * 解决方案：使用标准的 pg 库 (node-postgres)
 * 这样可以接受直接连接字符串，并在 Serverless 环境中工作
 */
import { Client, QueryResultRow } from 'pg';

// 获取连接字符串
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'No database connection string found. ' +
    'Please ensure POSTGRES_URL or DATABASE_URL is set.'
  );
}

// 创建 sql 模板字符串函数
// 每次调用创建新的客户端连接（在 Serverless 环境中这是可接受的）
export const sql = async <T extends QueryResultRow = any>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<{ rows: T[] }> => {
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // 构建参数化查询
    let queryText = '';
    const params: any[] = [];
    let paramIndex = 1;

    for (let i = 0; i < strings.length; i++) {
      queryText += strings[i];
      if (i < values.length) {
        queryText += `$${paramIndex}`;
        params.push(values[i]);
        paramIndex++;
      }
    }

    // 执行查询
    const result = await client.query<T>(queryText, params);
    return { rows: result.rows };
  } finally {
    await client.end();
  }
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

export interface Session {
  id: number;
  user_id: string;
  token_hash: string;
  created_at: Date;
  expires_at: Date;
  last_used_at: Date;
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

/**
 * 初始化 sessions 表（用于跨项目认证）
 */
export async function initSessionsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        token_hash VARCHAR(64) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash
      ON sessions(token_hash)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id
      ON sessions(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
      ON sessions(expires_at)
    `;

    console.log('Sessions table initialized successfully');
  } catch (error) {
    console.error('Error initializing sessions table:', error);
    throw error;
  }
}

/**
 * 初始化订阅系统相关表
 */
export async function initSubscriptionTables() {
  try {
    // 1. 订阅套餐表
    await sql`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id SERIAL PRIMARY KEY,
        plan_id VARCHAR(50) UNIQUE NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        name_cn VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        credits_monthly INT NOT NULL,
        credits_rollover BOOLEAN DEFAULT FALSE,
        api_keys_limit INT NOT NULL,
        team_members_limit INT NOT NULL,
        features JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 插入默认套餐（如果不存在）
    await sql`
      INSERT INTO subscription_plans (plan_id, name_en, name_cn, price, credits_monthly, api_keys_limit, team_members_limit, features)
      VALUES
        ('free', 'Free', '免费版', 0.00, 2000, 1, 1, '{"basic_support": true, "community_access": true}'),
        ('pro', 'Professional', '专业版', 49.00, 50000, 5, 3, '{"priority_support": true, "advanced_analytics": true, "custom_webhooks": true}'),
        ('enterprise', 'Enterprise', '企业版', 199.00, 999999, 999999, 999999, '{"dedicated_support": true, "sla": "99.9%", "custom_integrations": true, "on_premise": true}')
      ON CONFLICT (plan_id) DO NOTHING
    `;

    // 2. 用户订阅表
    await sql`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        plan_id VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        billing_period VARCHAR(20) DEFAULT 'monthly',
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        payment_method VARCHAR(50),
        stripe_subscription_id VARCHAR(255),
        stripe_customer_id VARCHAR(255),
        auto_renew BOOLEAN DEFAULT TRUE,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        cancelled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status)`;

    // 3. Credits 账户表
    await sql`
      CREATE TABLE IF NOT EXISTS user_credits (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL UNIQUE,
        total_credits INT DEFAULT 0,
        used_credits INT DEFAULT 0,
        bonus_credits INT DEFAULT 0,
        last_reset_at TIMESTAMP,
        next_reset_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_credits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id)`;

    // 4. Credits 交易记录表
    await sql`
      CREATE TABLE IF NOT EXISTS credits_transactions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        type VARCHAR(20) NOT NULL,
        credits_delta INT NOT NULL,
        credits_before INT NOT NULL,
        credits_after INT NOT NULL,
        related_entity VARCHAR(50),
        related_entity_id VARCHAR(255),
        description TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_user_id ON credits_transactions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_type ON credits_transactions(type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_at ON credits_transactions(created_at DESC)`;

    console.log('Subscription tables initialized successfully');
  } catch (error) {
    console.error('Error initializing subscription tables:', error);
    throw error;
  }
}

/**
 * 确保用户拥有必需的 credits 和 subscription 记录
 * 用于 OAuth 登录后自动初始化新用户数据
 *
 * @param userId - 用户 UUID
 * @returns Promise<{ subscriptionCreated: boolean; creditsCreated: boolean }>
 */
export async function ensureUserHasCreditsAndSubscription(userId: string): Promise<{
  subscriptionCreated: boolean;
  creditsCreated: boolean;
}> {
  try {
    let subscriptionCreated = false;
    let creditsCreated = false;

    // 1. 检查并创建 subscription 记录
    const existingSubscription = await sql`
      SELECT * FROM user_subscriptions
      WHERE user_id = ${userId} AND status = 'active'
    `;

    if (existingSubscription.rows.length === 0) {
      // 创建默认的 'free' 套餐订阅
      const periodStart = new Date();
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 100); // Free 套餐设置为 100 年后过期

      await sql`
        INSERT INTO user_subscriptions
          (user_id, plan_id, status, billing_period, current_period_start, current_period_end)
        VALUES
          (${userId}, 'free', 'active', 'lifetime', ${periodStart}, ${periodEnd})
        ON CONFLICT DO NOTHING
      `;
      subscriptionCreated = true;
      console.log('✅ Created default subscription for user:', userId);
    }

    // 2. 检查并创建 credits 记录
    const existingCredits = await sql`
      SELECT * FROM user_credits WHERE user_id = ${userId}
    `;

    if (existingCredits.rows.length === 0) {
      // 获取 free 套餐的 credits 配额
      const freePlan = await sql`
        SELECT credits_monthly FROM subscription_plans WHERE plan_id = 'free'
      `;

      const initialCredits = freePlan.rows[0]?.credits_monthly || 2000; // 默认 2000

      // 创建 credits 记录
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      nextReset.setDate(1); // 下月1号重置

      await sql`
        INSERT INTO user_credits
          (user_id, total_credits, used_credits, bonus_credits, last_reset_at, next_reset_at)
        VALUES
          (${userId}, ${initialCredits}, 0, 0, ${new Date()}, ${nextReset})
        ON CONFLICT (user_id) DO NOTHING
      `;

      // 创建初始积分发放的交易记录
      await sql`
        INSERT INTO credits_transactions
          (user_id, type, credits_delta, credits_before, credits_after, description)
        VALUES
          (${userId}, 'subscription', ${initialCredits}, 0, ${initialCredits}, 'Initial credits from free plan')
      `;

      creditsCreated = true;
      console.log('✅ Created initial credits for user:', userId, 'Amount:', initialCredits);
    }

    return { subscriptionCreated, creditsCreated };
  } catch (error) {
    console.error('Error ensuring user has credits and subscription:', error);
    // 不抛出错误，避免阻止用户登录
    // 只记录日志，让登录流程继续
    return { subscriptionCreated: false, creditsCreated: false };
  }
}

