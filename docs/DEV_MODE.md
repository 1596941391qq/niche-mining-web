# 本地开发模式使用指南

## 🔧 自动登录功能

为了方便本地开发和UI测试，项目已启用**开发模式自动登录**功能。

### 工作原理

当你在本地环境（`localhost` 或 `127.0.0.1`）运行项目时，系统会自动以测试用户身份登录，无需真实的 Google OAuth 验证。

### 测试用户信息

```json
{
  "id": "dev_user_123",
  "email": "dev@localhost",
  "name": "开发测试用户",
  "picture": null
}
```

### 使用步骤

1. **启动本地开发服务器**:
   ```bash
   npm run dev
   ```

2. **访问应用**:
   ```
   http://localhost:3000
   ```

3. **自动登录确认**:
   - 打开浏览器控制台（F12）
   - 查看是否有以下日志：
     ```
     🔧 Development Mode: Auto-login enabled
     ```

4. **访问控制台**:
   - 直接访问: `http://localhost:3000/#console`
   - 或点击导航栏右上角的 "Console" 按钮

### 查看UI改动

访问控制台后，你可以查看以下改动：

#### 1. **Precision Industrial 美学**
- 所有圆角已移除（锐利边框）
- 全局网格背景
- 工业风格角标记
- 等宽数据字体

#### 2. **新配色方案**
- **Safety Orange** (#FF6B35) - 强调色
- **Electric Green** (#00FF41) - 状态指示
- **Warning Yellow** (#FFD23F) - 警告

#### 3. **控制台页面**
- 仪表板（Dashboard）
- Agents 页面（可跳转到子项目）
- API 密钥管理
- 订阅套餐（已整合 Credits 显示）
- 团队管理
- 设置

#### 4. **中英文切换**
- 侧边栏底部有语言切换按钮
- 所有界面支持中英文

### 生产环境行为

在生产环境（非 localhost），开发模式会自动禁用，系统会要求真实的 Google OAuth 登录。

### 禁用开发模式

如果你想在本地测试真实的 OAuth 登录流程，可以临时修改 `contexts/AuthContext.tsx`:

```typescript
// 找到这一行
const isDevelopment = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// 改为
const isDevelopment = false; // 强制禁用开发模式
```

### 注意事项

- ⚠️ 开发模式仅在本地环境生效
- ⚠️ 不要将开发模式代码部署到生产环境（代码已做环境判断）
- ⚠️ 测试用户数据不会保存到数据库

---

**Happy Coding! 🚀**
