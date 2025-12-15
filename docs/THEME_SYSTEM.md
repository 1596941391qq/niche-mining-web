# 主题系统 (Theme System)

## 概述

控制台现已支持白天/夜间主题切换。

## 功能特性

### 🌙 夜间模式（默认）
- **背景色**: 深灰黑色 (#09090b)
- **表面色**: 深灰色 (#18181b)
- **边框色**: 中灰色 (#27272a)
- **文本色**: 浅灰白色 (#e4e4e7)
- **网格色**: 暗灰色 (#1a1a1d)

### ☀️ 白天模式
- **背景色**: 浅灰白色 (#f8f9fa)
- **表面色**: 纯白色 (#ffffff)
- **边框色**: 浅灰色 (#e5e7eb)
- **文本色**: 深灰黑色 (#1f2937)
- **网格色**: 浅灰色 (#e5e7eb)

## 使用方法

### 在组件中使用主题

```typescript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '切换到白天模式' : '切换到夜间模式'}
    </button>
  );
};
```

### 主题切换按钮位置

- **桌面端**: 侧边栏底部，语言切换按钮上方
- **移动端**: 移动侧边栏底部，语言切换按钮上方

### 持久化

主题选择会自动保存到 `localStorage`，刷新页面后保持用户选择。

## 技术实现

### CSS 变量系统

使用 CSS 变量实现主题切换，在 `index.html` 中定义：

```css
:root {
  --color-background: #09090b;
  --color-surface: #18181b;
  --color-border: #27272a;
  --color-text-primary: #e4e4e7;
  --color-text-secondary: #a1a1aa;
  --color-text-tertiary: #71717a;
  --grid-color: #1a1a1d;
  --grid-alpha: rgba(26, 26, 29, 0.5);
}

html.light {
  --color-background: #f8f9fa;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --grid-color: #e5e7eb;
  --grid-alpha: rgba(229, 231, 235, 0.6);
}
```

### Tailwind 配置

CSS 变量被映射到 Tailwind 颜色：

```javascript
colors: {
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
  // ...
}
```

### React Context

ThemeContext 提供全局主题状态管理：

- `theme`: 当前主题 ('dark' | 'light')
- `toggleTheme()`: 切换主题函数

## 自动适配

所有使用以下 Tailwind 类的组件会自动适配主题：

- `bg-background` - 背景色
- `bg-surface` - 表面色
- `border-border` - 边框色
- `text-white` / `text-zinc-*` - 文本颜色（在白天模式下自动反转）

## 扩展主题

如需添加新的主题颜色变量：

1. 在 `index.html` 的 `:root` 和 `html.light` 中定义变量
2. 在 Tailwind 配置中映射该变量
3. 在组件中使用对应的 Tailwind 类

## 注意事项

- 主题切换是即时的，无需刷新页面
- 网格背景会根据主题自动调整颜色
- 所有边框、阴影、文本颜色都会自动适配
- 主 brand 颜色（primary green #10b981）在两种主题下保持一致
