# Google OAuth 认证集成指南

本文档说明如何配置和使用 Google OAuth 认证功能。

## 前置要求

1. **Vercel Postgres 数据库**
   - 在 Vercel Dashboard 中创建 Postgres 数据库
   - 环境变量会自动配置

2. **Google Cloud Console 配置**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目
   - 启用 Google+ API
   - 创建 OAuth 2.0 客户端 ID（Web 应用类型）

## 环境变量配置

### 在 Vercel Dashboard 中配置：

1. 进入项目设置 → Environment Variables
2. 添加以下变量：

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
JWT_SECRET=your-random-secret-key
NEXTAUTH_SECRET=your-random-secret-key
```

### Google OAuth 重定向 URI 配置：

在 Google Cloud Console 的 OAuth 客户端配置中，添加以下授权重定向 URI：

**开发环境：**
```
http://localhost:3000/api/auth/google/callback
```

**生产环境：**
```
https://your-domain.vercel.app/api/auth/google/callback
```

## 数据库初始化

首次部署后，数据库表会自动创建。如果需要手动初始化：

1. 访问 `/api/init-db` 端点，或
2. 在 Vercel Dashboard 中运行数据库迁移

## API 端点说明

- `GET /api/auth/google/login` - 发起 Google OAuth 登录
- `GET /api/auth/google/callback` - Google OAuth 回调处理
- `GET /api/auth/session` - 获取当前用户会话
- `POST /api/auth/logout` - 登出
- `GET /api/auth/verify?token=xxx` - 验证 token（用于子项目）

## 前端使用

### 检查登录状态

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, authenticated, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (authenticated) {
    return <div>Hello, {user?.name}</div>;
  }
  
  return <button onClick={login}>Login with Google</button>;
}
```

### 获取 Token

```typescript
const { getToken } = useAuth();
const token = getToken(); // 从 localStorage 获取
```

## 跨子项目登录状态同步

### 方案 1：URL 参数传递（当前实现）

主项目跳转到子项目时，会将 token 作为 URL 参数传递：

```
https://sub-project.vercel.app/?token=xxx
```

子项目需要：

1. 读取 URL 参数中的 token
2. 调用主项目的验证端点验证 token：
   ```javascript
   fetch('https://main-project.vercel.app/api/auth/verify?token=xxx')
     .then(res => res.json())
     .then(data => {
       if (data.valid) {
         // 创建本地 session
         localStorage.setItem('user', JSON.stringify(data.user));
       }
     });
   ```

### 方案 2：postMessage（推荐用于跨域）

子项目加载时通过 postMessage 请求 token：

```javascript
// 子项目代码
window.addEventListener('message', (event) => {
  if (event.origin === 'https://main-project.vercel.app' && event.data.type === 'TOKEN_RESPONSE') {
    const token = event.data.token;
    // 验证并保存 token
  }
});

// 请求 token
window.parent.postMessage({ type: 'REQUEST_TOKEN' }, 'https://main-project.vercel.app');
```

主项目需要添加 token 共享逻辑（在 ToolSelector 组件中）。

## 安全注意事项

1. **JWT Secret**: 生产环境必须使用强随机字符串
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **CORS**: `/api/auth/verify` 端点已配置 CORS，允许子项目调用
4. **Token 过期**: Token 默认 24 小时过期
5. **State 验证**: OAuth 流程使用 state 参数防止 CSRF 攻击

## 故障排除

### 1. 登录后重定向失败
- 检查 `GOOGLE_REDIRECT_URI` 是否与 Google Console 中配置的一致
- 检查 Vercel 环境变量是否正确设置

### 2. 数据库连接错误
- 确认 Vercel Postgres 已创建
- 检查数据库环境变量是否自动配置

### 3. Token 验证失败
- 检查 `JWT_SECRET` 是否正确设置
- 确认 token 未过期（24小时内）

### 4. 子项目无法获取 token
- 检查主项目的 `/api/auth/verify` 端点是否可访问
- 确认 CORS 配置正确

## 下一步

- [ ] 实现 token 刷新机制
- [ ] 添加用户角色和权限管理
- [ ] 实现子项目的 postMessage token 共享
- [ ] 添加登录状态同步的实时更新

