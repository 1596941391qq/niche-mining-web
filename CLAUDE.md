# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Niche Mining (NicheDigger)** is a comprehensive AI-powered SEO keyword mining and content generation platform. This is the main web application that provides:
- Marketing landing page and product showcase
- Centralized Google OAuth and email/password authentication
- User console with subscription and credits management
- Unified SEO Agent API with three operational modes
- API key management for programmatic access
- Workflow configuration system for customizable SEO pipelines
- Payment integration for subscription upgrades

The platform implements the "Blue Ocean" keyword methodology - finding low-competition, high-value SEO opportunities through AI-powered analysis.

## Common Commands

```bash
# Development
npm run dev              # Vite dev server (frontend only, fast)
npm run dev:vercel       # Vercel dev server (includes API routes)

# Production build
npm run build            # Vite build to dist/

# Preview production build
npm run preview          # Serve dist/ locally

# Setup (first time)
vercel link              # Link to Vercel project
vercel env pull .env.local   # Pull environment variables from Vercel
```

**Important**: Use `npm run dev:vercel` (not `npm run dev`) when testing authentication flows or any API endpoints, as API routes only work with `vercel dev`.

## Environment Variables

Required variables (obtain from Vercel Dashboard or `.env.local`):

```
POSTGRES_URL           # Vercel Postgres connection string
GOOGLE_CLIENT_ID       # Google OAuth client ID
GOOGLE_CLIENT_SECRET   # Google OAuth client secret
GOOGLE_REDIRECT_URI    # OAuth callback URL (e.g., http://localhost:3000/api/auth/google/callback)
JWT_SECRET             # Secret for signing JWT tokens
GEMINI_API_KEY        # Gemini API key for SEO agent operations
SERANKING_API_KEY     # SE Ranking API key for keyword data
MAIN_APP_URL          # Main app URL for cross-origin requests
```

## Architecture Overview

### Frontend (React SPA)
- **Entry point**: `index.tsx` → `App.tsx`
- **Routing**: Hash-based routing (`window.location.hash`) + path routing for `/docs`
- **State management**: React Context API (`contexts/AuthContext.tsx`, `contexts/ThemeContext.tsx`, `contexts/LanguageContext.tsx`)
- **Styling**: Tailwind CSS loaded from CDN (not bundled)
- **i18n**: Manual implementation in `constants.ts` (EN/CN), no library

### Backend (Vercel Serverless Functions)
- **Location**: `/api` directory
- **Pattern**: Each file exports a default `handler(req, res)` function
- **Database**: Custom `pg` (node-postgres) implementation with tagged template literals
- **Authentication**: Custom JWT + API Key implementation using `jose` library (no NextAuth)

### Database Pattern

The codebase uses a **custom database abstraction** instead of standard Vercel Postgres pooling:

```typescript
// api/lib/db.ts
import { sql } from '../lib/db';

// Usage (parameterized queries via template literals)
const user = await sql<User>`
  SELECT * FROM users WHERE email = ${email}
`;
```

**Key details**:
- Creates a new `pg.Client` per query (acceptable in serverless)
- Auto-parameterizes values (prevents SQL injection)
- Returns `{ rows: T[] }` format
- Database tables auto-initialize on first use

### Authentication System

**Dual Authentication Support**:
1. **Google OAuth** - Primary authentication method
2. **Email/Password** - Alternative authentication method
3. **API Keys** - For programmatic access to SEO Agent API

**OAuth Flow**:
```
1. User clicks "Login" → /api/auth/google/login
2. Generates state (CSRF) → Redirects to Google OAuth
3. Google callback → /api/auth/google/callback
4. Exchanges code for access token → Fetches user info
5. Calls findOrCreateUser() → Auto-creates credits & subscription
6. Generates JWT (24h expiry) → Redirects to frontend with ?token=xxx
7. Frontend saves to localStorage + HttpOnly cookies
8. Auto-refreshes session every 30 minutes
```

**New User Initialization**:
When a user logs in for the first time (via OAuth or email), the system automatically:
- Creates a `user_subscriptions` record (plan='free', status='active')
- Creates a `user_credits` record with initial credits (200 for free plan)
- Creates a `credits_transactions` record for the initial credit grant

### Cross-app Authentication (Transfer Token Flow)

For opening sub-applications (Google/Yandex/Bing SEO Agents):

