# 子应用认证集成指南

本文档说明如何在子应用（Google/Yandex/Bing SEO Agents）中集成主应用的认证系统。

## 认证流程概述

```
1. 用户在主应用登录 (niche-mining)
   ↓
2. 点击工具卡片，主应用生成 Transfer Token
   ↓
3. 在新标签页打开子应用: https://子应用.vercel.app/?tt=transfer_token
   ↓
4. 子应用用 Transfer Token 换取 JWT Token
   ↓
5. 子应用使用 JWT Token 访问主应用的用户数据（credits, subscriptions等）
```

## 详细步骤

### 步骤 1: 主应用生成 Transfer Token

**端点**: `POST /api/auth/create-transfer-token`

**请求**:

```javascript
// 主应用（ToolSelector.tsx）
const response = await fetch("/api/auth/create-transfer-token", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${userJwtToken}`,
    "Content-Type": "application/json",
  },
});

const { transferToken, expiresAt } = await response.json();
```

**响应**:

```json
{
  "transferToken": "a1b2c3d4...", // 64位十六进制字符串
  "expiresAt": "2025-12-18T12:35:00.000Z" // 5分钟后过期
}
```

### 步骤 2: 打开子应用并传递 Transfer Token

```javascript
// 主应用
const baseUrl = "https://google-seo-agents.vercel.app/";
const urlWithToken = `${baseUrl}?tt=${transferToken}`;
window.open(urlWithToken, "_blank", "noopener,noreferrer");
```

### 步骤 3: 子应用兑换 Transfer Token

**子应用启动时**，从 URL 参数获取 `tt`，然后调用主应用的兑换端点：

**端点**: `POST https://niche-mining.vercel.app/api/auth/exchange-transfer-token`
本地情况下是 http://localhost:3000/api/auth/exchange-transfer-token

**请求**:

```javascript
// 子应用（App.tsx 或 AuthContext）
const params = new URLSearchParams(window.location.search);
const transferToken = params.get("tt");

if (transferToken) {
  const response = await fetch(
    "https://niche-mining.vercel.app/api/auth/exchange-transfer-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transferToken }),
    }
  );

  const data = await response.json();

  if (data.success) {
    // 保存 JWT token 到 localStorage
    localStorage.setItem("auth_token", data.token);

    // 保存用户信息
    localStorage.setItem("user", JSON.stringify(data.user));

    // 清除 URL 中的 tt 参数
    window.history.replaceState({}, "", window.location.pathname);
  }
}
```

**响应**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...", // JWT token (24小时有效)
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

### 步骤 4: 使用 JWT Token 访问用户数据

#### 4.1 获取用户 Credits

**端点**: `GET https://niche-mining.vercel.app/api/user/dashboard`

```javascript
const token = localStorage.getItem("auth_token");

const response = await fetch(
  "https://niche-mining.vercel.app/api/user/dashboard",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
console.log("User credits:", data.credits);
// {
//   total: 2000,
//   used: 150,
//   remaining: 1850,
//   bonus: 0
// }
```

#### 4.2 消费 Credits

**端点**: `POST https://niche-mining.vercel.app/api/credits/consume`

```javascript
const response = await fetch(
  "https://niche-mining.vercel.app/api/credits/consume",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credits: 10,
      description: "Keyword mining task",
      relatedEntity: "mining_task",
      relatedEntityId: "task_123",
    }),
  }
);

const data = await response.json();
console.log("Credits remaining:", data.remaining);
```

#### 4.3 验证 Token（可选）

**端点**: `GET/POST https://niche-mining.vercel.app/api/auth/verify`

```javascript
const response = await fetch(
  "https://niche-mining.vercel.app/api/auth/verify",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = await response.json();
if (data.valid) {
  console.log("User:", data.user);
}
```

---

## 完整示例代码

### 子应用 AuthContext.tsx

