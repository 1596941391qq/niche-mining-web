# 为用户设置 Credits

## 用户信息

- **User ID**: `7e23b466-4c18-455a-97fa-cb5290a5000a`
- **Email**: `x1596941391@gmail.com`

## 设置 Credits 的方法

### 方法 1: 使用 curl 命令（推荐）

```bash
curl -X POST https://niche-mining-web.vercel.app/api/test/setup-credits \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "7e23b466-4c18-455a-97fa-cb5290a5000a",
    "plan": "pro",
    "credits": 10000
  }'
```

### 方法 2: 使用 Postman/Thunder Client

- **Method**: POST
- **URL**: `https://niche-mining-web.vercel.app/api/test/setup-credits`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "userId": "7e23b466-4c18-455a-97fa-cb5290a5000a",
  "plan": "pro",
  "credits": 10000
}
```

### 方法 3: 使用浏览器控制台

1. 访问 `https://niche-mining-web.vercel.app`
2. 打开浏览器控制台 (F12)
3. 粘贴并执行以下代码：

```javascript
fetch('https://niche-mining-web.vercel.app/api/test/setup-credits', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: '7e23b466-4c18-455a-97fa-cb5290a5000a',
    plan: 'pro',
    credits: 10000
  })
})
  .then(res => res.json())
  .then(data => console.log('✅ Credits setup:', data))
  .catch(err => console.error('❌ Error:', err));
```

## 成功响应

```json
{
  "success": true,
  "message": "Test credits setup successfully",
  "data": {
    "user": {
      "id": "7e23b466-4c18-455a-97fa-cb5290a5000a",
      "email": "x1596941391@gmail.com",
      "name": "..."
    },
    "subscription": {
      "plan": "pro",
      "status": "active",
      "periodStart": "2025-12-18T...",
      "periodEnd": "2026-01-18T..."
    },
    "credits": {
      "total": 10000,
      "used": 0,
      "remaining": 10000,
      "nextReset": "2026-01-01T00:00:00Z"
    }
  }
}
```

## 验证 Credits 已设置

设置完成后，用户登录控制台应该能看到：

1. **仪表板顶部** - 积分概览卡片：
   - 剩余积分: 10,000
   - 总积分: 10,000
   - 已使用: 0
   - 使用率: 0%

2. **Stats 卡片** - "已用积分" 显示真实数据

3. **当前套餐**: Professional (专业版)

## 可选的 Credits 数量

根据需要选择不同的积分数量：

- 免费测试: `"credits": 1000`
- 标准测试: `"credits": 10000` (推荐)
- 大量测试: `"credits": 50000`
- 无限制: `"credits": 999999`

## 可选的订阅套餐

```json
{
  "plan": "free",      // 免费版 - 2,000 积分/月
  "plan": "pro",       // 专业版 - 50,000 积分/月 (推荐)
  "plan": "enterprise" // 企业版 - 无限积分
}
```

## 已完成的功能

✅ Dashboard 显示真实的 Credits 数据
✅ Dashboard 中文国际化
✅ Credits 自动从 API 获取
✅ 显示订阅套餐信息
✅ 显示使用率和剩余积分

## 下一步

设置完 Credits 后：

1. 刷新控制台页面
2. 查看仪表板应该显示真实的积分数据
3. 可以测试从主应用跳转到子应用
4. 子应用也能查询到这个用户的积分余额
