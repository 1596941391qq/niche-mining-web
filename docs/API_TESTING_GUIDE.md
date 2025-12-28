# API 测试指南

本指南将帮助您测试 SEO Agent API 的所有功能。

## 📋 目录

1. [准备工作](#准备工作)
2. [获取认证 Token](#获取认证-token)
3. [创建和管理 API Key](#创建和管理-api-key)
4. [测试 SEO Agent API](#测试-seo-agent-api)
5. [使用测试脚本](#使用测试脚本)

---

## 准备工作

### 1. 确认 API 基础 URL

**本地开发环境:**

```
http://localhost:3000/api/v1
```

**生产环境:**

```
https://www.nichedigger.ai/api/v1
```

### 2. 初始化数据库（首次使用）

访问以下 URL 初始化数据库表：

```
GET /api/init-db
```

**示例:**

```bash
curl http://localhost:3000/api/init-db
```

---

## 获取认证 Token

### 方法 1: 使用 JWT Token（Web 应用）

#### 步骤 1: 登录获取 Token

**本地开发环境:**

```bash
# 访问初始化开发用户 API
curl http://localhost:3000/api/test/init-dev-user
```

**生产环境:**

1. 访问 `https://www.nichedigger.ai`
2. 使用 Google OAuth 登录
3. 打开浏览器控制台 (F12)
4. 执行以下代码获取 token:

```javascript
const token = localStorage.getItem("auth_token");
console.log("Your JWT Token:", token);
```

#### 步骤 2: 验证 Token

```bash
# 替换 YOUR_TOKEN 为实际的 token
TOKEN="YOUR_JWT_TOKEN"

curl http://localhost:3000/api/auth/session \
  -H "Authorization: Bearer $TOKEN"
```

### 方法 2: 创建 API Key（程序化访问）

#### 步骤 1: 创建 API Key

```bash
# 使用 JWT token 创建 API key
TOKEN="YOUR_JWT_TOKEN"

curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "My Test API Key",
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "My Test API Key",
    "apiKey": "nm_live_abc123def456...",
    "keyPrefix": "nm_live_abc123...",
    "expiresAt": null,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "warning": "Please save your API key securely..."
}
```

**⚠️ 重要:** 保存返回的 `apiKey`，创建后无法再次查看完整 key！

#### 步骤 2: 查看所有 API Keys

```bash
curl http://localhost:3000/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN"
```

#### 步骤 3: 删除 API Key

```bash
API_KEY_ID="your-api-key-id"

curl -X DELETE "http://localhost:3000/api/v1/api-keys/$API_KEY_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 测试 SEO Agent API

### 测试 1: 关键词挖掘 (keyword_mining)

```bash
# 使用 JWT Token
TOKEN="YOUR_JWT_TOKEN_OR_API_KEY"

curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mode": "keyword_mining",
    "seedKeyword": "coffee shop",
    "systemInstruction": "Generate high-potential SEO keywords focusing on commercial intent.",
    "targetLanguage": "ko",
    "wordsPerRound": 10,
    "miningStrategy": "horizontal",
    "uiLanguage": "zh",
    "analyzeRanking": true
  }'
```

### 测试 2: 批量翻译分析 (batch_translation)

```bash
curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mode": "batch_translation",
    "keywords": "coffee shop, espresso machine, latte art, cold brew",
    "systemInstruction": "Analyze SEO ranking opportunities for these keywords.",
    "targetLanguage": "ko",
    "uiLanguage": "zh"
  }'
```

### 测试 3: 深度策略 (deep_dive)

```bash
curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mode": "deep_dive",
    "keyword": "coffee shop",
    "targetLanguage": "ko",
    "uiLanguage": "zh"
  }'
```

### 测试 4: 查看 API 文档

直接在浏览器中访问：

```
http://localhost:3000/api/v1/doc
```

或使用 curl:

```bash
curl http://localhost:3000/api/v1/doc
```

---

## 使用测试脚本

我们提供了一个便捷的测试脚本，可以快速测试所有 API 功能。

### 安装依赖

```bash
npm install
```

### 运行测试脚本

```bash
# 设置环境变量
export API_BASE_URL="http://localhost:3000/api/v1"
export JWT_TOKEN="your_jwt_token_here"

# 运行测试
node scripts/test-api.js
```

或者直接编辑 `scripts/test-api.js` 文件，设置你的 token，然后运行。

---

## 常见测试场景

### 场景 1: 测试 Credits 余额不足

```bash
# 先查询余额
curl http://localhost:3000/api/user/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 如果余额不足，会返回 402 错误
curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mode": "keyword_mining",
    "seedKeyword": "test"
  }'
```

### 场景 2: 测试无效认证

```bash
# 不提供 Authorization header
curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "keyword_mining",
    "seedKeyword": "test"
  }'

