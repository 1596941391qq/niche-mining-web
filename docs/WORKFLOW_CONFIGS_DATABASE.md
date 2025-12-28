# Workflow Configs 数据库表结构和使用指南

## 表结构

### `workflow_configs` 表

```sql
CREATE TABLE IF NOT EXISTS workflow_configs (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL,
  workflow_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_workflow_configs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 字段说明

| 字段名        | 类型         | 说明                                                     | 示例                                   |
| ------------- | ------------ | -------------------------------------------------------- | -------------------------------------- |
| `id`          | VARCHAR(255) | 主键，配置的唯一标识符                                   | `mining-1704067200000-abc123xyz`       |
| `user_id`     | UUID         | 用户 ID，外键关联 `users` 表                             | `550e8400-e29b-41d4-a716-446655440000` |
| `workflow_id` | VARCHAR(50)  | 工作流 ID，必须是以下之一：`mining`, `batch`, `deepDive` | `mining`                               |
| `name`        | VARCHAR(255) | 用户定义的配置名称                                       | `我的 SEO 挖掘配置`                    |
| `nodes`       | JSONB        | 节点配置数组（JSON 格式）                                | 见下方示例                             |
| `created_at`  | TIMESTAMP    | 创建时间                                                 | `2024-01-01 12:00:00`                  |
| `updated_at`  | TIMESTAMP    | 更新时间                                                 | `2024-01-01 12:00:00`                  |

### 索引

- `idx_workflow_configs_user_id` - 用户 ID 索引
- `idx_workflow_configs_workflow_id` - 工作流 ID 索引
- `idx_workflow_configs_user_workflow` - 用户 ID + 工作流 ID 联合索引

## Nodes 字段存储格式

`nodes` 字段存储的是 `WorkflowNode[]` 数组的 JSON 格式。每个节点的结构如下：

```typescript
interface WorkflowNode {
  id: string; // 节点 ID，如 "mining-gen"
  type: "agent" | "tool"; // 节点类型
  name: string; // 节点显示名称
  description?: string; // 节点描述
  configurable?: boolean; // 是否可配置
  prompt?: string; // 自定义提示词（仅 agent 类型）
  defaultPrompt?: string; // 默认提示词（仅 agent 类型）
  isSystem?: boolean; // 是否为系统工具
}
```

### 示例 JSON

```json
[
  {
    "id": "mining-gen",
    "type": "agent",
    "name": "Keyword Generation Agent",
    "description": "Generates high-potential keywords",
    "configurable": true,
    "prompt": "你是一个SEO关键词专家。专注于生成高商业价值的关键词...",
    "defaultPrompt": "Generate high-potential SEO keywords focusing on commercial intent."
  },
  {
    "id": "mining-analyze",
    "type": "agent",
    "name": "SERP Analysis Agent",
    "description": "Analyzes SEO ranking opportunities",
    "configurable": true,
    "prompt": "分析SERP竞争情况，重点关注蓝海机会...",
    "defaultPrompt": "Analyze SEO ranking opportunities for these keywords."
  }
]
```

## API 端点

子应用可以通过以下 API 端点操作工作流配置：

### 1. 创建配置

**POST** `/api/v1/workflow-configs`

**请求头：**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**请求体：**

```json
{
  "workflowId": "mining",
  "name": "我的自定义配置",
  "nodes": [
    {
      "id": "mining-gen",
      "type": "agent",
      "name": "Keyword Generation Agent",
      "prompt": "自定义提示词...",
      "defaultPrompt": "默认提示词..."
    }
  ]
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "id": "mining-1704067200000-abc123",
    "workflowId": "mining",
    "name": "我的自定义配置",
    "createdAt": 1704067200000,
    "updatedAt": 1704067200000,
    "nodes": [...]
  }
}
```

### 2. 获取配置列表

**GET** `/api/v1/workflow-configs?workflowId=mining`

**请求头：**

```
Authorization: Bearer <JWT_TOKEN>
```

**响应：**

```json
{
  "success": true,
  "data": [
    {
      "id": "mining-1704067200000-abc123",
      "workflowId": "mining",
      "name": "我的自定义配置",
      "createdAt": 1704067200000,
      "updatedAt": 1704067200000,
      "nodes": [...]
    }
  ],
  "count": 1
}
```

### 3. 获取单个配置

**GET** `/api/v1/workflow-configs/:id`

**请求头：**

```
Authorization: Bearer <JWT_TOKEN>
```

### 4. 更新配置

**PUT** `/api/v1/workflow-configs/:id`

**请求头：**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**请求体：**

```json
{
  "name": "更新后的名称",
  "nodes": [...]
}
```

### 5. 删除配置

**DELETE** `/api/v1/workflow-configs/:id`

**请求头：**

```
Authorization: Bearer <JWT_TOKEN>
```

## 工作流 ID 映射

| API 模式 (mode)     | 工作流 ID (workflowId) | 说明             |
| ------------------- | ---------------------- | ---------------- |
| `keyword_mining`    | `mining`               | 关键词挖掘工作流 |
| `batch_translation` | `batch`                | 批量翻译工作流   |
| `deep_dive`         | `deepDive`             | 深度策略工作流   |

## 在子应用中使用

### 1. 保存用户配置

当用户在子应用中创建或修改工作流配置时，调用创建或更新 API：

```typescript
// 创建配置
async function saveWorkflowConfig(
  workflowId: string,
  name: string,
  nodes: WorkflowNode[]
) {
  const response = await fetch(
    "https://www.nichedigger.ai/api/v1/workflow-configs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        workflowId,
        name,
        nodes,
      }),
    }
  );

  return await response.json();
}
```

### 2. 加载用户配置

```typescript
// 获取用户的配置列表
async function getUserConfigs(workflowId?: string) {
  const url = workflowId
    ? `https://www.nichedigger.ai/api/v1/workflow-configs?workflowId=${workflowId}`
    : "https://www.nichedigger.ai/api/v1/workflow-configs";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return await response.json();
}
```

### 3. 在 API 调用中使用配置

```typescript
// 使用保存的配置进行 API 调用
async function callSEOAgent(
  mode: string,
  params: any,
  workflowConfigId: string
) {
  const response = await fetch("https://www.nichedigger.ai/api/v1/seo-agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      mode,
      workflowConfigId, // 使用保存的配置 ID
      ...params,
    }),
  });

  return await response.json();
}
```

## 注意事项

1. **用户隔离**：每个配置都关联到 `user_id`，用户只能访问自己的配置
2. **数据持久化**：所有配置都存储在数据库中，不会因服务器重启而丢失
3. **外键约束**：`user_id` 有外键约束，删除用户时会自动删除该用户的所有配置
4. **JSONB 存储**：`nodes` 字段使用 JSONB 类型，支持高效的 JSON 查询和索引
5. **配置验证**：创建配置时会验证 `workflowId` 必须是 `mining`、`batch` 或 `deepDive` 之一

## 数据库初始化

确保在部署时运行数据库初始化：

**GET** `/api/init-db`

这会自动创建 `workflow_configs` 表（如果不存在）。