1. User clicks tool card → Main app generates Transfer Token (5min expiry)
2. Opens sub-project URL: `https://[tool].vercel.app/?tt=transfer_token`
3. Sub-project calls `/api/auth/exchange-transfer-token` to exchange for JWT
4. Sub-project uses JWT to access user data (credits, subscriptions)
5. Transfer token is **one-time use** and deleted after exchange

**Security features**:
- Transfer tokens stored as SHA256 hashes
- 5-minute expiration window
- One-time use (deleted after exchange)
- JWT tokens have 24-hour validity

**详细集成指南**: 参见 `SUBAPP_AUTH_GUIDE.md`

### SEO Agent API System

**Unified API Endpoint**: `/api/v1/seo-agent`

**Three Operational Modes**:

1. **keyword_mining** - Generate and analyze SEO keywords
   - Input: seed keyword, target language, mining strategy
   - Output: List of keywords with ranking probability analysis
   - Credits: 20 credits per 10 keywords

2. **batch_translation** - Translate and analyze keywords in batch
   - Input: comma-separated keywords, target language
   - Output: Translated keywords with SEO analysis
   - Credits: 20 credits per 10 keywords

3. **deep_dive** - Generate comprehensive SEO content strategy
   - Input: keyword, target language
   - Output: Full SEO strategy report with core keywords
   - Credits: 30 credits per report

**Authentication Methods**:
- JWT Bearer Token (from user login)
- API Key (for programmatic access)

**Workflow Configuration**:
- Users can create custom workflow configs
- Stored in `workflow_configs` table
- Allows customization of AI prompts for each node
- Configs are user-specific and workflow-specific

### Credits & Subscription System

**Subscription Plans** (stored in `subscription_plans` table):
- **Free**: 200 credits/month, 1 API key, 1 team member
- **Pro**: 2000 credits/month, 3 API keys, 3 team members ($30/month)
- **Professional**: 10000 credits/month, 10 API keys, 10 team members ($150/month)
- **Business**: Custom solution (contact sales)

**Credits Management**:
- Each user has a `user_credits` record tracking total/used/bonus credits
- All credit operations logged in `credits_transactions` table
- Credits consumed when using SEO Agent API
- Monthly reset for subscription-based credits

**Payment Integration**:
- Payment orders stored in `payment_orders` table
- Checkout flow via `/api/payment/create-checkout`
- Webhook handling for payment verification
- Automatic subscription upgrade on successful payment

### Key Files

**Backend Core**:
- `api/lib/db.ts` - Database operations, all table schemas and functions
- `api/lib/auth.ts` - JWT token generation/verification
- `api/lib/google-oauth.ts` - Google OAuth helpers
- `api/auth/google/login.ts` - Initiates OAuth flow
- `api/auth/google/callback.ts` - Handles OAuth callback, auto-initializes new users
- `api/auth/session.ts` - Gets current user session
- `api/auth/verify.ts` - Token verification for sub-projects (CORS enabled)
- `api/auth/create-transfer-token.ts` - Creates transfer tokens for sub-apps
- `api/auth/exchange-transfer-token.ts` - Exchanges transfer tokens for JWT

**SEO Agent API**:
- `api/v1/seo-agent.ts` - Unified SEO agent endpoint (keyword_mining, batch_translation, deep_dive)
- `api/v1/_shared/gemini.ts` - Gemini AI integration for keyword generation and analysis
- `api/v1/_shared/serp.ts` - SERP analysis utilities
- `api/v1/_shared/auth.ts` - Authentication middleware for API routes
- `api/v1/_shared/request-handler.ts` - Request parsing and CORS handling
- `api/v1/_shared/types.ts` - TypeScript interfaces for SEO data

**API Management**:
- `api/v1/api-keys.ts` - API key CRUD operations
- `api/v1/workflows.ts` - Workflow management
- `api/v1/workflow-configs.ts` - Workflow configuration CRUD

**Credits & Subscriptions**:
- `api/user/dashboard.ts` - User dashboard data (credits, subscription, stats)
- `api/user/credits.ts` - Credits balance and history
- `api/credits/consume.ts` - Credits consumption endpoint

**Payment**:
- `api/payment/create-checkout.ts` - Create payment checkout session
- `api/payment/verify-checkout.ts` - Verify payment completion
- `api/payment/webhook.ts` - Payment webhook handler

