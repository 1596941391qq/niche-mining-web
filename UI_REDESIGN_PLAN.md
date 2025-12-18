# UI 改造计划 - toUI 设计系统复刻

## 📋 设计分析总结

### 1. 核心设计特征

#### 配色方案
```css
--bg-main: #050505        /* 主背景 - 极深黑 */
--bg-surface: #0a0a0a     /* 卡片/模块背景 */
--bg-module: #0d0d0d      /* 模块头部背景 */
--primary: #10B981        /* 主色调 - emerald-500 */
--border: #1a1a1a         /* 边框颜色 */
--text-primary: #ffffff   /* 主文本 - 白色 */
--text-secondary: #9ca3af /* 次要文本 - gray-400 */
--text-tertiary: #6b7280  /* 三级文本 - gray-500 */
--text-dim: #4b5563       /* 暗文本 - gray-600 */
```

#### 字体系统
- **主字体**: Inter (sans-serif) - 用于正文
- **等宽字体**: JetBrains Mono - 用于代码、标签、数据
- **字号规范**:
  - 页面标题: 20px (text-xl)
  - 模块标题: 18px (text-lg)
  - 正文: 14px (text-sm)
  - 小标签: 12px (text-xs)
  - 超小标签: 10px, 9px

#### 视觉效果
1. **网格背景**:
   - 40px x 40px 网格
   - emerald绿色半透明 (rgba(16, 185, 129, 0.05))

2. **扫描线动���**:
   - 100px高度的渐变条
   - 8秒循环从上到下扫描
   - emerald绿色半透明发光

3. **悬停效果**:
   - border颜色变为 emerald/30
   - 底部进度条动画 (700ms)

4. **圆角**: 几乎无圆角 (rounded-sm = 2px)

---

## 🎯 改造任务清单

### 任务 1: 创建 TerminalWidget 通用组件

**文件**: `components/ui/TerminalWidget.tsx`

**功能**:
- 终端风格容器组件
- 顶部有三个状态灯（红黄绿）
- 模块标题栏显示 "sys_module // {title}"
- 可选的图标
- 悬停时底部绿色进度条动画
- 悬停时边框变emerald色

**代码结构**:
```tsx
interface TerminalWidgetProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
```

---

### 任务 2: 更新全局 CSS 样式

**文件**: `index.css` 或创建 `styles/terminal.css`

**需要添加**:
1. **新CSS变量** (emerald主题)
2. **网格背景样式** (.grid-bg)
3. **扫描线动画** (.scanline + @keyframes)
4. **滚动条样式** (深色主题，hover时emerald色)
5. **字体导入** (JetBrains Mono from Google Fonts)
6. **选择文本样式** (emerald背景)

---

### 任务 3: 改造 Sidebar 组件

**文件**: `components/Console.tsx` 中的 Sidebar 部分

**改动点**:
1. **Logo区域**:
   - emerald方形背景，黑色采矿图标
   - 标题 "NICHE MINING"
   - 副标题 "BLUE OCEAN PROTOCOL" (emerald色)

