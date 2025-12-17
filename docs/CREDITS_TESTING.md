# Credits 系统测试指南

## ✅ 已完成的工作

1. ✅ 修复订阅表设计（外键引用users.id）
2. ✅ 在db.ts中添加initSubscriptionTables()函数
3. ✅ 更新init-db API初始化所有表
4. ✅ 创建测试API设置用户credits
5. ✅ 创建API供子应用查询credits
6. ✅ 更新跨项目认证文档

## 📋 部署和测试步骤

### 1. 部署主应用

部署代码到Vercel后，需要初始化数据库表：

```bash
# 访问以下URL初始化数据库
https://niche-mining-web.vercel.app/api/init-db
```

**预期响应**：
```json
{
  "message": "Database initialized successfully",
  "tables": [
    "users",
    "sessions",
    "subscription_plans",
    "user_subscriptions",
    "user_credits",
    "credits_transactions"
  ]
}
```

### 2. 获取测试用户ID

登录主应用后，在浏览器控制台查看用户ID：

```javascript
// 打开浏览器控制台 (F12)
// 查看 localStorage
localStorage.getItem('auth_token')

// 或者查看用户信息
// 访问 https://niche-mining-web.vercel.app/api/auth/session
// 会返回当前用户信息包括 userId
```

### 3. 为测试用户设置Credits

使用curl或Postman调用测试API：

```bash
curl -X POST https://niche-mining-web.vercel.app/api/test/setup-credits \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "你的用户UUID",
    "plan": "pro",
    "credits": 10000
  }'
```

**预期响应**：
```json
{
  "success": true,
  "message": "Test credits setup successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "Test User"
    },
    "subscription": {
      "plan": "pro",
      "status": "active"
    },
    "credits": {
      "total": 10000,
      "used": 0,
      "remaining": 10000
    }
  }
}
```

### 4. 查询用户Credits（主应用）

```bash
# 获取你的JWT token
TOKEN="你的JWT token"

curl https://niche-mining-web.vercel.app/api/user/credits \
  -H "Authorization: Bearer $TOKEN"
```

**预期响应**：
```json
{
  "userId": "uuid",
  "credits": {
    "total": 10000,
    "used": 0,
    "remaining": 10000,
    "bonus": 0
  },
  "subscription": {
    "plan": "pro",
    "planName": "Professional",
    "status": "active",
    "creditsMonthly": 50000
  }
}
```

### 5. 子应用集成测试

子项目部署后，按照 `docs/CROSS_PROJECT_AUTH_IMPLEMENTATION.md` 第三步集成Credits系统。

**测试流程**：

1. 从主应用点击Agent卡片（带transfer token）
2. 子项目自动登录
3. 子项目调用 `/api/user/credits` 查询余额
4. 子项目显示credits信息给用户

**示例代码**（子项目）：

```typescript
// 在子项目的任意组件中
useEffect(() => {
  const fetchCredits = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch('https://niche-mining-web.vercel.app/api/user/credits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User credits:', data.credits);
        // 在UI中显示credits信息
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  fetchCredits();
}, []);
```

## 🔍 验证检查清单

### 主应用
- [ ] `/api/init-db` 成功初始化所有表
- [ ] `/api/test/setup-credits` 成功为测试用户设置credits
- [ ] `/api/user/credits` 能正确返回用户credits信息
- [ ] 数据库中能看到 subscription_plans、user_subscriptions、user_credits 表

### 子应用
- [ ] 从主应用跳转到子应用能自动登录
- [ ] 子应用能成功调用 `/api/user/credits` 查询余额
- [ ] 子应用能在UI中显示用户的credits余额
- [ ] 子应用能检测credits不足并提示用户

## 📊 数据库查询验证

登录Vercel Postgres Dashboard执行以下查询：

```sql
-- 查看订阅套餐
SELECT * FROM subscription_plans;

-- 查看用户订阅状态
SELECT * FROM user_subscriptions;

-- 查看用户credits
SELECT * FROM user_credits;

-- 查看credits交易记录
SELECT * FROM credits_transactions ORDER BY created_at DESC LIMIT 10;

-- 查看完整的用户信息
SELECT
  u.id,
  u.email,
  u.name,
  us.plan_id,
  us.status AS subscription_status,
  uc.total_credits,
  uc.used_credits,
  (uc.total_credits - uc.used_credits) AS remaining_credits
FROM users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN user_credits uc ON u.id = uc.user_id;
```

## 🐛 常见问题

### 问题1: "User not found"
**原因**: 用户ID不存在
**解决**: 先登录主应用创建用户，然后获取正确的用户UUID

### 问题2: Credits返回0
**原因**: 没有调用 `/api/test/setup-credits` 设置credits
**解决**: 使用测试API为用户设置初始credits

### 问题3: 子应用查询credits失败
**原因**: JWT token无效或过期
**解决**: 重新从主应用跳转到子应用获取新token

### 问题4: 外键约束错误
**原因**: 表创建顺序问题
**解决**: 重新访问 `/api/init-db` 初始化所有表

## 📝 下一步工作（可选）

1. 创建 `/api/user/use-credits` API实现credits扣除
2. 在控制台中显示用户的credits余额和使用历史
3. 实现credits不足时的购买流程
4. 添加credits重置的定时任务
5. 创建credits使用统计图表

## 📚 相关文档

- `docs/DATABASE_SCHEMA_SUBSCRIPTION.sql` - 完整的数据库schema
- `docs/CROSS_PROJECT_AUTH_IMPLEMENTATION.md` - 跨项目认证和Credits集成指南
- `api/lib/db.ts` - 数据库初始化函数
- `api/test/setup-credits.ts` - 测试credits设置API
- `api/user/credits.ts` - Credits查询API
