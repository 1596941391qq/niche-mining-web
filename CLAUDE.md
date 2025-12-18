# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Niche Mining** is an authentication portal and marketing landing page for a suite of SEO keyword mining tools. This is NOT the actual SEO mining tool itself - it's a centralized hub that:
- Markets three different SEO mining "agents" (Google, Yandex, Bing) for different search engines and markets
- Provides centralized Google OAuth authentication
- Manages user sessions and passes authentication tokens to separate sub-project applications
- Explains the "Blue Ocean" keyword methodology (finding low-competition, high-value SEO opportunities)

## Common Commands

```bash
# Development (supports both frontend and API routes)
npm run dev              # Uses vercel dev - enables both Vite frontend and /api/* routes

# Frontend only (without API routes)
npm run dev:vite         # Pure Vite dev server, faster but no /api/* access

# Production build
npm run build            # Vite build to dist/

# Preview production build
npm run preview          # Serve dist/ locally

# Setup (first time)
vercel link              # Link to Vercel project
vercel env pull .env.local   # Pull environment variables from Vercel
```

**Important**: Use `npm run dev` (not `npm run dev:vite`) when testing authentication flows or any API endpoints, as API routes only work with `vercel dev`.

## Environment Variables

Required variables (obtain from Vercel Dashboard or `.env.local`):

```
POSTGRES_URL           # Vercel Postgres connection string
GOOGLE_CLIENT_ID       # Google OAuth client ID
GOOGLE_CLIENT_SECRET   # Google OAuth client secret
GOOGLE_REDIRECT_URI    # OAuth callback URL (e.g., http://localhost:3000/api/auth/google/callback)
JWT_SECRET             # Secret for signing JWT tokens
GEMINI_API_KEY        # (Optional) Gemini API key for future features
```

## Architecture Overview

### Frontend (React SPA)
- **Entry point**: `index.tsx` → `App.tsx`
- **Routing**: Hash-based routing (`window.location.hash`), no React Router
- **State management**: React Context API (`contexts/AuthContext.tsx`)
- **Styling**: Tailwind CSS loaded from CDN (not bundled)
- **i18n**: Manual implementation in `constants.ts` (EN/CN), no library

### Backend (Vercel Serverless Functions)
- **Location**: `/api` directory
- **Pattern**: Each file exports a default `handler(req, res)` function
- **Database**: Custom `pg` (node-postgres) implementation with tagged template literals
- **Authentication**: Custom JWT implementation using `jose` library (no NextAuth)

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
- Database tables auto-initialize on first use via `initUsersTable()`

### Authentication Flow

```
1. User clicks "Login" → /api/auth/google/login
2. Generates state (CSRF) → Redirects to Google OAuth
3. Google callback → /api/auth/google/callback
4. Exchanges code for access token → Fetches user info
5. Calls findOrCreateUser() → Generates JWT (24h expiry)
6. Redirects to frontend with ?token=xxx
7. Frontend saves to localStorage + HttpOnly cookies
8. Auto-refreshes session every 30 minutes
```

### Cross-app authentication

When users select an SEO tool, the app uses a **secure Transfer Token** flow:

1. User clicks tool card → Main app generates Transfer Token (5min expiry)
2. Opens sub-project URL: `https://[tool].vercel.app/?tt=transfer_token`
3. Sub-project calls `/api/auth/exchange-transfer-token` to exchange for JWT
4. Sub-project uses JWT to access user data (credits, subscriptions)
5. Transfer token is **one-time use** and deleted after exchange

**Security features**:
- Transfer tokens are stored as SHA256 hashes in database
- 5-minute expiration window
- One-time use (deleted after exchange)
- JWT tokens have 24-hour validity

**详细集成指南**: 参见 `SUBAPP_AUTH_GUIDE.md`

### Key Files

**Backend Core**:
- `api/lib/db.ts` - Database operations, User table schema
- `api/lib/auth.ts` - JWT token generation/verification
- `api/lib/google-oauth.ts` - Google OAuth helpers
- `api/auth/google/login.ts` - Initiates OAuth flow
- `api/auth/google/callback.ts` - Handles OAuth callback
- `api/auth/session.ts` - Gets current user session
- `api/auth/verify.ts` - Token verification for sub-projects (CORS enabled)

**Frontend Core**:
- `App.tsx` - Main app component with page routing
- `contexts/AuthContext.tsx` - Global auth state
- `components/ToolSelector.tsx` - SEO tool cards (main conversion point)
- `constants.ts` - All i18n translations (large file, 31KB)

**Configuration**:
- `vercel.json` - Vercel deployment config with API rewrites
- `vite.config.ts` - Vite config with `@/` alias and port 3000

## Database Schema

**users table** (PostgreSQL):
```sql
id           UUID PRIMARY KEY (auto-generated)
email        VARCHAR(255) UNIQUE NOT NULL
name         VARCHAR(255)
picture      VARCHAR(500)
google_id    VARCHAR(255) UNIQUE NOT NULL
created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login_at TIMESTAMP

-- Indexes
idx_users_email      ON users(email)
idx_users_google_id  ON users(google_id)
```