```typescript
import React, { createContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  authenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  authenticated: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // 1. 检查 URL 参数中的 Transfer Token
      const params = new URLSearchParams(window.location.search);
      const transferToken = params.get("tt");

      if (transferToken) {
        console.log("🔄 Exchanging transfer token...");
        await exchangeTransferToken(transferToken);
        // 清除 URL 参数
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      // 2. 检查 localStorage 中的 JWT Token
      const savedToken = localStorage.getItem("auth_token");
      if (savedToken) {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exchangeTransferToken = async (transferToken: string) => {
    try {
      const response = await fetch(
        "https://niche-mining.vercel.app/api/auth/exchange-transfer-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transferToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to exchange transfer token");
      }

      const data = await response.json();

      if (data.success) {
        // 保存到 state 和 localStorage
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("✅ Authentication successful:", data.user.email);
      }
    } catch (error) {
      console.error("Transfer token exchange error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 安全注意事项

1. **Transfer Token 一次性使用**：

   - Transfer Token 兑换后立即从数据库删除
   - 不能重复使用

2. **Transfer Token 有效期**：

   - 创建后 5 分钟过期
   - 过期后自动删除

3. **JWT Token 有效期**：

   - 24 小时有效
   - 到期后需要用户重新登录主应用

4. **CORS 配置**：

   - `/api/auth/exchange-transfer-token` 和 `/api/auth/verify` 端点启用了 CORS
   - 允许子应用跨域调用

5. **HTTPS**：
   - 生产环境必须使用 HTTPS
   - Transfer Token 通过 URL 传递，需要加密连接

---

## 本地开发测试

### 主应用（localhost:3000）

```bash
# 1. 启动主应用
npm run dev

# 2. 访问 http://localhost:3000
# 3. 点击 init-dev-user 初始化测试用户
# 4. 会自动登录并获得真实的 JWT token
```

### 子应用（localhost:3001）

```bash
# 1. 在子应用启动开发服务器
npm run dev -- --port 3001

# 2. 手动构造带 Transfer Token 的 URL：
#    - 先在主应用点击工具，观察 Network 面板
#    - 复制 /api/auth/create-transfer-token 返回的 transferToken
#    - 访问: http://localhost:3001/?tt=复制的token

# 3. 子应用会自动兑换 token 并获取用户信息
```

**或者**直接在主应用修改 ToolSelector.tsx 中的 URL：

```typescript
// 临时改为本地子应用
const getAgentUrl = (id: string) => {
  switch (id) {
    case "google":
      return "http://localhost:3001/"; // 改这里
    default:
      return "#";
  }
};
```

---

## 故障排查

### 问题 1: Transfer Token 兑换失败

**症状**：`401 Invalid transfer token`

**可能原因**：

- Token 已被使用（一次性）
- Token 已过期（5 分钟）
- Token 格式错误

**解决**：在主应用重新生成 transfer token

### 问题 2: JWT Token 无效

**症状**：`401 Unauthorized` 调用 API 时

**可能原因**：

- Token 已过期（24 小时）
- Token 格式错误
- JWT_SECRET 不匹配

**解决**：清除 localStorage，重新登录主应用

### 问题 3: CORS 错误

**症状**：浏览器控制台显示 CORS 错误

**可能原因**：

- 子应用使用了不支持 CORS 的端点
- 浏览器阻止了跨域请求

**解决**：

- 确保使用 `/api/auth/exchange-transfer-token` 和 `/api/auth/verify`
- 检查浏览器控制台的详细错误信息

---

## 数据库表结构

### sessions 表（存储 Transfer Tokens）

```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  token_hash VARCHAR(64) UNIQUE NOT NULL,  -- SHA256 哈希
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**注意**：Transfer Token 的明文永远不存储在数据库中，只存储 SHA256 哈希值。

---

## API 端点总结

| 端点                                | 方法     | 用途                       | CORS |
| ----------------------------------- | -------- | -------------------------- | ---- |
| `/api/auth/create-transfer-token`   | POST     | 主应用创建 Transfer Token  | ❌   |
| `/api/auth/exchange-transfer-token` | POST     | 子应用兑换 Transfer Token  | ✅   |
| `/api/auth/verify`                  | GET/POST | 验证 JWT Token             | ✅   |
| `/api/user/dashboard`               | GET      | 获取用户数据（credits 等） | ✅   |
| `/api/credits/consume`              | POST     | 消费 credits               | ✅   |

**注意**：标记为 ✅ 的端点支持跨域调用，子应用可以直接使用。
