# 跨项目认证协议设计文档

## 概述

本文档描述了 Niche Mining 主应用与其子项目（Google/Yandex/Bing SEO Agents）之间的安全认证协议设计。

## 当前架构

**主应用**：`niche-mining` (此项目)
- 处理 Google OAuth 登录
- 生成和管理 JWT tokens
- 提供用户数据库

**子项目**：
- `google-seo-agents`
- `yandex-seo-agents`
- `bing-seo-agents`

**当前传递方式**：
- URL 参数：`?token=xxx`
- 验证端点：`/api/auth/verify`

### 当前方案的安全隐患

⚠️ Token 在 URL 中会被记录在：
- 浏览器历史记录
- 服务器访问日志
- 代理服务器日志
- 浏览器扩展可能读取
- Referrer headers

---

## 推荐方案：共享数据库 + 一次性Transfer Token

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Postgres Database                  │
│                        (Shared)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐            │
│  │  users   │  │ sessions │  │ api_tokens   │            │
│  └──────────┘  └──────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
         ▲              ▲              ▲
         │              │              │
    ┌────┴────┐    ┌────┴────┐   ┌────┴────┐
    │  Main   │    │ Google  │   │ Yandex  │
    │  App    │    │ Agent   │   │ Agent   │
    └─────────┘    └─────────┘   └─────────┘
```

### 认证流程

```
┌──────┐                  ┌──────┐                  ┌──────┐
│ User │                  │ Main │                  │ Sub  │
│      │                  │ App  │                  │ App  │
└──┬───┘                  └──┬───┘                  └──┬───┘
   │                         │                         │
   │ 1. Click Tool Card      │                         │
   ├────────────────────────>│                         │
   │                         │                         │
   │                         │ 2. Generate Transfer    │
   │                         │    Token (5min TTL)     │
   │                         │    Store in DB          │
   │                         │                         │
   │ 3. Open URL with        │                         │
   │    ?tt=<transfer_token> │                         │
   ├─────────────────────────┼────────────────────────>│
   │                         │                         │
   │                         │                         │ 4. Verify Transfer
   │                         │<────────────────────────┤    Token in DB
   │                         │                         │
   │                         │ 5. Return User Data +   │
   │                         │    Long-term JWT        │
   │                         ├────────────────────────>│
   │                         │                         │
   │                         │                         │ 6. Clear URL
   │                         │                         │    Save JWT
   │                         │                         │    Delete Transfer Token
   │                         │                         │
   │ 7. User Authenticated   │                         │
   │<─────────────────────────────────────────────────┤
   │                         │                         │
```

### 数据库 Schema

#### sessions 表

```sql
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,  -- SHA256 hash of transfer token
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,             -- 5分钟后过期
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_token_hash (token_hash),
  INDEX idx_sessions_user_id (user_id)
);
```

### 实施步骤

#### 1. 主应用：创建 Transfer Token 端点

**文件**: `api/auth/create-transfer-token.ts`

**功能**:
- 验证用户的主 JWT token
- 生成随机的 transfer token (64 字符 hex)
- 将 SHA256 hash 存入数据库
- 设置 5 分钟过期时间
- 返回明文 transfer token（仅此一次）

**安全特性**:
- 一次性使用（使用后立即删除）
- 短期有效（5分钟）
- 存储哈希而非明文
- 与用户 ID 关联

#### 2. 主应用：更新跳转逻辑

**文件**: `components/ToolSelector.tsx`

**变更**:
```typescript
// 旧方式（不安全）
window.open(`${url}?token=${longTermToken}`, '_blank');

// 新方式（安全）
const { transferToken } = await fetch('/api/auth/create-transfer-token');
window.open(`${url}?tt=${transferToken}`, '_blank');
```

**优势**:
- Transfer token 在 URL 中停留时间极短
- 即使被记录也无法重复使用
- 5 分钟后自动失效

#### 3. 子项目：验证 Transfer Token

**文件**: `api/auth/verify-transfer.ts` (在子项目中)

**功能**:
1. 接收 transfer token
2. 计算 SHA256 hash
3. 在共享数据库中查询 session
4. 验证：
   - Token 存在
   - 未过期
   - 未被使用过 (created_at === last_used_at)
5. 获取用户信息
6. 删除 transfer token (一次性)
7. 生成长期 JWT token (24小时)
8. 返回用户数据和 JWT

**数据库查询**:
```sql
-- 查询 session
SELECT id, user_id, created_at, expires_at, last_used_at
FROM sessions
WHERE token_hash = $1 AND expires_at > NOW();

-- 验证一次性使用
-- created_at === last_used_at 表示未被使用

-- 获取用户
SELECT id, email, name, picture
FROM users
WHERE id = $2;

-- 删除 transfer token
DELETE FROM sessions WHERE id = $3;
```

#### 4. 子项目：前端认证初始化

**文件**: `contexts/AuthContext.tsx` (在子项目中)

**流程**:
```typescript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const transferToken = urlParams.get('tt');

  if (transferToken) {
    // 立即清除 URL（避免被记录）
    window.history.replaceState({}, '', window.location.pathname);

    // 验证 transfer token
    const { token, user } = await verifyTransferToken(transferToken);

    // 保存长期 JWT
    localStorage.setItem('auth_token', token);
    setUser(user);
  } else {
    // 使用已存储的 JWT 刷新 session
    await refreshSession();
  }
}, []);
```

### 环境配置

#### 主应用环境变量

```bash
# .env.local
POSTGRES_URL=postgres://...@db.prisma.io:5432/...
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

