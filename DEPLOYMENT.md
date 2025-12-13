# 部署指南

## 前置步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**
4. 创建 **OAuth 2.0 客户端 ID**：
   - 应用类型：**Web 应用**
   - 授权重定向 URI：
     - 开发：`http://localhost:3000/api/auth/google/callback`
     - 生产：`https://your-domain.vercel.app/api/auth/google/callback`

### 3. 配置 Vercel Postgres

1. 在 Vercel Dashboard 中，进入项目设置
2. 点击 **Storage** → **Create Database** → **Prisma Postgres**（或 **Postgres**，如果有这个选项）
   - **注意**：Vercel 现在主要提供 Prisma Postgres，它和标准 Postgres 完全兼容
   - 选择 Prisma Postgres 即可，`@vercel/postgres` 包可以正常使用
3. 创建数据库后，**必须点击 "Connect Project"** 将数据库连接到你的项目
   - ⚠️ **重要**：如果不连接，环境变量不会被自动添加到项目中
4. 连接后，数据库环境变量会自动添加到项目中：
   - `POSTGRES_URL`
   - `DATABASE_URL` (或 `POSTGRES_PRISMA_URL`)
   - 这些变量会自动配置，无需手动添加

### 4. 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 中添加：

**生产环境（Production）必须配置：**

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET=generate-a-random-secret-key-here
NEXTAUTH_SECRET=generate-a-random-secret-key-here
GOOGLE_REDIRECT_URI=https://niche-mining-web.vercel.app/api/auth/google/callback
```

**注意**：

- `GOOGLE_REDIRECT_URI` 必须精确匹配你的生产域名
- 如果不设置 `GOOGLE_REDIRECT_URI`，代码会自动使用 `https://${VERCEL_URL}/api/auth/google/callback`，但为了明确，建议手动设置
- 环境变量需要在 **Production**、**Preview** 和 **Development** 三个环境中分别配置（或使用 All Environments）

**生成 JWT_SECRET**：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. 初始化数据库

**✨ 好消息：数据库表会在首次用户登录时自动创建！**

代码中已经包含了自动初始化逻辑，当你第一次有用户通过 Google 登录时，`users` 表会自动创建。**所以你实际上不需要手动执行这一步！**

#### 如果你想手动初始化（可选），有以下几种方法：

##### 方法 1：使用 Prisma Studio（推荐，最简单）

1. 在 Vercel Dashboard 的数据库页面，点击 **"Open in Prisma"** 按钮
2. 这会打开 Prisma Studio（如果还没安装，会提示你安装 Prisma CLI）
3. 在 Prisma Studio 中，你可以使用 SQL 查询功能执行下面的 SQL 语句

##### 方法 2：部署后访问 API 端点（最简单）

1. 部署项目到 Vercel
2. 在浏览器访问：`https://niche-mining-web.vercel.app/api/init-db`
3. 如果成功，会返回：`{"message":"Database initialized successfully","tables":["users"]}`

##### 方法 3：通过数据库客户端工具

1. 从 Vercel Dashboard 复制 `POSTGRES_URL`（点击 "Show secret"）
2. 使用 PostgreSQL 客户端（如 pgAdmin、DBeaver、或命令行 `psql`）连接数据库
3. 执行下面的 SQL 语句：

```sql
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

#### ⚠️ 推荐做法

**直接跳过手动初始化**，部署后直接测试登录功能，表会自动创建！这是最省事的方法。

## 本地开发

### 1. 创建 `.env.local` 文件

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-jwt-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 2. 连接 Vercel Postgres（本地开发）

```bash
# 链接项目（如果还没有链接）
vercel link

# 拉取环境变量（包含 DATABASE_URL 等数据库连接信息）
vercel env pull .env.local
```

**注意**：Vercel Prisma Postgres 会自动设置 `DATABASE_URL` 环境变量，`@vercel/postgres` 包会自动识别并使用它。

### 3. 运行开发服务器

**推荐方式（同时支持前端和 API 路由）：**

```bash
npm run dev
```

这会使用 `vercel dev`，可以同时运行：

- Vite 前端开发服务器
- Vercel Serverless Functions (API 路由)

**如果只需要运行前端（不测试 API）：**

```bash
npm run dev:vite
```

**首次运行 `vercel dev` 时：**

- 会提示是否链接到 Vercel 项目，选择 Yes
- 会提示是否拉取环境变量，选择 Yes
- API 路由会自动处理，访问 `http://localhost:3000/api/*` 即可测试

## 部署到 Vercel

### 方式 1：通过 Vercel CLI

```bash
vercel
```

### 方式 2：通过 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Vercel Dashboard 中导入项目
3. 配置环境变量
4. 部署

## 测试

1. 访问 `https://your-domain.vercel.app`
2. 点击 "Login" 按钮
3. 使用 Google 账号登录
4. 验证用户信息显示在导航栏
5. 点击工具卡片，验证 token 是否正确传递

## 子项目集成

子项目需要实现以下逻辑来验证和接收 token：

```javascript
// 1. 从 URL 参数获取 token
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

if (token) {
  // 2. 验证 token
  fetch("https://main-project.vercel.app/api/auth/verify?token=" + token)
    .then((res) => res.json())
    .then((data) => {
      if (data.valid) {
        // 3. 保存用户信息到本地
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // 4. 清除 URL 中的 token
        window.history.replaceState({}, "", window.location.pathname);
      }
    });
}
```

## 故障排除

### 数据库连接错误

- 确认 Vercel Prisma Postgres 已创建并连接到项目
- 检查环境变量是否正确设置（`DATABASE_URL` 应该自动配置）
- 确认在 Vercel Dashboard 中数据库已连接到项目
- 查看 Vercel 函数日志获取详细错误信息
- 如果使用 `vercel dev`，确保已运行 `vercel env pull .env.local`

### OAuth 重定向失败

- 检查 `GOOGLE_REDIRECT_URI` 是否与 Google Console 配置一致
- 确认环境变量在 Vercel Dashboard 中已设置

### Token 验证失败

- 检查 `JWT_SECRET` 是否在所有环境中一致
- 确认 token 未过期（24 小时内）

### CORS 错误

- `/api/auth/verify` 端点已配置 CORS
- 确认子项目调用时使用正确的域名

## 安全建议

1. **生产环境必须使用 HTTPS**
2. **JWT_SECRET 必须使用强随机字符串**
3. **定期轮换 JWT_SECRET**（需要所有用户重新登录）
4. **限制 API 调用频率**（考虑使用 Vercel Edge Config + Upstash）
5. **监控异常登录行为**
