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
  google_id: string | null; // 改为可选，密码用户没有 Google ID
  password_hash: string | null; // 新增：密码哈希
  auth_provider: string; // 新增：'google' 或 'email'
  email_verified: boolean; // 新增：邮箱是否已验证
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

    // 创建表（如果不存在）
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        picture VARCHAR(500),
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP
      );
    `;

    // 修改 google_id 约束：移除 NOT NULL（如果表已存在且有 NOT NULL 约束）
    try {
      // PostgreSQL 中，如果列有 NOT NULL 约束，需要先移除
      await sql`ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL`;
    } catch (e: any) {
      // 如果约束不存在或已经是 NULL，忽略错误
      // 错误代码 42704 表示列不存在，42804 表示约束不存在
      if (e?.code !== '42704' && e?.code !== '42804' && e?.code !== '42P01' && e?.code !== '23502') {
        console.warn('Warning modifying google_id constraint:', e?.message);
      }
    }

    // 添加新字段（向后兼容，如果字段已存在会忽略错误）
    try {
      await sql`ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)`;
    } catch (e: any) {
      // 字段可能已存在（错误代码 42701），忽略错误
      if (e?.code !== '42701') {
        console.warn('Warning adding password_hash column:', e?.message);
      }
    }

    try {
      await sql`ALTER TABLE users ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'google'`;
    } catch (e: any) {
      // 字段可能已存在，忽略错误
      if (e?.code !== '42701') {
        console.warn('Warning adding auth_provider column:', e?.message);
      }
    }

    try {
      await sql`ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT true`;
    } catch (e: any) {
      // 字段可能已存在，忽略错误
      if (e?.code !== '42701') {
        console.warn('Warning adding email_verified column:', e?.message);
      }
    }

    // 更新现有用户的 auth_provider 和 email_verified（如果还没有设置）
    await sql`
      UPDATE users 
      SET auth_provider = 'google', email_verified = true 
      WHERE google_id IS NOT NULL 
        AND (auth_provider IS NULL OR auth_provider = 'google')
    `;

    // 创建索引以提高查询性能
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
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
          auth_provider = 'google',
          email_verified = true,
          updated_at = CURRENT_TIMESTAMP,
          last_login_at = CURRENT_TIMESTAMP
        WHERE google_id = ${googleUser.id}
        RETURNING *
      `;
      return updatedUser.rows[0];
    }

    // 创建新用户
    const newUser = await sql<User>`
      INSERT INTO users (email, name, picture, google_id, auth_provider, email_verified, last_login_at)
      VALUES (${googleUser.email}, ${googleUser.name || null}, ${googleUser.picture || null}, ${googleUser.id}, 'google', true, CURRENT_TIMESTAMP)
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
 * 创建密码注册用户
 */
export async function createPasswordUser(userData: {
  email: string;
  passwordHash: string;
  name?: string;
}): Promise<User> {
  try {
    await initUsersTable();

    // 检查邮箱是否已存在
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // 创建新用户
    const newUser = await sql<User>`
      INSERT INTO users (email, name, password_hash, auth_provider, email_verified, last_login_at)
      VALUES (${userData.email}, ${userData.name || null}, ${userData.passwordHash}, 'email', false, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return newUser.rows[0];
  } catch (error) {
    console.error('Error creating password user:', error);
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
        ('free', 'Free', '免费版', 0.00, 200, 1, 1, '{"basic_support": true, "community_access": true, "keywords_estimate": "100"}'),
        ('pro', 'Pro', 'Pro版', 30.00, 2000, 3, 3, '{"priority_support": true, "advanced_analytics": true, "custom_webhooks": true, "keywords_estimate": "1000"}'),
        ('professional', 'Professional', '专业版', 150.00, 10000, 10, 10, '{"priority_support": true, "advanced_analytics": true, "custom_webhooks": true, "dedicated_support": true, "keywords_estimate": "5000"}'),
        ('business', 'Business', '企业定制版', 0.00, 0, 999, 999, '{"contact_sales": true, "custom_solution": true, "dedicated_support": true, "sla": "99.9%", "on_premise": true}')
      ON CONFLICT (plan_id) DO UPDATE SET
        name_en = EXCLUDED.name_en,
        name_cn = EXCLUDED.name_cn,
        price = EXCLUDED.price,
        credits_monthly = EXCLUDED.credits_monthly,
        api_keys_limit = EXCLUDED.api_keys_limit,
        team_members_limit = EXCLUDED.team_members_limit,
        features = EXCLUDED.features
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
        mode_id VARCHAR(50),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_user_id ON credits_transactions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_type ON credits_transactions(type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_mode_id ON credits_transactions(mode_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_at ON credits_transactions(created_at DESC)`;

    console.log('Subscription tables initialized successfully');
  } catch (error) {
    console.error('Error initializing subscription tables:', error);
    throw error;
  }
}

/**
 * API Key 接口
 */
export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string; // 显示的前缀，如 "nm_live_abc123..."
  last_used_at: Date | null;
  expires_at: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * 初始化 API Keys 表
 */
export async function initApiKeysTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        key_hash VARCHAR(64) UNIQUE NOT NULL,
        key_prefix VARCHAR(50) NOT NULL,
        last_used_at TIMESTAMP,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_api_keys_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active)`;

    console.log('API Keys table initialized successfully');
  } catch (error) {
    console.error('Error initializing API keys table:', error);
    throw error;
  }
}

/**
 * 创建 API Key
 */
export async function createApiKey(
  userId: string,
  name: string,
  expiresAt?: Date
): Promise<{ apiKey: string; keyPrefix: string; id: string }> {
  try {
    // 确保表存在
    await initApiKeysTable();

    // 检查用户的 API key 数量限制
    const subscription = await sql`
      SELECT sp.api_keys_limit, COUNT(ak.id) as current_count
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.plan_id
      LEFT JOIN api_keys ak ON ak.user_id = us.user_id AND ak.is_active = TRUE
      WHERE us.user_id = ${userId} AND us.status = 'active'
      GROUP BY sp.api_keys_limit
    `;

    if (subscription.rows.length > 0) {
      const limit = subscription.rows[0].api_keys_limit;
      const currentCount = parseInt(subscription.rows[0].current_count || '0');
      if (currentCount >= limit) {
        throw new Error(`API key limit reached. Your plan allows ${limit} API key(s).`);
      }
    }

    // 生成 API key
    const crypto = await import('crypto');
    const apiKey = `nm_live_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = `${apiKey.substring(0, 20)}...`;

    // 保存到数据库
    const result = await sql<ApiKey>`
      INSERT INTO api_keys (user_id, name, key_hash, key_prefix, expires_at)
      VALUES (${userId}, ${name}, ${keyHash}, ${keyPrefix}, ${expiresAt || null})
      RETURNING id, key_prefix
    `;

    return {
      apiKey, // 只在创建时返回完整 key
      keyPrefix: result.rows[0].key_prefix,
      id: result.rows[0].id,
    };
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
}

/**
 * 根据 key hash 查找 API Key
 */
export async function getApiKeyByHash(keyHash: string): Promise<ApiKey | null> {
  try {
    // 确保表存在
    await initApiKeysTable();
    
    const result = await sql<ApiKey>`
      SELECT * FROM api_keys
      WHERE key_hash = ${keyHash} AND is_active = TRUE
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting API key by hash:', error);
    // 如果表不存在，返回 null
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      return null;
    }
    throw error;
  }
}