#### 子项目环境变量

```bash
# .env.local (在每个子项目中)
POSTGRES_URL=postgres://...@db.prisma.io:5432/...  # 相同的数据库
JWT_SECRET=your-secret-key                          # 相同的密钥
```

**重要**: 所有项目必须：
1. 使用相同的 `POSTGRES_URL`（共享数据库）
2. 使用相同的 `JWT_SECRET`（验证 JWT）
3. 在同一个 Vercel Team 下（便于管理）

### 安全优势

✅ **一次性使用**
- Transfer token 使用后立即删除
- 无法被重放攻击

✅ **短期有效**
- 5 分钟过期时间
- 减少窗口期风险

✅ **不存储明文**
- 数据库只存储 SHA256 hash
- 即使数据库泄露，token 也无法还原

✅ **URL 暴露时间短**
- 子项目立即清除 URL 参数
- 减少日志记录风险

✅ **共享用户状态**
- 所有子项目访问同一用户数据
- 数据一致性保证
- 便于统一管理

✅ **可审计**
- 可记录 session 创建和使用
- 可追踪用户跨项目活动
- 便于安全分析

### 可扩展性

#### 添加新子项目

1. 创建新的 Vercel 项目
2. 配置相同的环境变量（`POSTGRES_URL`, `JWT_SECRET`）
3. 复制 `api/auth/verify-transfer.ts` 和 `lib/db.ts`
4. 在主应用的 `ToolSelector.tsx` 中添加工具卡片
5. 完成！无需修改认证逻辑

#### 单点登出

```typescript
// 在主应用或任意子项目
async function globalLogout(userId: string) {
  // 删除用户的所有 sessions
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;

  // 通知其他子项目清除本地 token
  // (可选：使用 WebSocket 或轮询)
}
```

#### 用户权限管理

```sql
-- 在 users 表添加角色字段
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- 在 sessions 表添加权限字段
ALTER TABLE sessions ADD COLUMN scopes TEXT[];
```

### 备选方案：不共享数据库

如果无法共享数据库，可以使用改进的 JWT 传递方式：

#### 方案 A: POST 提交 Token

```typescript
// 主应用：使用隐藏表单 POST 提交
const form = document.createElement('form');
form.method = 'POST';
form.action = subProjectUrl;
form.target = '_blank';

const tokenInput = document.createElement('input');
tokenInput.type = 'hidden';
tokenInput.name = 'token';
tokenInput.value = getToken();

form.appendChild(tokenInput);
document.body.appendChild(form);
form.submit();
document.body.removeChild(form);
```

**优点**: Token 不在 URL 中
**缺点**: 刷新页面会提示重新提交

#### 方案 B: 中转页面

```typescript
// 主应用：打开中转页面
window.open(`/transfer?target=google`, '_blank');

// /transfer 页面：使用 postMessage
const token = localStorage.getItem('auth_token');
const subWindow = window.open(subProjectUrl, '_self');
subWindow.postMessage({ token }, subProjectUrl);
```

**优点**: 不在 URL 或 POST 中
**缺点**: 需要额外的中转页面，用户体验稍差

### 推荐实施优先级

1. **P0**: 实施共享数据库 + Transfer Token 方案
2. **P1**: 添加 session 清理任务（删除过期 sessions）
3. **P2**: 添加速率限制（防止暴力破解）
4. **P3**: 添加审计日志（记录认证事件）

### 定期清理任务

建议创建 Vercel Cron Job 清理过期 sessions：

```typescript
// api/cron/cleanup-sessions.ts
export default async function handler(req, res) {
  // 删除过期的 sessions
  await sql`DELETE FROM sessions WHERE expires_at < NOW()`;

  // 删除超过 30 天的旧 sessions
  await sql`
    DELETE FROM sessions
    WHERE created_at < NOW() - INTERVAL '30 days'
  `;

  return res.json({ success: true });
}
```

**配置 Cron**: 在 `vercel.json` 添加：
```json
{
  "crons": [{
    "path": "/api/cron/cleanup-sessions",
    "schedule": "0 */6 * * *"  // 每 6 小时运行一次
  }]
}
```

---

## 结论

**推荐方案**: 共享数据库 + 一次性 Transfer Token

**理由**:
1. 最安全
2. 最易维护
3. 最符合 SaaS 多产品架构
4. Vercel Postgres 原生支持多项目访问
5. 可扩展性强

**实施时间**: 约 2-3 小时
**维护成本**: 低（数据库自动管理，无需额外服务）
**安全等级**: ⭐⭐⭐⭐⭐

---

## 附录：代码模板

### A. 主应用 - Create Transfer Token

见文件：`api/auth/create-transfer-token.ts`（待实施）

### B. 子项目 - Verify Transfer Token

见文件：`api/auth/verify-transfer.ts`（待实施）

### C. 子项目 - Auth Context

见文件：`contexts/AuthContext.tsx`（待实施）

### D. 数据库迁移脚本

见文件：`api/init-db.ts`（更新 sessions 表）

---

**文档版本**: 1.0
**创建日期**: 2025-12-14
**维护者**: Niche Mining Team
