-- ========================================
-- 用户订阅系统数据库设计
-- Niche Mining - Subscription & Credits System
-- ========================================

-- 1. 订阅套餐表 (subscription_plans)
-- 存储所有可用的订阅套餐配置
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_id VARCHAR(50) UNIQUE NOT NULL,  -- 'free', 'pro', 'enterprise'
  name_en VARCHAR(100) NOT NULL,         -- 'Professional'
  name_cn VARCHAR(100) NOT NULL,         -- '专业版'
  price DECIMAL(10, 2) NOT NULL,         -- 49.00
  currency VARCHAR(3) DEFAULT 'USD',

  -- Credits 配额
  credits_monthly INT NOT NULL,          -- 每月 Credits 额度 (999999表示无限)
  credits_rollover BOOLEAN DEFAULT FALSE, -- 是否可结转未使用的 Credits

  -- 资源限制
  api_keys_limit INT NOT NULL,           -- API 密钥数量限制
  team_members_limit INT NOT NULL,       -- 团队成员数量限制

  -- 功能权限
  features JSONB DEFAULT '{}',            -- JSON存储功能开关
  -- 例如: {"priority_support": true, "custom_webhooks": true, "sla": "99.9%"}

  -- 元数据
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,               -- 显示顺序
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认套餐
INSERT INTO subscription_plans (plan_id, name_en, name_cn, price, credits_monthly, api_keys_limit, team_members_limit, features) VALUES
('free', 'Free', '免费版', 0.00, 2000, 1, 1, '{"basic_support": true, "community_access": true}'),
('pro', 'Professional', '专业版', 49.00, 50000, 5, 3, '{"priority_support": true, "advanced_analytics": true, "custom_webhooks": true}'),
('enterprise', 'Enterprise', '企业版', 199.00, 999999, 999999, 999999, '{"dedicated_support": true, "sla": "99.9%", "custom_integrations": true, "on_premise": true}');


-- 2. 用户订阅表 (user_subscriptions)
-- 存储每个用户的当前订阅状态
CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,         -- 关联 users 表
  plan_id VARCHAR(50) NOT NULL,          -- 关联 subscription_plans.plan_id

  -- 订阅状态
  status VARCHAR(20) NOT NULL,            -- 'active', 'cancelled', 'expired', 'past_due'

  -- 计费周期
  billing_period VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly', 'lifetime'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,

  -- 付款信息
  payment_method VARCHAR(50),             -- 'stripe', 'paypal', 'manual'
  stripe_subscription_id VARCHAR(255),    -- Stripe 订阅 ID
  stripe_customer_id VARCHAR(255),        -- Stripe 客户 ID

  -- 自动续费
  auto_renew BOOLEAN DEFAULT TRUE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP,

  -- 元数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);


-- 3. Credits 账户表 (user_credits)
-- 管理每个用户的 Credits 余额和使用情况
CREATE TABLE user_credits (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,  -- 关联 users 表

  -- Credits 余额
  total_credits INT DEFAULT 0,            -- 总可用 Credits
  used_credits INT DEFAULT 0,             -- 本月已使用 Credits
  bonus_credits INT DEFAULT 0,            -- 赠送的额外 Credits

  -- 重置时间
  last_reset_at TIMESTAMP,                -- 上次重置时间
  next_reset_at TIMESTAMP,                -- 下次重置时间 (通常是下月1日)

  -- 元数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_credits_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);


-- 4. Credits 使用记录表 (credits_transactions)
-- 详细记录每次 Credits 的消耗和充值
CREATE TABLE credits_transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,         -- 关联 users 表

  -- 交易类型
  type VARCHAR(20) NOT NULL,              -- 'usage', 'purchase', 'bonus', 'refund', 'reset'

  -- Credits 变动
  credits_delta INT NOT NULL,             -- 变动量 (负数为消耗，正数为充值)
  credits_before INT NOT NULL,            -- 变动前余额
  credits_after INT NOT NULL,             -- 变动后余额

  -- 关联信息
  related_entity VARCHAR(50),             -- 'api_call', 'google_agent', 'yandex_agent', 'bing_agent'
  related_entity_id VARCHAR(255),         -- API调用ID或任务ID

  -- 描述
  description TEXT,                       -- 交易描述
  metadata JSONB DEFAULT '{}',            -- 额外信息 (JSON格式)

  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_credits_transactions_user_id ON credits_transactions(user_id);
CREATE INDEX idx_credits_transactions_type ON credits_transactions(type);
CREATE INDEX idx_credits_transactions_created_at ON credits_transactions(created_at DESC);