/**
 * 更新 API Key 的最后使用时间
 */
export async function updateApiKeyLastUsed(keyId: string): Promise<void> {
  try {
    await sql`
      UPDATE api_keys
      SET last_used_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${keyId}
    `;
  } catch (error) {
    console.error('Error updating API key last used:', error);
    // 不抛出错误，避免影响主流程
  }
}

/**
 * 获取用户的所有 API Keys
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  try {
    // 确保表存在
    await initApiKeysTable();
    
    const result = await sql<ApiKey>`
      SELECT * FROM api_keys
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting user API keys:', error);
    // 如果表不存在，返回空数组而不是抛出错误
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      return [];
    }
    throw error;
  }
}

/**
 * 删除 API Key
 */
export async function deleteApiKey(keyId: string, userId: string): Promise<boolean> {
  try {
    // 确保表存在
    await initApiKeysTable();
    
    const result = await sql`
      DELETE FROM api_keys
      WHERE id = ${keyId} AND user_id = ${userId}
      RETURNING id
    `;
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting API key:', error);
    // 如果表不存在，返回 false
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      return false;
    }
    throw error;
  }
}

/**
 * 工作流配置接口
 */
export interface WorkflowConfig {
  id: string;
  user_id: string;
  workflow_id: string;
  name: string;
  nodes: any; // JSONB 存储 WorkflowNode[]
  created_at: Date;
  updated_at: Date;
}

/**
 * 初始化工作流配置表
 */
export async function initWorkflowConfigsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS workflow_configs (
        id VARCHAR(255) PRIMARY KEY,
        user_id UUID NOT NULL,
        workflow_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_workflow_configs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    // 创建索引
    await sql`CREATE INDEX IF NOT EXISTS idx_workflow_configs_user_id ON workflow_configs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_workflow_configs_workflow_id ON workflow_configs(workflow_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_workflow_configs_user_workflow ON workflow_configs(user_id, workflow_id)`;
  } catch (error) {
    console.error('Error initializing workflow_configs table:', error);
    throw error;
  }
}

/**
 * 创建工作流配置
 */
