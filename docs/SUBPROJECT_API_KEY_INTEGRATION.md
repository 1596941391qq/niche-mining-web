# 子应用 API Key 集成指南

## 概述

子应用需要获取当前用户的 API Key 来进行 API 调用。如果用户没有 API Key，需要自动创建一个。

## 集成流程

### 1. 检查用户登录状态

首先需要确认用户已登录，可以通过调用 session API：

```typescript
async function checkUserLogin(): Promise<{
  authenticated: boolean;
  user?: any;
}> {
  const response = await fetch("https://www.nichedigger.ai/api/auth/session", {
    method: "GET",
    credentials: "include", // 重要：发送 cookie
  });

  return await response.json();
}
```

### 2. 获取用户的 API Keys

如果用户已登录，尝试获取用户的 API Keys：

```typescript
async function getUserApiKeys(): Promise<{ success: boolean; data?: any }> {
  const response = await fetch("https://www.nichedigger.ai/api/v1/api-keys", {
    method: "GET",
    credentials: "include", // 重要：发送 cookie（包含 JWT token）
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return { success: false };
  }

  return await response.json();
}
```

**注意**：此接口支持从 cookie 中获取 JWT token，所以使用 `credentials: 'include'` 即可。

### 3. 如果没有 API Key，则创建一个

如果用户没有 API Key 或获取失败，创建一个新的：

```typescript
async function createApiKey(
  name: string = "Subproject API Key"
): Promise<{ success: boolean; data?: any }> {
  const response = await fetch("https://www.nichedigger.ai/api/v1/api-keys", {
    method: "POST",
    credentials: "include", // 重要：发送 cookie（包含 JWT token）
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "创建 API Key 失败");
  }

  return await response.json();
}
```

**重要**：创建 API Key 时，响应中会返回**完整的 API Key**（格式：`nm_live_xxxxx`），这是唯一一次可以看到完整 Key 的机会，请妥善保存。

### 4. 完整示例：获取或创建 API Key

```typescript
/**
 * 获取或创建用户的 API Key
 * @returns API Key 字符串（格式：nm_live_xxxxx）
 */
async function getOrCreateApiKey(): Promise<string | null> {
  try {
    // 1. 检查用户是否登录
    const session = await checkUserLogin();
    if (!session.authenticated) {
      console.warn("用户未登录");
      return null;
    }

    // 2. 尝试获取现有的 API Keys
    const apiKeysResponse = await getUserApiKeys();

    if (apiKeysResponse.success && apiKeysResponse.data?.apiKeys?.length > 0) {
      // 用户已有 API Key
      // 注意：GET 接口只返回前缀，不返回完整 Key
      // 如果子应用需要完整 Key，需要创建新的
      const activeKey =
        apiKeysResponse.data.apiKeys.find((key: any) => key.isActive) ||
        apiKeysResponse.data.apiKeys[0];

      console.log(`用户已有 API Key: ${activeKey.keyPrefix}...`);

      // 如果子应用之前保存过完整 Key，可以从本地存储获取
      // 否则需要创建新的
      const savedApiKey = localStorage.getItem("nichedigger_api_key");
      if (savedApiKey && savedApiKey.startsWith("nm_live_")) {
        return savedApiKey;
      }
    }

    // 3. 创建新的 API Key
    console.log("创建新的 API Key...");
    const createResponse = await createApiKey("子应用 API Key");

    if (createResponse.success && createResponse.data?.apiKey) {
      const apiKey = createResponse.data.apiKey;

      // 保存到本地存储（可选，但建议保存）
      localStorage.setItem("nichedigger_api_key", apiKey);

      console.log("API Key 创建成功");
      return apiKey;
    }

    return null;
  } catch (error) {
    console.error("获取 API Key 失败:", error);
    return null;
  }
}
```

### 5. 使用 API Key 调用 API

获取到 API Key 后，在后续的 API 调用中使用：

```typescript
async function callSEOAgent(mode: string, params: any, apiKey: string) {
  const response = await fetch("https://www.nichedigger.ai/api/v1/seo-agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`, // 使用 API Key
    },
    body: JSON.stringify({
      mode,
      ...params,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error);
  }

  return await response.json();
}
```

## 完整集成示例

```typescript
class NicheDiggerAPI {
  private baseUrl = "https://www.nichedigger.ai";
  private apiKey: string | null = null;

