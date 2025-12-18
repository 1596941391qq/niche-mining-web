# 挖掘模式定价系统 - 使用指南

## 🎯 功能概述

现在系统支持三种挖掘模式，每种模式有不同的定价：

| 模式 | 英文名称 | Credits消耗 | 说明 |
|------|----------|------------|------|
| 关键词挖掘 | Keyword Mining | 20 | 发现高潜力的利基关键词 |
| 批量翻译 | Batch Translation | 20 | 将关键词批量翻译成多种语言 |
| 深度挖掘 | Deep Mining | 30 | 深度分析，包含竞争情报和趋势预测 |

---

## 🚀 初始化步骤

### 1. 初始化定价表

访问：
```
http://localhost:3000/api/init-pricing
```

这会创建 `mining_modes` 表并插入三种模式的定价信息。

**成功响应**：
```json
{
  "success": true,
  "message": "Mining modes pricing table initialized successfully",
  "modes": [
    { "mode": "keyword_mining", "credits": 20 },
    { "mode": "batch_translation", "credits": 20 },
    { "mode": "deep_mining", "credits": 30 }
  ]
}
```

### 2. 初始化开发用户

访问：
```
http://localhost:3000/api/test/init-dev-user
```

这会创建开发测试用户并设置初始credits。

### 3. 访问Dashboard

```
http://localhost:3000/console
```

---

## 📊 Dashboard 新增功能

### 1. Credits 概览（已修复显示问题）
- 剩余积分
- 总积分
- 已使用积分
- 使用率百分比

### 2. 模式统计卡片

显示每种模式的：
- 使用次数
- 总消耗 Credits

### 3. 最近7天花费柱状图

- 彩色堆叠柱状图
- 按模式分类显示
- 鼠标悬停显示详细数据
- 颜色图例：
  - 🔵 蓝色 = 关键词挖掘
  - 🟢 绿色 = 批量翻译
  - 🟣 紫色 = 深度挖掘

---

## 🛠️ 模式说明页面

在Console中添加了"挖掘模式"页面，显示：

### 每个模式的详细信息
- 名称和描述
- 每次使用消耗的 Credits
- 完整工作流程（参考首页）
- AI 模型：gemini-3.0-flash
- 数据来源：SE Ranking
- 使用统计

### 工作流示例

#### 关键词挖掘 (20 Credits)
```
1. Input seed keyword
2. SE Ranking API fetches related keywords
3. Gemini-3.0-Flash analyzes search intent & competition
4. Generate keyword cluster with metrics
```

#### 批量翻译 (20 Credits)
```
1. Upload keyword list
2. Select target languages
3. Gemini-3.0-Flash translates with context awareness
4. Export localized keyword sets
```

#### 深度挖掘 (30 Credits)
```
1. Input topic/niche
2. SE Ranking crawls SERP data
3. Gemini-3.0-Flash analyzes competitor strategies
4. Extract content gaps
5. Generate actionable insights with trending opportunities
```

---

## 🧪 测试功能

### 使用开发者工具模拟API调用

1. 点击Dashboard右下角的黄色扳手按钮
2. 点击"模拟API调用"
3. 系统会随机选择一种模式并消耗对应的Credits：
   - 关键词挖掘：-20 Credits
   - 批量翻译：-20 Credits
   - 深度挖掘：-30 Credits

### 查看实时更新

模拟调用后，Dashboard会自动刷新显示：
- ✅ 更新Credits余额
- ✅ 更新模式统计
- ✅ 更新7天柱状图
- ✅ 添加最近活动记录

---

## 🗄️ 数据库结构

### mining_modes 表

```sql
CREATE TABLE mining_modes (
  id SERIAL PRIMARY KEY,
  mode_id VARCHAR(50) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_cn VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_cn TEXT,
  workflow_en TEXT,
  workflow_cn TEXT,
  credits_per_use INT NOT NULL,
  ai_model VARCHAR(100) DEFAULT 'gemini-3.0-flash',
  data_source VARCHAR(100) DEFAULT 'SE Ranking',
  is_active BOOLEAN DEFAULT TRUE
);
```

### credits_transactions 表（新增字段）

```sql
ALTER TABLE credits_transactions ADD COLUMN mode_id VARCHAR(50);
```

---

## 🎨 UI 特性

### 模式统计卡片
- 3列网格布局（响应式）
- 高亮显示模式名称
- 显示使用次数和总消耗
- 主题色调：primary/5

### 7天柱状图
- 堆叠柱状图显示不同模式
- 鼠标悬停显示详细tooltip
- 自动填充缺失日期（显示为0）
- 图例说明各颜色含义

### 模式详情Modal
- 点击模式卡片打开
- 显示完整工作流程
- 技术细节（AI模型、数据来源）
- 使用统计

---

## 📝 API 端点

### 获取模式统计

```bash
GET /api/stats/mining-modes
Headers: Authorization: Bearer <token>
```

**响应**：
```json
{
  "modes": [
    {
      "modeId": "keyword_mining",
      "nameEn": "Keyword Mining",
      "nameCn": "关键词挖掘",
      "creditsPerUse": 20,
      "workflowEn": "...",
      "aiModel": "gemini-3.0-flash",
      "dataSource": "SE Ranking",
      "stats": {
        "usageCount": 5,
        "totalCredits": 100
      }
    }
  ],
  "dailyStats": [...]
}
```

### 消费Credits（支持模式）

```bash
POST /api/credits/consume
Headers: Authorization: Bearer <token>
Body: {
  "credits": 20,
  "description": "Keyword Mining",
  "modeId": "keyword_mining"
}
```

---

## ✅ 完成清单

- [x] 创建 mining_modes 定价表
- [x] 为 credits_transactions 添加 mode_id 字段
- [x] 创建模式统计 API
- [x] 创建 MiningModes 组件
- [x] 修复 Dashboard Credits 显示问题
- [x] 添加模式统计卡片到 Dashboard
- [x] 添加7天花费柱状图
- [x] 更新 DevTools 支持模式模拟
- [x] 添加完整工作流说明
- [x] 集成 gemini-3.0-flash 和 SE Ranking 信息

---

## 🎉 使用效果

1. **真实数据驱动**：所有统计都来自真实的数据库查询
2. **按模式分类**：清晰展示不同模式的使用情况
3. **可视化图表**：7天柱状图直观显示花费趋势
4. **详细说明**：工作流、AI模型、数据来源增强可信度
5. **实时更新**：模拟调用后立即看到数据变化

现在可以开始测试了！🚀