**Frontend Core**:
- `App.tsx` - Main app component with page routing
- `contexts/AuthContext.tsx` - Global auth state
- `components/Console.tsx` - User console (main authenticated area)
- `components/console/ConsoleDashboard.tsx` - Dashboard overview
- `components/console/ConsoleAPI.tsx` - API key management UI
- `components/console/ConsoleCredits.tsx` - Credits management UI
- `components/console/ConsoleSubscription.tsx` - Subscription management UI
- `components/ToolSelector.tsx` - SEO tool cards (main conversion point)
- `components/APIDocs.tsx` - API documentation page
- `constants.ts` - All i18n translations (large file, 44KB)

**Configuration**:
- `vercel.json` - Vercel deployment config with API rewrites
- `vite.config.ts` - Vite config with `@/` alias and port 3000

## Database Schema

**users table** (PostgreSQL):
```sql
id              UUID PRIMARY KEY (auto-generated)
email           VARCHAR(255) UNIQUE NOT NULL
name            VARCHAR(255)
picture         VARCHAR(500)
google_id       VARCHAR(255) UNIQUE          -- NULL for email/password users
password_hash   VARCHAR(255)                 -- NULL for OAuth users
auth_provider   VARCHAR(20) DEFAULT 'google' -- 'google' or 'email'
email_verified  BOOLEAN DEFAULT TRUE
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login_at   TIMESTAMP

-- Indexes
idx_users_email         ON users(email)
idx_users_google_id     ON users(google_id)
idx_users_auth_provider ON users(auth_provider)
```

**sessions table** (Transfer Tokens):
```sql
id            SERIAL PRIMARY KEY
user_id       UUID NOT NULL
token_hash    VARCHAR(64) UNIQUE NOT NULL  -- SHA256 hash
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
expires_at    TIMESTAMP NOT NULL
last_used_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Indexes
idx_sessions_token_hash  ON sessions(token_hash)
idx_sessions_user_id     ON sessions(user_id)
idx_sessions_expires_at  ON sessions(expires_at)
```

**subscription_plans table**:
```sql
id                   SERIAL PRIMARY KEY
plan_id              VARCHAR(50) UNIQUE NOT NULL
name_en              VARCHAR(100) NOT NULL
name_cn              VARCHAR(100) NOT NULL
price                DECIMAL(10, 2) NOT NULL
currency             VARCHAR(3) DEFAULT 'USD'
credits_monthly      INT NOT NULL
credits_rollover     BOOLEAN DEFAULT FALSE
api_keys_limit       INT NOT NULL
team_members_limit   INT NOT NULL
features             JSONB DEFAULT '{}'
is_active            BOOLEAN DEFAULT TRUE
sort_order           INT DEFAULT 0
created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**user_subscriptions table**:
```sql
id                      SERIAL PRIMARY KEY
user_id                 UUID NOT NULL
plan_id                 VARCHAR(50) NOT NULL
status                  VARCHAR(20) NOT NULL  -- 'active', 'cancelled', 'expired'
billing_period          VARCHAR(20) DEFAULT 'monthly'
current_period_start    TIMESTAMP
current_period_end      TIMESTAMP
payment_method          VARCHAR(50)
stripe_subscription_id  VARCHAR(255)
stripe_customer_id      VARCHAR(255)
auto_renew              BOOLEAN DEFAULT TRUE
cancel_at_period_end    BOOLEAN DEFAULT FALSE
cancelled_at            TIMESTAMP
created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)

-- Indexes
idx_user_subscriptions_user_id ON user_subscriptions(user_id)
idx_user_subscriptions_status  ON user_subscriptions(status)
```

**user_credits table**:
```sql
id              SERIAL PRIMARY KEY
user_id         UUID NOT NULL UNIQUE
total_credits   INT DEFAULT 0
used_credits    INT DEFAULT 0
bonus_credits   INT DEFAULT 0
last_reset_at   TIMESTAMP
next_reset_at   TIMESTAMP
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Indexes
idx_user_credits_user_id ON user_credits(user_id)
```

**credits_transactions table**:
```sql
id                  SERIAL PRIMARY KEY
user_id             UUID NOT NULL
type                VARCHAR(20) NOT NULL  -- 'usage', 'subscription', 'bonus', 'refund'
credits_delta       INT NOT NULL
credits_before      INT NOT NULL
credits_after       INT NOT NULL
related_entity      VARCHAR(50)
related_entity_id   VARCHAR(255)
description         TEXT
mode_id             VARCHAR(50)           -- 'keyword_mining', 'batch_translation', 'deep_dive'
api_key_id          UUID                  -- NULL if JWT auth
metadata            JSONB DEFAULT '{}'
created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL

-- Indexes
idx_credits_transactions_user_id     ON credits_transactions(user_id)
idx_credits_transactions_type        ON credits_transactions(type)
idx_credits_transactions_mode_id     ON credits_transactions(mode_id)
idx_credits_transactions_api_key_id  ON credits_transactions(api_key_id)
idx_credits_transactions_created_at  ON credits_transactions(created_at DESC)
```

**api_keys table**:
```sql
id            UUID PRIMARY KEY (auto-generated)
user_id       UUID NOT NULL
name          VARCHAR(255) NOT NULL
key_hash      VARCHAR(64) UNIQUE NOT NULL  -- SHA256 hash
key_prefix    VARCHAR(50) NOT NULL         -- Display prefix (e.g., "nm_live_abc123...")
last_used_at  TIMESTAMP
expires_at    TIMESTAMP
is_active     BOOLEAN DEFAULT TRUE
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Indexes
idx_api_keys_user_id   ON api_keys(user_id)
idx_api_keys_key_hash  ON api_keys(key_hash)
idx_api_keys_is_active ON api_keys(is_active)
```

**workflow_configs table**:
```sql
id           VARCHAR(255) PRIMARY KEY
user_id      UUID NOT NULL
workflow_id  VARCHAR(50) NOT NULL  -- 'mining', 'batch', 'deepDive'
name         VARCHAR(255) NOT NULL
nodes        JSONB NOT NULL DEFAULT '[]'::jsonb
created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Indexes
idx_workflow_configs_user_id      ON workflow_configs(user_id)
idx_workflow_configs_workflow_id  ON workflow_configs(workflow_id)
idx_workflow_configs_user_workflow ON workflow_configs(user_id, workflow_id)
```

**payment_orders table**:
```sql
id           SERIAL PRIMARY KEY
checkout_id  VARCHAR(255) UNIQUE NOT NULL
user_id      UUID NOT NULL
plan_id      VARCHAR(50) NOT NULL
amount       DECIMAL(10, 2) NOT NULL
currency     VARCHAR(3) DEFAULT 'USD'
status       VARCHAR(20) NOT NULL DEFAULT 'pending'
request_id   VARCHAR(255) UNIQUE NOT NULL
metadata     JSONB DEFAULT '{}'
payment_url  TEXT
paid_at      TIMESTAMP
created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Indexes
idx_payment_orders_user_id     ON payment_orders(user_id)
idx_payment_orders_checkout_id ON payment_orders(checkout_id)
idx_payment_orders_status      ON payment_orders(status)
idx_payment_orders_created_at  ON payment_orders(created_at DESC)
```

**Database initialization**: Tables are created automatically on first use. Can also manually initialize via `/api/init-db`.

## Security Considerations

1. **SQL Injection**: Prevented via parameterized queries in `sql` template function
2. **CSRF**: Protected via `state` parameter in OAuth flow
3. **XSS**: React auto-escapes, no `dangerouslySetInnerHTML` usage
4. **Token storage**: Dual storage (localStorage + HttpOnly cookies)
5. **CORS**: Enabled on specific endpoints for sub-project validation
6. **API Keys**: Stored as SHA256 hashes, never in plaintext
7. **Transfer Tokens**: SHA256 hashed, one-time use, 5-minute expiry
8. **Secrets**: All sensitive values in Vercel environment variables

**Potential concern**: JWT tokens passed via URL query params (`?token=xxx`) may leak in browser history/server logs. Consider using postMessage API for production.

## Important Patterns

### API Route Structure
```typescript
// api/[name].ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Authentication check (if needed)
  const authResult = await authenticateRequest(req);
  if (!authResult) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 3. Business logic
  // ...

  // 4. Error handling
  try {
    // ...
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Component i18n Pattern
```typescript
import { TRANSLATIONS } from '@/constants';

const Hero = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return <h1>{t.hero.title}</h1>;
};
```

### Database Query Pattern
```typescript
import { sql, User } from '@/api/lib/db';

// Type-safe parameterized query
const result = await sql<User>`
  SELECT * FROM users WHERE email = ${email}
`;
const user = result.rows[0];
```

### SEO Agent API Usage Pattern
```typescript
// Using JWT authentication
const response = await fetch('/api/v1/seo-agent', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mode: 'keyword_mining',
    seedKeyword: 'coffee shop',
    targetLanguage: 'en'
  })
});

// Using API Key authentication
const response = await fetch('/api/v1/seo-agent', {
  method: 'POST',
  headers: {
    'Authorization': apiKey,  // nm_live_...
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mode: 'batch_translation',
    keywords: 'coffee, espresso, latte',
    targetLanguage: 'ko'
  })
});
```

## Deployment Architecture

```
Main App (this repo)
├── Frontend → Vercel CDN (static assets from dist/)
├── API Routes → Vercel Serverless Functions
└── Database → Vercel Postgres

Sub-Projects (separate deployments)
├── google-seo-agents.vercel.app   # Google search agent
├── yandex-seo-agents.vercel.app   # Yandex search agent
└── bing-seo-agents.vercel.app     # Bing search agent

All sub-projects authenticate via this app's /api/auth/verify endpoint
```

## Common Development Scenarios

### Adding a new API endpoint
1. Create file in `/api` directory (e.g., `api/new-endpoint.ts`)
2. Export default async handler function
3. Use `sql` template for database queries
4. Return JSON responses via `res.status(200).json(...)`

### Modifying authentication logic
- Token generation: `api/lib/auth.ts`
- Google OAuth: `api/lib/google-oauth.ts`
- User database operations: `api/lib/db.ts`
- Auth flow: `api/auth/google/*.ts`
- New user initialization: `ensureUserHasCreditsAndSubscription()` in `api/lib/db.ts`

### Adding new translations
- Edit `constants.ts` file
- Add keys to both `en` and `cn` objects
- TypeScript will catch missing translations

### Styling changes
- Components use inline Tailwind classes
- Tailwind is loaded from CDN (see `index.html`)
- No build-time purging of unused classes

### Adding new subscription plans
- Update `subscription_plans` table via SQL or `api/init-pricing.ts`
- Update frontend pricing display in `components/Pricing.tsx`
- Ensure credits allocation logic handles new plan

### Adding new SEO Agent modes
- Add mode handler in `api/v1/seo-agent.ts`
- Update `MODE_TO_WORKFLOW_ID` mapping
- Update `getCreditsCost()` function
- Add mode to API documentation

## Notes

- **No ORM**: Direct SQL with custom query builder
- **No auth library**: Custom JWT + API Key implementation
- **No router library**: Hash-based routing via `window.location.hash`
- **Serverless-first**: All backend code is stateless serverless functions
- **i18n**: Manual implementation, translations in `constants.ts`
- **Credits system**: All operations tracked in `credits_transactions` table
- **API Keys**: Support both JWT (user sessions) and API keys (programmatic access)
- **Workflow configs**: User-customizable AI prompts stored in database

---

# ⚠️ CRITICAL SECURITY WARNINGS

## 🚨 严重警告：开发/测试代码与生产数据隔离

**最后更新**: 2025-12-18
**严重程度**: CRITICAL

### 历史Bug记录

**问题**: 开发测试用户初始化代码影响真实生产用户数据

**发现的问题**:
1. `api/test/init-dev-user.ts` 使用固定的 `google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'` 来标识开发用户
2. 如果真实用户的 `google_id` 字段被错误设置为这个值,开发代码会查找并操作该真实用户
3. 真实用户数据异常：返回的是 Google 头像而非预期的 DiceBear 测试头像,说明开发代码正在操作真实用户
4. 可能导致真实用户的 `user_credits`、`user_subscriptions` 等数据被开发测试逻辑修改

**根本原因**:
- ❌ 缺少严格的环境隔离检查
- ❌ 缺少数据库层面的保护机制
- ❌ OAuth 登录流程没有自动创建 credits/subscriptions 记录 (已修复)

---

## 🛡️ 强制性开发规则

### 规则 1: 所有开发/测试 API 必须有严格的环境检查

**❌ 错误做法**:
```typescript
// 在请求处理时才检查 - 太晚了！
const isDev = process.env.NODE_ENV !== 'production';
if (!isDev) {
  return res.status(403).json({ error: 'Dev only' });
}
```

**✅ 正确做法**:
```typescript
// 在文件最顶部立即阻止生产环境加载
if (process.env.NODE_ENV === 'production') {
  export default async function handler(req, res) {
    return res.status(404).json({ error: 'Not found' });
  }
}
// 开发代码继续...
```

### 规则 2: 开发数据必须使用完全隔离的标识符

**❌ 错误做法**:
```typescript
const devEmail = 'dev@local.test'; // 可能冲突
const devGoogleId = 'dev_google_id'; // 太简单
```

**✅ 正确做法**:
```typescript
const DEV_MARKER = '__DEVELOPMENT_ONLY_DO_NOT_USE__';
const devGoogleId = `dev_${DEV_MARKER}_${crypto.randomUUID()}`;
const devEmail = `dev+${crypto.randomUUID()}@local.test.invalid`;
```

### 规则 3: 数据库操作必须使用防御性编程

**必须遵守**:
1. WHERE 条件必须包含开发标识符检查
2. 使用事务包裹多个相关操作
3. 操作前验证数据是否属于开发环境
4. 记录详细日志

**✅ 示例**:
```typescript
const DEV_MARKER = '__DEVELOPMENT_ONLY__';
await sql`
  UPDATE users
  SET ...
  WHERE google_id LIKE ${'%' + DEV_MARKER + '%'}
    AND email LIKE '%@local.test.invalid'
`;
```

---

## 📋 当前系统的 Credits 和 Subscriptions 机制

### ✅ 当前状态（已修复）

1. **新用户通过 Google OAuth 登录**:
   - `api/auth/google/callback.ts` 调用 `findOrCreateUser()`
   - ✅ 创建 `users` 表记录
   - ✅ 自动调用 `ensureUserHasCreditsAndSubscription(userId)`
   - ✅ 创建 `user_subscriptions` 记录 (plan='free', status='active')
   - ✅ 创建 `user_credits` 记录 (200 credits for free plan)
   - ✅ 创建 `credits_transactions` 记录 (initial credit grant)
   - **结果**: 用户登录成功，拥有完整的 credits 和 subscription 数据

2. **老用户登录**:
   - ✅ 更新 `users.last_login_at` 时间戳
   - ✅ 调用 `ensureUserHasCreditsAndSubscription(userId)` 检查并补充缺失记录
   - **结果**: 即使老用户之前缺少记录，也会自动补充

3. **开发测试用户**:
   - `api/test/init-dev-user.ts` 会创建完整记录
   - ⚠️ 需要添加严格的环境检查

### 数据库保护机制

**已有的保护** ✅:
- `users.email` - UNIQUE 约束（防止重复邮箱）
- `users.google_id` - UNIQUE 约束（防止重复 Google ID）
- `user_credits.user_id` - **UNIQUE 约束**（防止同一用户多条 credits 记录）
- FOREIGN KEY 约束 + ON DELETE CASCADE
- 自动初始化机制 (`ensureUserHasCreditsAndSubscription`)

**缺少的保护** ❌:
- 没有环境隔离（开发和生产在同一数据库）
- 开发/测试 API 缺少严格的环境检查

---

## 🔧 待修复问题清单

### 高优先级（立即修复）

- [ ] **修复 `api/test/init-dev-user.ts`**: 添加严格的生产环境阻止
- [ ] **数据库调查**: 检查是否有真实用户的 google_id 被错误设置

### 中优先级

- [ ] 添加数据库约束：阻止包含 'DEVELOPMENT'/'TEST' 的 google_id
- [ ] 创建监控告警：检测缺少关联记录的用户

---

## 📝 代码审查检查清单

### 开发/测试代码

- [ ] 文件顶部是否有 `NODE_ENV` 检查？
- [ ] 是否使用了足够独特的标识符？
- [ ] 是否可能修改真实用户数据？
- [ ] 是否有详细日志？

### 用户认证相关

- [ ] 新用户创建后是否初始化了所有必需的关联记录？
- [ ] 是否使用事务保证原子性？
- [ ] 是否有错误处理和回滚？
- [ ] 是否记录了审计日志？

### 数据库操作

- [ ] 是否使用参数化查询？
- [ ] WHERE 条件是否足够严格？
- [ ] 是否考虑了并发？
- [ ] 是否有数据验证？

---

## 🎯 核心原则

> **开发/测试代码永远不应该有机会影响生产用户数据**
>
> **防御性编程：假设任何可能出错的地方都会出错**
>
> **数据完整性：用户登录后必须拥有所有必需的关联记录**