  /**
   * 初始化：获取或创建 API Key
   */
  async initialize(): Promise<boolean> {
    try {
      // 检查登录状态
      const session = await fetch(`${this.baseUrl}/api/auth/session`, {
        method: "GET",
        credentials: "include",
      }).then((r) => r.json());

      if (!session.authenticated) {
        console.warn("用户未登录，无法获取 API Key");
        return false;
      }

      // 尝试从本地存储获取
      const savedKey = localStorage.getItem("nichedigger_api_key");
      if (savedKey && savedKey.startsWith("nm_live_")) {
        this.apiKey = savedKey;
        return true;
      }

      // 尝试获取现有 API Keys
      const keysResponse = await fetch(`${this.baseUrl}/api/v1/api-keys`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (keysResponse.ok) {
        const keysData = await keysResponse.json();
        if (keysData.success && keysData.data?.apiKeys?.length > 0) {
          // 用户已有 Key，但无法获取完整 Key
          // 需要创建新的
        }
      }

      // 创建新的 API Key
      const createResponse = await fetch(`${this.baseUrl}/api/v1/api-keys`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "子应用 API Key" }),
      });

      if (!createResponse.ok) {
        throw new Error("创建 API Key 失败");
      }

      const createData = await createResponse.json();
      if (createData.success && createData.data?.apiKey) {
        this.apiKey = createData.data.apiKey;
        localStorage.setItem("nichedigger_api_key", this.apiKey);
        return true;
      }

      return false;
    } catch (error) {
      console.error("初始化 API Key 失败:", error);
      return false;
    }
  }

  /**
   * 调用 SEO Agent API
   */
  async callSEOAgent(mode: string, params: any) {
    if (!this.apiKey) {
      throw new Error("API Key 未初始化，请先调用 initialize()");
    }

    const response = await fetch(`${this.baseUrl}/api/v1/seo-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ mode, ...params }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error);
    }

    return await response.json();
  }
}

// 使用示例
const api = new NicheDiggerAPI();

// 初始化
await api.initialize();

// 调用 API
const result = await api.callSEOAgent("keyword_mining", {
  seedKeyword: "coffee shop",
  systemInstruction: "Generate high-potential SEO keywords.",
  targetLanguage: "ko",
});
```

## 重要注意事项

### 1. Cookie 和跨域

- 所有请求必须使用 `credentials: 'include'` 来发送 cookie
- 确保主应用和子应用在同一个域名下，或者配置了正确的 CORS
- 如果跨域，需要确保 cookie 的 `SameSite` 和 `Secure` 设置正确

### 2. API Key 存储

- **建议**：将 API Key 保存到 `localStorage` 或 `sessionStorage`
- **安全**：不要将 API Key 硬编码在代码中
- **注意**：API Key 创建后无法再次查看完整内容，必须妥善保存

### 3. 错误处理

- 如果用户未登录，提示用户登录
- 如果创建 API Key 失败，检查错误信息（可能是达到数量上限）
- 如果 API Key 过期或无效，需要重新创建

### 4. API Key 格式

- API Key 格式：`nm_live_<hex_string>`
- 在 Authorization header 中使用：`Authorization: Bearer nm_live_xxxxx`

## API 端点总结

| 端点                   | 方法   | 说明               | 认证                   |
| ---------------------- | ------ | ------------------ | ---------------------- |
| `/api/auth/session`    | GET    | 检查登录状态       | Cookie                 |
| `/api/v1/api-keys`     | GET    | 获取 API Keys 列表 | Cookie 或 Bearer Token |
| `/api/v1/api-keys`     | POST   | 创建新的 API Key   | Cookie 或 Bearer Token |
| `/api/v1/api-keys/:id` | DELETE | 删除 API Key       | Cookie 或 Bearer Token |

## 测试建议

1. **测试登录状态检查**：确保能正确检测用户是否登录
2. **测试 API Key 获取**：验证能正确获取用户的 API Keys
3. **测试 API Key 创建**：确保能成功创建新的 API Key
4. **测试 API 调用**：使用创建的 API Key 调用 SEO Agent API
5. **测试错误处理**：测试各种错误情况（未登录、创建失败等）

## 常见问题

### Q: 为什么 GET `/api/v1/api-keys` 不返回完整的 API Key？

A: 出于安全考虑，GET 接口只返回 API Key 的前缀。完整 Key 只在创建时返回一次。

### Q: 如果用户已有 API Key，但子应用没有保存，怎么办？

A: 需要创建一个新的 API Key。或者提示用户手动输入已有的 API Key。

### Q: 可以创建多个 API Key 吗？

A: 可以，但受订阅套餐限制。每个套餐有不同的 `api_keys_limit`。

### Q: API Key 会过期吗？

A: 创建时可以设置 `expiresAt`，如果不设置则永不过期。
