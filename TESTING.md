# 测试指南

## ✅ 已完成

- [x] 数据库连接配置
- [x] 数据库表初始化（users 表已创建）

## 下一步：测试 Google OAuth 登录

### 方式 1：本地调试（推荐，便于调试）

#### 1. 确保本地环境变量已配置

检查 `.env.local` 文件，确保包含：
```env
GOOGLE_CLIENT_ID=954845094272-qst08e4v7rjq2icl7b2b83v3r5q1o5k5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
JWT_SECRET=qkf5TRIZX+WQN1zklJJPPwfIsdO4IntfifTLu9w+ibQ=
NEXTAUTH_SECRET=qkf5TRIZX+WQN1zklJJPPwfIsdO4IntfifTLu9w+ibQ=

# 数据库连接（从 Vercel 拉取）
# 运行: vercel env pull .env.local
```

#### 2. 确保 Google OAuth 配置了本地重定向 URI

在 [Google Cloud Console](https://console.cloud.google.com/) 中，确保已添加：
- 授权重定向 URI: `http://localhost:3000/api/auth/google/callback`

#### 3. 拉取 Vercel 环境变量（包含数据库连接）

```bash
vercel env pull .env.local
```

这会自动添加数据库连接信息。

#### 4. 启动本地开发服务器

```bash
npm run dev
```

这会启动 `vercel dev`，同时支持：
- 前端开发服务器（Vite）
- API 路由（Serverless Functions）

#### 5. 测试步骤

1. **访问首页**：打开 `http://localhost:3000`
2. **点击登录按钮**：在导航栏点击 "Login" 按钮
3. **Google OAuth 流程**：
   - 会重定向到 Google 登录页面
   - 选择 Google 账号
   - 授权应用
   - 自动重定向回首页（`/?token=xxx`）
4. **验证登录状态**：
   - 导航栏应显示用户头像/名称
   - "Login" 按钮变为 "Logout"
5. **测试会话 API**：
   - 访问 `http://localhost:3000/api/auth/session`
   - 应该返回用户信息
6. **测试工具跳转**：
   - 点击工具卡片（Google/Yandex/Bing）
   - URL 应包含 token 参数
   - 例如：`https://google-seo-agen-ts-lans.vercel.app/?token=xxx`

---

### 方式 2：生产环境测试

#### 1. 确保生产环境变量已配置

在 Vercel Dashboard → Settings → Environment Variables，确认已设置：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `GOOGLE_REDIRECT_URI=https://niche-mining-web.vercel.app/api/auth/google/callback`

#### 2. 确保 Google OAuth 配置了生产重定向 URI

在 Google Cloud Console 中，确保已添加：
- 授权重定向 URI: `https://niche-mining-web.vercel.app/api/auth/google/callback`

#### 3. 测试步骤

1. **访问生产网站**：`https://niche-mining-web.vercel.app`
2. **点击登录按钮**
3. **完成 Google OAuth 流程**
4. **验证登录状态**

---

## 常见问题排查

### 1. 登录后页面空白或报错

- 检查浏览器控制台错误
- 检查 Vercel 函数日志（Deployments → Functions → 查看日志）
- 确认环境变量是否正确设置

### 2. "Invalid state" 错误

- 清除浏览器 cookie
- 重新尝试登录

### 3. 数据库连接错误

- 确认数据库已连接到项目
- 检查环境变量是否包含 `POSTGRES_URL`

### 4. Token 验证失败

- 检查 `JWT_SECRET` 是否在所有环境中一致
- 确认 token 未过期（24小时内）

---

## 测试检查清单

- [ ] 本地开发服务器正常启动
- [ ] Google OAuth 登录流程正常
- [ ] 登录后用户信息显示在导航栏
- [ ] `/api/auth/session` 返回正确的用户信息
- [ ] 登出功能正常
- [ ] 工具跳转时 token 正确传递
- [ ] 生产环境部署正常
- [ ] 生产环境登录流程正常

---

## 下一步：子项目集成

测试完主项目的登录功能后，需要在子项目中实现：

1. 接收 URL 中的 token
2. 调用主项目的 `/api/auth/verify` 验证 token
3. 保存用户信息到本地
4. 实现登录状态同步

详细说明请参考 `README_AUTH.md` 中的"跨子项目登录状态同步"章节。