# 应该返回 401 Unauthorized
```

### 场景 3: 测试 API Key 限制

```bash
# 尝试创建超过限制的 API keys
# Free 套餐只能创建 1 个 API key
# Pro 套餐可以创建 3 个
# Professional 套餐可以创建 10 个

for i in {1..5}; do
  curl -X POST http://localhost:3000/api/v1/api-keys \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"name\": \"Test Key $i\"}"
done
```

---

## 使用 Postman/Thunder Client

### 导入 Collection

1. 打开 Postman/Thunder Client
2. 创建新的 Collection: "SEO Agent API"
3. 设置 Collection 变量:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: `your_jwt_token_or_api_key`

### 请求示例

**创建 API Key:**

- Method: `POST`
- URL: `{{base_url}}/api-keys`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "name": "My API Key",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**关键词挖掘:**

- Method: `POST`
- URL: `{{base_url}}/seo-agent`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "mode": "keyword_mining",
  "seedKeyword": "coffee shop",
  "targetLanguage": "ko",
  "wordsPerRound": 10
}
```

---

## 验证响应

### 成功响应示例

```json
{
  "success": true,
  "mode": "keyword_mining",
  "data": {
    "keywords": [
      {
        "id": "kw-1234567890-0",
        "keyword": "커피숍 프랜차이즈",
        "translation": "咖啡店加盟",
        "intent": "Commercial",
        "volume": 3200,
        "probability": "HIGH",
        "topDomainType": "Niche Site",
        "reasoning": "竞争较弱，蓝海机会"
      }
    ],
    "count": 10,
    "seedKeyword": "coffee shop",
    "targetLanguage": "ko",
    "roundIndex": 1
  }
}
```

### 错误响应示例

**401 Unauthorized:**

```json
{
  "error": "Unauthorized",
  "message": "Authorization required. Please provide Bearer token (JWT) or API key in Authorization header."
}
```

**402 Payment Required:**

```json
{
  "error": "Insufficient credits",
  "message": "This operation requires 20 credits, but you only have 15 credits remaining",
  "required": 20,
  "remaining": 15,
  "rechargeUrl": "https://niche-mining-web.vercel.app/console/pricing"
}
```

**400 Bad Request:**

```json
{
  "error": "Missing required field: mode",
  "message": "Please specify mode: keyword_mining, batch_translation, or deep_dive",
  "supportedModes": ["keyword_mining", "batch_translation", "deep_dive"]
}
```

---

## 调试技巧

### 1. 查看详细日志

在 Vercel 函数日志中查看详细错误信息：

```bash
# Vercel CLI
vercel logs

# 或访问 Vercel Dashboard
# https://vercel.com/dashboard
```

### 2. 测试时跳过 Credits 检查

```json
{
  "mode": "keyword_mining",
  "seedKeyword": "test",
  "skipCreditsCheck": true
}
```

**注意:** 这仅用于测试，生产环境不应使用此选项。

### 3. 验证 API Key 格式

API Key 必须以 `nm_live_` 开头：

```bash
# 正确格式
nm_live_abc123def456...

# 错误格式
api_key_123  # ❌
```

---

## 下一步

- 查看 [API 文档](/api/v1/doc) 了解完整的 API 规范
- 查看 [工作流配置文档](API_DOCUMENTATION.md#工作流配置管理) 了解如何自定义提示词
- 查看 [错误码文档](API_DOCUMENTATION.md#错误码) 了解所有可能的错误

---

## 需要帮助？

如果遇到问题：

1. 检查认证 token 是否有效
2. 检查 Credits 余额是否充足
3. 查看 API 文档确认参数格式
4. 检查 Vercel 函数日志查看详细错误
