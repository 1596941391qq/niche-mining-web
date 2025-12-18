# 子项目 Credits 集成指南

## 🎯 目标

让子项目能够查询和显示用户的 Credits 余额。

---

## 📦 第一步：确认已有内容

你的子项目应该已经完成了跨项目登录（从主应用跳转过来能自动登录）。

确认你的 `localStorage` 中有 `auth_token`：

```javascript
// 浏览器控制台执行
localStorage.getItem('auth_token')
// 应该返回一个 JWT token
```

---

## 💰 第二步：创建 Credits 查询函数

在子项目中创建一个工具函数：

**文件**: `utils/credits.ts` (或 `utils/credits.js`)

```typescript
export async function getUserCredits() {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    console.error('No auth token found');
    return null;
  }

  try {
    const response = await fetch('https://niche-mining-web.vercel.app/api/user/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch credits');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching credits:', error);
    return null;
  }
}
```

---

## 📊 第三步：在组件中使用

在你的任意 React 组件中使用（比如顶部导航栏）：

```tsx
import { useState, useEffect } from 'react';
import { getUserCredits } from './utils/credits';

export default function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      const data = await getUserCredits();
      if (data && data.credits) {
        setCredits(data.credits.remaining);
      }
      setLoading(false);
    };

    fetchCredits();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (credits === null) {
    return <div>Credits: --</div>;
  }

  return (
    <div className="credits-badge">
      <span>💎 Credits: {credits.toLocaleString()}</span>
    </div>
  );
}
```

---

## 🎨 示例：在导航栏显示

```tsx
import CreditsDisplay from './CreditsDisplay';

export default function Navbar() {
  return (
    <nav>
      <div className="logo">Your App</div>
      <div className="user-info">
        <CreditsDisplay />
        <UserMenu />
      </div>
    </nav>
  );
}
```

---

## 🧪 测试

1. **确认登录状态**：从主应用跳转到子项目，应该自动登录
2. **打开浏览器控制台**：应该能看到 Credits 数据被请求
3. **查看UI**：应该显示 Credits 余额

---

## 📝 返回的数据格式

```json
{
  "userId": "uuid",
  "credits": {
    "total": 10000,
    "used": 1500,
    "remaining": 8500,
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

**你需要的字段**：
- `data.credits.remaining` - 剩余 Credits
- `data.credits.total` - 总 Credits
- `data.subscription.plan` - 订阅计划

---

## ⚠️ 常见问题

### 问题1: 返回 401 Unauthorized

**原因**: Token 无效或过期

**解决**:
```typescript
// 重新从主应用跳转到子项目
// 或者检查 localStorage.getItem('auth_token') 是否存在
```

### 问题2: 返回 credits 为 null

**原因**: 用户没有设置 Credits

**解决**: 告诉用户联系管理员，或者在测试环境使用测试 API 设置 Credits

### 问题3: CORS 错误

**原因**: 本地开发时的跨域问题

**解决**:
- 生产环境不会有这个问题
- 或者在 fetch 中添加 `mode: 'cors'`

---

## 🚀 就这么简单！

完成以上三步，你的子项目就能显示用户的 Credits 了。

如有问题，联系主项目负责人。
