# 本地开发模式 - 真实用户测试

## 🎯 核心改进

现在本地开发环境使用**真实的数据库用户**和**真实的JWT token**，完全模拟线上环境！

### ✅ 为什么这样做？

1. **真实性**: 开发用户真实存在于数据库中
2. **一致性**: 本地和线上使用完全相同的认证流程
3. **可测试性**: 可以测试跨应用的真实token传递
4. **安全性**: 使用真实JWT token，而不是硬编码的假token

---

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm run dev:vercel
```

### 2. 访问应用

```
http://localhost:3000
```

### 3. 自动初始化

首次访问时，系统会自动：
1. ✅ 在数据库创建开发测试用户
2. ✅ 生成真实的JWT token
3. ✅ 保存token到localStorage
4. ✅ 自动"登录"

**完全无需手动操作！**

---

## 📊 开发用户信息

数据库中的真实用户：

```json
{
  "id": "由数据库自动生成的UUID",
  "email": "dev@local.test",
  "name": "本地开发测试用户",
  "googleId": "dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION"
}
```

**重要说明**：
- 开发用户通过 `google_id` 标识，而不是固定的UUID
- UUID由数据库自动生成，首次初始化时创建
- 不会覆盖或影响任何真实用户数据

默认配置：
- **订阅套餐**: Professional (pro)
- **Credits**: 10,000
- **状态**: Active

---

## 🔐 认证流程（本地 vs 线上）

### 线上环境

```
用户点击登录
  → Google OAuth
  → 回调处理
  → 创建/查找用户
  → 生成JWT token
  → 返回token
```

### 本地环境（自动化）

```
页面加载
  → 检测localhost
  → 调用 /api/test/init-dev-user
  → 创建/查找开发用户
  → 生成JWT token
  → 自动保存到localStorage
  → 刷新会话
```

**结果**: 使用完全相同的JWT token格式和验证逻辑！

---

## 🧪 测试跨应用认证

现在可以真实测试主应用→子应用的token传递！

### 场景：从主应用跳转到子应用

#### 1. 主应用（localhost:3000）

```javascript
// 生成transfer token
const response = await fetch('/api/auth/transfer-token', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
});

const { transferToken } = await response.json();

// 跳转到子应用
window.location.href = `http://localhost:3001?tt=${transferToken}`;
```

#### 2. 子应用（localhost:3001）

```javascript
// 获取transfer token
const urlParams = new URLSearchParams(window.location.search);
const tt = urlParams.get('tt');

// 验证并获取真实token
const response = await fetch('http://localhost:3000/api/auth/verify-transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transferToken: tt })
});

const { token } = await response.json();

// 保存token
localStorage.setItem('auth_token', token);

// 使用token查询credits
const creditsResponse = await fetch('http://localhost:3000/api/user/credits', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const creditsData = await creditsResponse.json();
console.log('Credits:', creditsData.credits.remaining);
```

**完全模拟真实环境！**

---

## 🛠️ 开发者工具

Dashboard右下角的黄色扳手按钮提供快捷操作：

| 功能 | 说明 |
|------|------|
| +1000 / +100 | 增加credits |
| -1000 / -100 | 减少credits |
| 模拟API调用 | 生成真实的活动记录 |
| 重置为10,000 | 恢复初始状态 |

所有操作都是**真实的数据库更新**，不是模拟！

---

## 🔍 验证真实性

### 1. 检查数据库

```sql
-- 查看开发用户（通过google_id查找）
SELECT * FROM users
WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION';

-- 查看订阅
SELECT * FROM user_subscriptions
WHERE user_id IN (
  SELECT id FROM users
  WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'
);

-- 查看credits
SELECT * FROM user_credits
WHERE user_id IN (
  SELECT id FROM users
  WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'
);

-- 查看交易记录
SELECT * FROM credits_transactions
WHERE user_id IN (
  SELECT id FROM users
  WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'
)
ORDER BY created_at DESC
LIMIT 10;
```

### 2. 验证JWT token

打开浏览器控制台：

```javascript
// 获取token
const token = localStorage.getItem('auth_token');

// 解码JWT (只是查看，不验证签名)
const [header, payload] = token.split('.');
const decoded = JSON.parse(atob(payload));

console.log('Token payload:', decoded);
// {
//   "userId": "7e23b466-4c18-455a-97fa-cb5290a5000a",
//   "email": "dev@local.test",
//   "iat": 1234567890,
//   "exp": 1234654290
// }
```

### 3. 测试API调用

```bash
# 获取token
TOKEN=$(node -e "console.log(JSON.parse(require('fs').readFileSync('${HOME}/.local-dev-token', 'utf8')).token)")

# 或者从浏览器控制台复制

# 测试credits API
curl http://localhost:3000/api/user/credits \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 测试dashboard API
curl http://localhost:3000/api/user/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 重新初始化

如果需要重新初始化开发用户（例如数据损坏）：

### 方法1: 清除localStorage

```javascript
localStorage.clear();
location.reload();
```

页面刷新后会自动重新初始化。

### 方法2: 手动调用API

```bash
curl http://localhost:3000/api/test/init-dev-user
```

复制返回的token并保存到localStorage。

### 方法3: 删除并重建

```sql
-- 删除开发用户数据（安全：只删除开发用户）
DELETE FROM credits_transactions
WHERE user_id IN (
  SELECT id FROM users
  WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'
);

DELETE FROM user_credits
WHERE user_id IN (
  SELECT id FROM users
  WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'
);

DELETE FROM user_subscriptions
WHERE user_id IN (
  SELECT id FROM users
  WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION'
);

DELETE FROM users
WHERE google_id = 'dev_google_id_local_only_DO_NOT_USE_IN_PRODUCTION';
```

然后刷新页面，自动重建。

---

## 🚫 生产环境安全

所有开发相关的API都有环境检查：

```typescript
if (process.env.NODE_ENV === 'production') {
  return res.status(403).json({
    error: 'This endpoint is disabled in production'
  });
}
```

禁用的端点：
- `/api/test/init-dev-user`
- `/api/test/adjust-credits`
- `/api/test/setup-credits`

开发者工具面板在生产环境不会显示。

---

## ✅ 优势总结

| 对比项 | 假token模式 | 真实用户模式 |
|-------|------------|-------------|
| 数据库用户 | ❌ 不存在 | ✅ 真实存在 |
| JWT验证 | ❌ 硬编码绕过 | ✅ 真��验证 |
| Credits数据 | ❌ 模拟 | ✅ 数据库查询 |
| 跨应用测试 | ❌ 无法测试 | ✅ 完全一致 |
| 与线上一致性 | ❌ 不一致 | ✅ 100%一致 |

---

## 🎊 现在可以做什么？

1. ✅ 测试真实的Dashboard数据显示
2. ✅ 测试真实的Credits增减
3. ✅ 测试真实的API调用记录
4. ✅ 测试跨应用token传递（主应用→子应用）
5. ✅ 测试子应用查询credits
6. ✅ 完全模拟生产环境的认证流程

**这才是真正的本地开发体验！** 🚀
