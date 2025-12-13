# Google OAuth 登录问题修复指南

## 问题诊断

**错误现象**：登录后跳转到 `/?error=invalid_state`

**根本原因**：
1. 预览部署（Preview Deployment）使用动态域名（如 `niche-mining-9szpv7yh5-xxx.vercel.app`）
2. 但 `GOOGLE_REDIRECT_URI` 环境变量固定为生产域名（`https://niche-mining-web.vercel.app/api/auth/google/callback`）
3. **Google OAuth 不支持通配符** (`*.vercel.app`)，无法预先配置动态预览域名
4. OAuth state cookie 在预览域名设置，但 Google 回调到生产域名
5. 导致 callback 端点无法读取 state cookie，验证失败

## 最终解决方案：预览部署禁用真实 OAuth（已实施）

这是业界标准做法。由于 Google OAuth 的限制，预览部署无法使用真实登录。

### ✅ 已应用的修复

#### 1. 后端：检测并拒绝预览部署的 OAuth 请求

**文件**: `api/auth/google/login.ts:10-16`

```typescript
// 预览部署禁用 OAuth（Google 不支持动态域名）
if (process.env.VERCEL_ENV === 'preview') {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  return res.redirect(`${baseUrl}/?error=oauth_disabled_in_preview`);
}
```

#### 2. 前端：检测错误并静默处理

**文件**: `contexts/AuthContext.tsx:127-134`

```typescript
// 检查是否是预览部署的 OAuth 错误
if (error === 'oauth_disabled_in_preview') {
  console.warn('OAuth is disabled in preview deployments. Please test on production or local development.');
  // 清除 URL 参数
  window.history.replaceState({}, document.title, window.location.pathname);
  setLoading(false);
  return;
}
```

#### 3. UI：拦截登录点击并显示友好提示

**文件**: `components/Navbar.tsx:12-37`

```typescript
// 检测是否是预览部署
const isPreviewDeployment = typeof window !== 'undefined' &&
  window.location.hostname.includes('vercel.app') &&
  !window.location.hostname.startsWith('niche-mining-web.vercel.app');

const handleLogin = () => {
  if (isPreviewDeployment) {
    alert(
      'OAuth login is disabled in preview deployments.\n\n' +
      'Reason: Google OAuth does not support dynamic preview URLs.\n\n' +
      'Please test login on:\n' +
      '• Production: https://niche-mining-web.vercel.app\n' +
      '• Local dev: http://localhost:3000'
    );
    return;
  }
  login();
};
```

### ✅ Cookie 一致性修复

确保 `login.ts` 和 `callback.ts` 使用相同的 cookie 设置逻辑：

```typescript
// 两个文件都使用相同的逻辑
const isSecure = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_URL?.startsWith('https');
const secureCookie = isSecure ? 'Secure; ' : '';
```

### ✅ Cookie 解析改进

更健壮的 cookie 解析，支持 value 中包含 `=` 的情况：

```typescript
const cookiePairs = cookies.split(';').map(c => c.trim());
const stateCookie = cookiePairs
  .find(c => c.startsWith('oauth_state='))
  ?.substring('oauth_state='.length);
```

---

## 配置步骤

### 1. 确保 Vercel 环境变量正确配置

访问 Vercel Dashboard → 项目设置 → Environment Variables

#### Production 环境：
```bash
GOOGLE_CLIENT_ID=954845094272-qst08e4v7rjq2icl7b2b83v3r5q1o5k5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=https://niche-mining-web.vercel.app/api/auth/google/callback
JWT_SECRET=your-secret-key
POSTGRES_URL=postgres://...
```

#### Preview 环境：
```bash
# 不设置 GOOGLE_REDIRECT_URI（OAuth 已禁用）
# 或继承 Production 环境的配置（不影响，因为代码会拦截）
```

#### Development 环境：
```bash
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
# 其他变量从 .env.local 读取
```

### 2. 更新 Google Cloud Console