**Database initialization**: Tables are created automatically on first user login. Can also manually initialize via `/api/init-db`.

## Security Considerations

1. **SQL Injection**: Prevented via parameterized queries in `sql` template function
2. **CSRF**: Protected via `state` parameter in OAuth flow
3. **XSS**: React auto-escapes, no `dangerouslySetInnerHTML` usage
4. **Token storage**: Dual storage (localStorage + HttpOnly cookies)
5. **CORS**: Only enabled on `/api/auth/verify` for sub-project validation
6. **Secrets**: All sensitive values in Vercel environment variables

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
  const token = req.headers.authorization?.replace('Bearer ', '');
  // ... verify token

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

### Adding new translations
- Edit `constants.ts` file
- Add keys to both `en` and `cn` objects
- TypeScript will catch missing translations

### Styling changes
- Components use inline Tailwind classes
- Tailwind is loaded from CDN (see `index.html`)
- No build-time purging of unused classes

## Notes

- **No ORM**: Direct SQL with custom query builder
- **No auth library**: Custom JWT implementation instead of NextAuth/Passport
- **No router library**: Hash-based routing via `window.location.hash`
- **Serverless-first**: All backend code is stateless serverless functions
- **i18n**: Manual implementation, translations in `constants.ts`

---

# ⚠️ CRITICAL SECURITY WARNINGS

## 🚨 严重警告：开发/测试代码与生产数据隔离

**最后更新**: 2025-12-18
**严重程度**: CRITICAL

### 历史Bug记录

**问题**: 开发测试用户初始化代码影响真实生产用户数据

**发现的问题**:
1. `api/test/init-dev-user.ts` 使用固定的 `google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'` 来标识开发用户
2. 如果真实用户的 `google_id` 字段被错误设置为这个值，开发代码会查找并操作该真实用户
3. 真实用户数据异常：返回的是 Google 头像而非预期的 DiceBear 测试头像，说明开发代码正在操作真实用户
4. 可能导致真实用户的 `user_credits`、`user_subscriptions` 等数据被开发测试逻辑修改

**根本原因**:
- ❌ 缺少严格的环境隔离检查
- ❌ 缺少数据库层面的保护机制
- ❌ OAuth 登录流程没有自动创建 credits/subscriptions 记录

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

### ❌ 当前状态（有严重问题）

1. **新用户通过 Google OAuth 登录**:
   - `api/auth/google/callback.ts` 调用 `findOrCreateUser()`
   - ✅ 创建 `users` 表记录
   - ❌ **不会**自动创建 `user_credits` 记录
   - ❌ **不会**自动创建 `user_subscriptions` 记录
   - **结果**: 用户登录成功，但**缺少 credits 和 subscription 数据**！

2. **老用户登录**:
   - ✅ 更新 `users.last_login_at` 时间戳
   - ❌ **不会**检查是否缺少 `user_credits` 或 `user_subscriptions`
   - **结果**: 如果用户之前缺少这些记录，**会一直缺少**

3. **开发测试用户**:
   - `api/test/init-dev-user.ts` 会创建完整记录
   - ❌ **严重 bug**: 可能影响真实用户数据

### ✅ 应该实现的正确流程

**新用户 OAuth 登录应该做的事**:
```
创建 users 记录
↓
创建 user_subscriptions (plan='free', status='active')
↓
创建 user_credits (根据套餐分配初始积分)
↓
创建 credits_transactions (记录初始积分发放)
```

**老用户登录应该做的事**:
```
更新 last_login_at
↓
检查是否缺少 user_credits
↓ (如果缺少)
创建缺失记录 + 记录错误日志
↓
检查是否缺少 user_subscriptions
↓ (如果缺少)
创建缺失记录 + 记录错误日志
```

### 数据库保护机制

**已有的保护** ✅:
- `users.email` - UNIQUE 约束（防止重复邮箱）
- `users.google_id` - UNIQUE 约束（防止重复 Google ID）
- `user_credits.user_id` - **UNIQUE 约束**（防止同一用户多条 credits 记录）
- FOREIGN KEY 约束 + ON DELETE CASCADE

**缺少的保护** ❌:
- 没有环境隔离（开发和生产在同一数据库）
- 没有数据完整性检查（登录时不检查必需记录）
- 没有自动修复机制（不会补充缺失记录）

---

## 🔧 待修复问题清单

### 高优先级（立即修复）

- [ ] **修复 `api/test/init-dev-user.ts`**: 添加严格的生产环境阻止
- [ ] **修复 `api/auth/google/callback.ts`**: 自动创建 credits 和 subscriptions
- [ ] **创建数据修复脚本**: 为现有用户补充缺失记录
- [ ] **数据库调查**: 检查是否有真实用户的 google_id 被错误设置

### 中优先级

- [ ] 添加登录时的数据完整性检查中间件
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
