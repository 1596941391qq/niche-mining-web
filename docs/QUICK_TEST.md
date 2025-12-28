# 快速测试指南

## 🚀 快速开始

### 1. 获取认证 Token

**方法 A: 使用开发用户（本地）**
```bash
curl http://localhost:3000/api/test/init-dev-user
```
复制返回的 `token` 字段。

**方法 B: 创建 API Key**
```bash
# 先获取 JWT token（方法 A），然后创建 API Key
TOKEN="your_jwt_token"

curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Test Key"}'
```

### 2. 测试 API

**使用 curl:**
```bash
# 设置 token
TOKEN="your_token_or_api_key"

# 测试关键词挖掘
curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mode": "keyword_mining",
    "seedKeyword": "coffee shop",
    "targetLanguage": "ko",
    "wordsPerRound": 5,
    "skipCreditsCheck": true
  }'
```

**使用测试脚本:**
```bash
# 设置环境变量
export JWT_TOKEN="your_token_here"

# 运行测试
node scripts/test-api.js
```

### 3. 查看文档

浏览器访问:
```
http://localhost:3000/api/v1/doc
```

---

## 📝 完整测试示例

### 创建 API Key 并测试

```bash
# 1. 获取开发用户 token
DEV_TOKEN=$(curl -s http://localhost:3000/api/test/init-dev-user | jq -r '.token')

# 2. 创建 API Key
API_KEY_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name": "Test Key"}')

API_KEY=$(echo $API_KEY_RESPONSE | jq -r '.data.apiKey')
echo "API Key: $API_KEY"

# 3. 使用 API Key 测试
curl -X POST http://localhost:3000/api/v1/seo-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "mode": "keyword_mining",
    "seedKeyword": "test",
    "wordsPerRound": 3,
    "skipCreditsCheck": true
  }'
```

---

## 🔍 常见问题

**Q: 如何跳过 Credits 检查？**
A: 在请求体中添加 `"skipCreditsCheck": true`（仅用于测试）

**Q: Token 在哪里获取？**
A: 
- 本地开发: `http://localhost:3000/api/test/init-dev-user`
- 生产环境: 登录后从 localStorage 获取

**Q: API Key 格式是什么？**
A: 必须以 `nm_live_` 开头，例如: `nm_live_abc123def456...`

**Q: 如何查看所有 API Keys？**
A: 
```bash
curl http://localhost:3000/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN"
```

---

更多详细信息请查看 [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