访问 [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

在 OAuth 2.0 客户端 ID 的「已授权的重定向 URI」中**仅添加**：

```
https://niche-mining-web.vercel.app/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

**不要添加**：
- ❌ `https://niche-mining-*.vercel.app/...` （Google 不支持通配符）
- ❌ 预览部署的动态域名（每次都不同，无法维护）

---

## 测试步骤

### 本地测试

1. 确保 `.env.local` 中设置：
   ```bash
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   ```

2. 运行开发服务器：
   ```bash
   npm run dev
   ```

3. 访问 `http://localhost:3000`，点击登录按钮

4. 检查是否成功登录并显示用户信息

### 生产环境测试

1. 访问 `https://niche-mining-web.vercel.app`
2. 点击登录按钮
3. 完成 Google OAuth
4. 检查是否成功登录并显示用户信息（头像、名称、退出按钮）

### 预览部署测试

1. 访问任意预览部署 URL（如 `https://niche-mining-9szpv7yh5-xxx.vercel.app`）
2. 点击登录按钮
3. **预期行为**：显示友好提示信息：
   ```
   OAuth login is disabled in preview deployments.

   Reason: Google OAuth does not support dynamic preview URLs.

   Please test login on:
   • Production: https://niche-mining-web.vercel.app
   • Local dev: http://localhost:3000
   ```
4. **不会**跳转到 Google 登录页面

---

## 用户体验说明

### 生产环境
- ✅ 完整的 Google OAuth 登录流程
- ✅ 登录后显示用户头像和名称
- ✅ 可以正常退出登录

### 预览部署
- ⚠️ 登录按钮被拦截，显示友好提示
- ℹ️ 用户了解为什么不能登录
- ℹ️ 提供替代测试方案（生产环境或本地开发）

### 本地开发
- ✅ 完整的 Google OAuth 登录流程（需配置 localhost 回调 URL）
- ✅ 开发者可以在本地测试完整的登录功能

---

## 关于 url.parse() Deprecation Warning

**警告信息**：
```
(node:4) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized
```

**原因**：
- 这个警告来自 Node.js 依赖包（不是我们的代码）
- 很可能是 `@vercel/node` 或其他依赖包使用了 `url.parse()`
- 我们的代码已全部使用 `URLSearchParams` 和 WHATWG URL API

**影响**：
- 仅是警告，不影响功能
- Node.js 未来版本可能移除 `url.parse()`

**解决方案**：
- 等待依赖包更新到使用 WHATWG URL API
- 或在 Vercel 部署时忽略此警告（不影响运行）

---

## 常见问题

### Q: 为什么预览部署不能登录？

A: Google OAuth 不支持通配符重定向 URI，而预览部署使用动态域名（每次部署都不同），无法预先在 Google Console 中配置。这是所有使用 Vercel 预览部署的项目都会遇到的限制。

### Q: 有办法在预览部署中测试登录吗？

A: 有以下几种方式：
1. **推荐**：在生产环境测试（`https://niche-mining-web.vercel.app`）
2. 在本地开发环境测试（`http://localhost:3000`）
3. 如果有 Vercel Pro 账号，配置固定的预览域名
4. 实现 Mock 登录用于 UI 测试（不需要真实 OAuth）

### Q: 生产环境可以登录吗？

A: 是的！代码已修复所有问题：
- ✅ Cookie 设置一致
- ✅ State 验证正确
- ✅ 环境变量配置正确
- ✅ Google Console 已配置生产域名

只要在 Vercel 和 Google Console 中正确配置，生产环境的登录应该完全正常。

### Q: 本地开发时登录失败？

A: 确保：
1. `.env.local` 中设置了 `GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback`
2. Google Console 中添加了 `http://localhost:3000/api/auth/google/callback`
3. 使用 `npm run dev`（不是 `npm run dev:vite`）

### Q: 如何调试登录问题？

A:
1. 打开浏览器开发者工具 → Network
2. 访问 `/api/auth/google/login`
3. 检查 Response Headers 中是否有 `Set-Cookie: oauth_state=...`
4. 访问 `/api/auth/google/callback` 时，检查 Request Headers 中是否有 `Cookie: oauth_state=...`
5. 查看 Vercel Function Logs 中的调试信息（包含详细的 state 验证日志）

---

## 总结

### ✅ 已修复的问题

1. **Cookie 一致性**：login 和 callback 使用相同的 Secure 标志逻辑
2. **Cookie 解析**：更健壮的解析方式，支持特殊字符
3. **预览部署处理**：友好的用户提示，说明为什么不能登录
4. **调试日志**：详细的日志帮助排查问题

### 📋 配置清单

- [ ] Vercel 环境变量已正确配置（Production, Development）
- [ ] Google Cloud Console 中已添加正确的回调 URL
- [ ] 代码已部署到生产环境
- [ ] 生产环境登录测试通过
- [ ] 本地开发环境登录测试通过
- [ ] 预览部署显示正确的提示信息

### 🎯 预期行为

| 环境 | 登录行为 | 用户体验 |
|------|---------|---------|
| **生产环境** | ✅ 完整 OAuth 流程 | 正常登录，显示用户信息 |
| **预览部署** | ⚠️ ���截并提示 | 友好提示，引导到生产环境测试 |
| **本地开发** | ✅ 完整 OAuth 流程 | 正常登录，便于开发测试 |

---

**文档版本**: 2.0
**更新日期**: 2025-12-14
**维护者**: Niche Mining Team