export async function createWorkflowConfig(
  userId: string,
  workflowId: string,
  name: string,
  nodes: any[]
): Promise<WorkflowConfig> {
  try {
    await initWorkflowConfigsTable();

    const configId = `${workflowId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await sql`
      INSERT INTO workflow_configs (id, user_id, workflow_id, name, nodes, created_at, updated_at)
      VALUES (${configId}, ${userId}, ${workflowId}, ${name.trim()}, ${JSON.stringify(nodes)}::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return {
      id: result.rows[0].id,
      user_id: result.rows[0].user_id,
      workflow_id: result.rows[0].workflow_id,
      name: result.rows[0].name,
      nodes: result.rows[0].nodes,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
    };
  } catch (error) {
    console.error('Error creating workflow config:', error);
    throw error;
  }
}

/**
 * 获取用户的工作流配置列表
 */
export async function getUserWorkflowConfigs(
  userId: string,
  workflowId?: string
): Promise<WorkflowConfig[]> {
  try {
    await initWorkflowConfigsTable();

    let result;
    if (workflowId) {
      result = await sql`
        SELECT * FROM workflow_configs
        WHERE user_id = ${userId} AND workflow_id = ${workflowId}
        ORDER BY updated_at DESC
      `;
    } else {
      result = await sql`
        SELECT * FROM workflow_configs
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
      `;
    }

    return result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      workflow_id: row.workflow_id,
      name: row.name,
      nodes: row.nodes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error('Error getting user workflow configs:', error);
    // 如果表不存在，返回空数组
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      return [];
    }
    throw error;
  }
}

/**
 * 根据 ID 获取工作流配置
 */
export async function getWorkflowConfigById(
  configId: string,
  userId?: string
): Promise<WorkflowConfig | null> {
  try {
    await initWorkflowConfigsTable();

    let result;
    if (userId) {
      result = await sql`
        SELECT * FROM workflow_configs
        WHERE id = ${configId} AND user_id = ${userId}
      `;
    } else {
      result = await sql`
        SELECT * FROM workflow_configs
        WHERE id = ${configId}
      `;
    }

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      user_id: row.user_id,
      workflow_id: row.workflow_id,
      name: row.name,
      nodes: row.nodes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error('Error getting workflow config:', error);
    // 如果表不存在，返回 null
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      return null;
    }
    throw error;
  }
}

/**
 * 更新工作流配置
 */
export async function updateWorkflowConfig(
  configId: string,
  userId: string,
  updates: { name?: string; nodes?: any[] }
): Promise<WorkflowConfig | null> {
  try {
    await initWorkflowConfigsTable();

    // 构建动态更新语句
    const updateParts: any[] = [];
    
    if (updates.name !== undefined) {
      updateParts.push(sql`name = ${updates.name.trim()}`);
    }
    
    if (updates.nodes !== undefined) {
      updateParts.push(sql`nodes = ${JSON.stringify(updates.nodes)}::jsonb`);
    }

    if (updateParts.length === 0) {
      // 没有要更新的字段，直接返回现有配置
      return await getWorkflowConfigById(configId, userId);
    }

    // 总是更新 updated_at
    updateParts.push(sql`updated_at = CURRENT_TIMESTAMP`);

    // 构建 SET 子句
    const setClause = updateParts.reduce((acc, part, index) => {
      if (index === 0) {
        return part;
      }
      return sql`${acc}, ${part}`;
    });

    const result = await sql`
      UPDATE workflow_configs
      SET ${setClause}
      WHERE id = ${configId} AND user_id = ${userId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      user_id: row.user_id,
      workflow_id: row.workflow_id,
      name: row.name,
      nodes: row.nodes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error('Error updating workflow config:', error);
    throw error;
  }
}

/**
 * 删除工作流配置
 */
export async function deleteWorkflowConfig(
  configId: string,
  userId: string
): Promise<boolean> {
  try {
    await initWorkflowConfigsTable();

    const result = await sql`
      DELETE FROM workflow_configs
      WHERE id = ${configId} AND user_id = ${userId}
      RETURNING id
    `;

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting workflow config:', error);
    // 如果表不存在，返回 false
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      return false;
    }
    throw error;
  }
}

/**
 * 初始化支付订单表
 */
export async function initPaymentTables() {
  try {
    // 支付订单表（移除外键约束，避免初始化时的依赖问题）
    await sql`
      CREATE TABLE IF NOT EXISTS payment_orders (
        id SERIAL PRIMARY KEY,
        checkout_id VARCHAR(255) UNIQUE NOT NULL,
        user_id UUID NOT NULL,
        plan_id VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        request_id VARCHAR(255) UNIQUE NOT NULL,
        metadata JSONB DEFAULT '{}',
        payment_url TEXT,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_orders_checkout_id ON payment_orders(checkout_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_orders_created_at ON payment_orders(created_at DESC)`;

    console.log('Payment tables initialized successfully');
  } catch (error) {
    console.error('Error initializing payment tables:', error);
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

      const initialCredits = freePlan.rows[0]?.credits_monthly || 200; // 默认 200

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