2. **用户信息卡片**:
   - 深黑背景 (#0a0a0a)
   - 方形头像容器
   - emerald脉冲状态点
   - "专业版: 有效" 状态文本

3. **导航按钮**:
   - 激活态: emerald/10背景 + emerald边框 + 左侧emerald竖条
   - 未激活态: gray-400文本 + hover效果
   - 全部使用rounded-sm

4. **底部工具栏**:
   - 3个小按钮 (首页、语言、主题)
   - grid-cols-3布局
   - 每个按钮有图标 + 8px小标签
   - 深黑背景 + emerald hover效果

5. **Footer统计信息**:
   - 9px monospace字体
   - UPTIME / NODES / VERSION
   - emerald-900数值颜色

---

### 任务 4: 改造 Console 主布局

**文件**: `components/Console.tsx`

**改动点**:
1. **背景颜色**: #050505
2. **网格背景**: 添加 .grid-bg 类到根div
3. **扫描线**: 添加 .scanline div

4. **Header 头部**:
   - 高度: 64px (h-16)
   - 毛玻璃效果: backdrop-blur-md
   - 左侧: 页面标题 + 版本标签
   - 右侧: "SYSTEM_ONLINE // STABLE" 状态指示器
     - emerald圆点 + 阴影发光
     - emerald边框

5. **Footer 底部**:
   - 终端命令行风格
   - "root@miner:~#" + 闪烁光标
   - 右侧: LATENCY / SECURE_PROTOCOL状态

---

### 任务 5: 改造 Dashboard 页面

**文件**: `components/console/ConsoleDashboard.tsx`

**布局结构**:
```
1. TerminalWidget: 积分概览
   - 4格统计: 剩余/总/已使用/成功率
   - 每格: #050505背景 + emerald数值 + 小标签

2. 两列布局:
   左侧(xl:col-span-2): TerminalWidget: 最近7天花费
     - ActivityChart组件 (Area图表)

   右侧(xl:col-span-1): TerminalWidget: 系统日志
     - 4条日志记录
     - 高价值挖掘机会卡片

3. 三列卡片:
   - 关键词挖掘 / AI内容生成 / 代理网络
   - 每个卡片有emerald边框 + hover放大
```

**需要新建**: `components/console/ActivityChart.tsx`
- 使用recharts库
- Area图表，3条线（关键词/翻译/深度）
- 自定义Tooltip样式

---

### 任务 6: 改造 Mining Modes 页面

**文件**: `components/console/MiningModes.tsx`

**改动点**:
1. 使用 TerminalWidget 包裹整个内容
2. 每个模式卡片:
   - #0a0a0a背景
   - emerald/blue/purple边框（根据模式）
   - hover时scale-102
   - 底部 "启动任务" + 箭头图标

---

## 🔧 技术实现细节

### TerminalWidget 组件实现
```tsx
<div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden group hover:border-[#10B981]/30">
  {/* Header: 三个点 + 标题 */}
  <div className="px-4 py-2 bg-[#0d0d0d] border-b border-[#1a1a1a]">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-red-500/50" />
      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
      <div className="w-2 h-2 rounded-full bg-green-500/50" />
    </div>
    <span className="text-[10px] font-mono text-gray-500">sys_module // {title}</span>
  </div>

  {/* Content */}
  <div className="p-4">{children}</div>

  {/* Footer progress bar */}
  <div className="h-[2px] bg-[#1a1a1a] relative">
    <div className="absolute top-0 left-0 h-full w-0 group-hover:w-full bg-[#10B981] transition-all duration-700" />
  </div>
</div>
```

### 网格背景 CSS
```css
.grid-bg {
  background-image:
    linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### 扫描线动画 CSS
```css
.scanline {
  width: 100%;
  height: 100px;
  background: linear-gradient(0deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(16, 185, 129, 0.02) 50%,
    rgba(0, 0, 0, 0) 100%);
  opacity: 0.1;
  position: absolute;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  from { bottom: 100%; }
  to { bottom: -100px; }
}
```

---

## 📦 所需依赖

需要确保已安装:
```bash
npm install recharts
# recharts用于图表组件
```

---

## 🚀 实施顺序

1. ✅ **创建计划文档** (本文件)
2. ⏳ 创建 TerminalWidget 组件
3. ⏳ 更新全局CSS样式
4. ⏳ 改造 Sidebar
5. ⏳ 改造 Console 主布局
6. ⏳ 改造 Dashboard 页面
7. ⏳ 改造 Mining Modes 页面
8. ⏳ 测试所有响应式布局

---

## ⚠️ 注意事项

1. **不修改任何功能逻辑** - 只改UI外观
2. **保留现有的国际化** - 所有文本仍使用lang判断
3. **保持响应式设计** - 移动端布局需要适配
4. **保留现有hooks** - useAuth, useTheme等不变
5. **CSS变量兼容** - 新样式可以覆盖旧的CSS变量
6. **图标库** - 继续使用lucide-react
7. **不修改API调用** - 所有数据获取逻辑保持不变

---

## 🎨 颜色对照表

| toUI颜色           | Tailwind类名           | 十六进制   | 用途                 |
|-------------------|------------------------|-----------|---------------------|
| bg-main           | bg-[#050505]           | #050505   | 主背景              |
| bg-surface        | bg-[#0a0a0a]           | #0a0a0a   | 卡片背景            |
| bg-module-header  | bg-[#0d0d0d]           | #0d0d0d   | 模块头部            |
| primary           | bg-emerald-500         | #10B981   | 主色调/强调色       |
| border-default    | border-[#1a1a1a]       | #1a1a1a   | 默认边框            |
| text-white        | text-white             | #ffffff   | 主文本              |
| text-secondary    | text-gray-400          | #9ca3af   | 次要文本            |
| text-tertiary     | text-gray-500          | #6b7280   | 三级文本            |
| text-dim          | text-gray-600          | #4b5563   | 暗文本              |
| text-dimmer       | text-gray-700          | #374151   | 更暗文本            |
| emerald-dark      | text-emerald-900       | #064e3b   | emerald暗色数据     |

---

## ✨ 完成标准

改造完成后，UI应该:
- ✅ 配色完全匹配toUI（emerald主色调 + 极深黑背景）
- ✅ 所有主要页面使用TerminalWidget包裹
- ✅ 网格背景和扫描线动画正常运行
- ✅ Sidebar样式完全匹配（logo、用户卡片、导航、底部工具栏）
- ✅ Header和Footer终端风格呈现
- ✅ Dashboard的4格统计、图表、日志完全匹配
- ✅ 悬停动画流畅（边框变色、底部进度条）
- ✅ 移动端响应式布局正常
- ✅ 所有功能正常工作（不影响业务逻辑）