-- 5. API 使用统计表 (api_usage_stats)
-- 统计 API 调用情况，用于 Dashboard 展示
CREATE TABLE api_usage_stats (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,         -- 关联 users 表

  -- 时间维度
  date DATE NOT NULL,                     -- 统计日期
  hour INT,                               -- 小时 (0-23)，用于按小时统计

  -- 统计指标
  total_calls INT DEFAULT 0,              -- 总调用次数
  successful_calls INT DEFAULT 0,         -- 成功调用次数
  failed_calls INT DEFAULT 0,             -- 失败调用次数

  credits_used INT DEFAULT 0,             -- 消耗的 Credits

  avg_response_time INT,                  -- 平均响应时间 (ms)

  -- Agent 类型统计
  google_agent_calls INT DEFAULT 0,
  yandex_agent_calls INT DEFAULT 0,
  bing_agent_calls INT DEFAULT 0,

  -- 元数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_stats_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE(user_id, date, hour)             -- 防止重复统计
);

CREATE INDEX idx_api_usage_stats_user_date ON api_usage_stats(user_id, date DESC);


-- 6. 订阅历史表 (subscription_history)
-- 记录所有订阅变更历史
CREATE TABLE subscription_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,         -- 关联 users 表

  -- 变更类型
  action VARCHAR(50) NOT NULL,            -- 'created', 'upgraded', 'downgraded', 'cancelled', 'renewed', 'expired'

  -- 套餐信息
  from_plan_id VARCHAR(50),               -- 变更前套餐
  to_plan_id VARCHAR(50),                 -- 变更后套餐

  -- 金额
  amount DECIMAL(10, 2),                  -- 交易金额
  currency VARCHAR(3) DEFAULT 'USD',

  -- 描述
  description TEXT,
  metadata JSONB DEFAULT '{}',

  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX idx_subscription_history_created_at ON subscription_history(created_at DESC);


-- ========================================
-- 视图 (Views)
-- ========================================

-- 用户订阅概览视图
CREATE OR REPLACE VIEW v_user_subscription_overview AS
SELECT
  u.user_id,
  u.email,
  u.name,
  sp.plan_id,
  sp.name_en AS plan_name,
  sp.price AS plan_price,
  sp.credits_monthly,
  us.status AS subscription_status,
  us.current_period_start,
  us.current_period_end,
  us.auto_renew,
  uc.total_credits,
  uc.used_credits,
  uc.bonus_credits,
  (uc.total_credits - uc.used_credits) AS remaining_credits,
  uc.next_reset_at
FROM users u
LEFT JOIN user_subscriptions us ON u.user_id = us.user_id AND us.status = 'active'
LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
LEFT JOIN user_credits uc ON u.user_id = uc.user_id;


-- ========================================
-- 触发器 (Triggers)
-- ========================================

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ========================================
-- 示例查询
-- ========================================

-- 1. 获取用户当前订阅和 Credits 信息
/*
SELECT * FROM v_user_subscription_overview
WHERE user_id = 'user_xxx';
*/

-- 2. 获取用户本月 Credits 使用历史
/*
SELECT * FROM credits_transactions
WHERE user_id = 'user_xxx'
  AND created_at >= date_trunc('month', CURRENT_DATE)
ORDER BY created_at DESC;
*/

-- 3. 获取用户近7天API调用统计
/*
SELECT
  date,
  SUM(total_calls) as daily_calls,
  SUM(credits_used) as daily_credits,
  ROUND(AVG(avg_response_time)::numeric, 2) as avg_time_ms
FROM api_usage_stats
WHERE user_id = 'user_xxx'
  AND date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;
*/

-- 4. 扣除 Credits (API 调用消耗)
/*
-- 开启事务
BEGIN;

-- 更新 Credits 余额
UPDATE user_credits
SET used_credits = used_credits + 50
WHERE user_id = 'user_xxx';

-- 记录交易
INSERT INTO credits_transactions
  (user_id, type, credits_delta, credits_before, credits_after, related_entity, description)
VALUES
  ('user_xxx', 'usage', -50, 1000, 950, 'google_agent', 'Google Agent - Keyword Research');

COMMIT;
*/

-- 5. 每月重置 Credits (定时任务)
/*
UPDATE user_credits
SET
  used_credits = 0,
  last_reset_at = CURRENT_TIMESTAMP,
  next_reset_at = DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
WHERE next_reset_at <= CURRENT_TIMESTAMP;
*/
