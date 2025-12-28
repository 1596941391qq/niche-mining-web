import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API 文档页面
 * GET /docs
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 设置内容类型为 HTML
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const baseUrl = 'https://www.nichedigger.ai';

  const html = `<!DOCTYPE html>
<html lang="zh-CN" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NicheDigger API 文档 - NicheDigger</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            mono: ["JetBrains Mono", "Courier New", "monospace"],
          },
          colors: {
            background: "var(--color-background)",
            surface: "var(--color-surface)",
            border: "var(--color-border)",
            "text-primary": "var(--color-text-primary)",
            "text-secondary": "var(--color-text-secondary)",
            "text-tertiary": "var(--color-text-tertiary)",
            primary: {
              DEFAULT: "#10b981",
              dim: "rgba(16, 185, 129, 0.1)",
            },
            accent: {
              orange: "#FF6B35",
              green: "#00FF41",
              yellow: "#FFD23F",
            },
          },
        },
      },
    };
  </script>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap");

    * {
      border-radius: 0 !important;
    }

    :root {
      --color-background: #050505;
      --color-surface: #0a0a0a;
      --color-border: #1a1a1a;
      --color-text-primary: #ffffff;
      --color-text-secondary: #9ca3af;
      --color-text-tertiary: #6b7280;
      --grid-color: rgba(16, 185, 129, 0.05);
    }

    html.light {
      --color-background: #f8f9fa;
      --color-surface: #ffffff;
      --color-border: #e5e7eb;
      --color-text-primary: #1f2937;
      --color-text-secondary: #6b7280;
      --color-text-tertiary: #9ca3af;
      --grid-color: #e5e7eb;
    }

    body {
      background-color: var(--color-background);
      background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
      background-size: 20px 20px;
      color: var(--color-text-primary);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
    }

    .grid-bg {
      background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .terminal-widget {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      transition: all 0.3s;
    }

    .terminal-widget:hover {
      border-color: rgba(16, 185, 129, 0.3);
    }

    .terminal-header {
      background: var(--color-background);
      border-bottom: 1px solid var(--color-border);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .status-dots {
      display: flex;
      gap: 4px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot.red { background: rgba(239, 68, 68, 0.5); }
    .status-dot.yellow { background: rgba(234, 179, 8, 0.5); }
    .status-dot.green { background: rgba(34, 197, 94, 0.5); }

    .method-badge {
      display: inline-block;
      padding: 4px 8px;
      font-weight: 600;
      font-size: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      margin-right: 8px;
    }

    .method-badge.post { background: #10b981; color: #000; }
    .method-badge.get { background: #3b82f6; color: #fff; }
    .method-badge.delete { background: #ef4444; color: #fff; }

    .code-block {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      overflow-x: auto;
      margin: 16px 0;
    }

    .code-block code {
      color: var(--color-text-primary);
    }

    .code-block .keyword { color: #10b981; }
    .code-block .string { color: #10b981; }
    .code-block .comment { color: var(--color-text-tertiary); }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    th {
      background: var(--color-surface);
      font-weight: 600;
      color: var(--color-text-primary);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      color: var(--color-text-secondary);
    }

    tr:hover {
      background: var(--color-surface);
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      margin-left: 8px;
    }

    .badge.required {
      background: #ef4444;
      color: #fff;
    }

    .badge.optional {
      background: var(--color-text-tertiary);
      color: #fff;
    }

    .info-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 16px;
      margin: 20px 0;
    }

    .warning-box {
      background: rgba(255, 210, 63, 0.1);
      border: 1px solid rgba(255, 210, 63, 0.3);
      padding: 16px;
      margin: 20px 0;
    }

    .section-divider {
      border-top: 2px solid var(--color-border);
      margin: 40px 0;
      padding-top: 40px;
    }

    .toc {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: 20px;
      margin: 20px 0;
      position: sticky;
      top: 20px;
    }

    .toc ul {
      list-style: none;
      padding-left: 0;
    }

    .toc li {
      margin: 8px 0;
    }

    .toc a {
      color: #10b981;
      text-decoration: none;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .toc a:hover {
      color: #34d399;
    }

    .progress-bar {
      height: 2px;
      width: 100%;
      background: var(--color-border);
      position: relative;
      overflow: hidden;
    }

    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      background: #10b981;
      transition: width 0.7s ease-out;
    }

    .terminal-widget:hover .progress-bar::after {
      width: 100%;
    }

    #responseBody {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .loading {
      opacity: 0.6;
      pointer-events: none;
    }
  </style>
  <script>
    const baseUrl = '${baseUrl}';
    
    // API 端点配置
    const apiEndpoints = {
      'seo-agent': {
        method: 'POST',
        url: baseUrl + '/api/v1/seo-agent',
        defaultBody: {
          mode: 'keyword_mining',
          seedKeyword: 'coffee shop',
          systemInstruction: 'Generate high-potential SEO keywords.',
          targetLanguage: 'ko',
          wordsPerRound: 10,
          analyzeRanking: true
        }
      },
      'workflows': {
        method: 'GET',
        url: baseUrl + '/api/v1/workflows',
        defaultBody: null
      },
      'workflow-configs': {
        method: 'GET',
        url: baseUrl + '/api/v1/workflow-configs',
        defaultBody: null
      },
      'workflow-configs-create': {
        method: 'POST',
        url: baseUrl + '/api/v1/workflow-configs',
        defaultBody: {
          workflowId: 'mining',
          name: 'My Custom Config',
          nodes: [
            {
              id: 'mining-gen',
              type: 'agent',
              name: 'Keyword Generation Agent',
              prompt: 'Generate high-potential SEO keywords focusing on commercial intent.'
            }
          ]
        }
      }
    };

    // 切换部分显示/隐藏
    function toggleSection(sectionId) {
      const section = document.getElementById(sectionId + 'Section');
      const toggle = document.getElementById(sectionId + 'Toggle');
      if (section.style.display === 'none') {
        section.style.display = 'block';
        toggle.textContent = '▼';
      } else {
        section.style.display = 'none';
        toggle.textContent = '▶';
      }
    }

    // 加载示例
    function loadExample() {
      const endpoint = document.getElementById('apiEndpoint').value;
      const config = apiEndpoints[endpoint];
      if (config && config.defaultBody) {
        document.getElementById('requestBody').value = JSON.stringify(config.defaultBody, null, 2);
      } else {
        document.getElementById('requestBody').value = '{}';
      }
    }

    // 更新 API 端点
    document.getElementById('apiEndpoint').addEventListener('change', function() {
      const endpoint = this.value;
      const config = apiEndpoints[endpoint];
      if (config) {
        document.getElementById('httpMethod').textContent = config.method;
        document.getElementById('httpMethod').className = 'method-badge ' + config.method.toLowerCase();
        document.getElementById('apiUrl').value = config.url;
        if (config.defaultBody) {
          document.getElementById('requestBody').value = JSON.stringify(config.defaultBody, null, 2);
        } else {
          document.getElementById('requestBody').value = '{}';
        }
      }
    });

    // 发送请求
    async function sendRequest() {
      const method = document.getElementById('httpMethod').textContent;
      const url = document.getElementById('apiUrl').value;
      const authEnabled = document.getElementById('authEnabled').checked;
      const authToken = document.getElementById('authToken').value;
      const bodyText = document.getElementById('requestBody').value;
      const sendBtn = document.getElementById('sendBtn');
      const responsePlaceholder = document.getElementById('responsePlaceholder');
      const responseContent = document.getElementById('responseContent');
      const responseBody = document.getElementById('responseBody');
      const responseStatus = document.getElementById('responseStatus');
      const responseTime = document.getElementById('responseTime');

      // 显示加载状态
      sendBtn.classList.add('loading');
      sendBtn.textContent = '发送中...';
      responsePlaceholder.style.display = 'none';
      responseContent.classList.remove('hidden');

      const startTime = Date.now();

      try {
        // 构建 headers
        const headers = {
          'Content-Type': 'application/json'
        };

        if (authEnabled && authToken) {
          headers['Authorization'] = 'Bearer ' + authToken;
        }

        // 构建请求选项
        const options = {
          method: method,
          headers: headers
        };

        // 如果是 POST/PUT，添加 body
        if (method === 'POST' || method === 'PUT') {
          try {
            const body = JSON.parse(bodyText);
            options.body = JSON.stringify(body);
          } catch (e) {
            throw new Error('Invalid JSON in request body: ' + e.message);
          }
        }

        // 发送请求
        const response = await fetch(url, options);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // 解析响应
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // 显示响应
        responseStatus.textContent = response.status + ' ' + response.statusText;
        responseStatus.className = 'method-badge ' + (response.ok ? 'get' : 'delete');
        responseTime.textContent = duration + 'ms';
        
        if (typeof responseData === 'string') {
          responseBody.textContent = responseData;
        } else {
          responseBody.textContent = JSON.stringify(responseData, null, 2);
        }

        // 高亮 JSON
        if (typeof responseData === 'object') {
          responseBody.style.color = 'var(--color-text-primary)';
        }

      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        responseStatus.textContent = 'Error';
        responseStatus.className = 'method-badge delete';
        responseTime.textContent = duration + 'ms';
        responseBody.textContent = 'Error: ' + error.message;
        responseBody.style.color = '#ef4444';
      } finally {
        sendBtn.classList.remove('loading');
        sendBtn.textContent = '发送';
      }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
      loadExample();
    });
  </script>
</head>
<body>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b border-border bg-surface">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-primary font-mono uppercase tracking-tight mb-1">
              NicheDigger API
            </h1>
            <p class="text-sm text-text-tertiary font-mono">
              统一的 NicheDigger API 接口
            </p>
          </div>
          <div class="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30">
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span class="text-xs font-mono text-primary uppercase tracking-wider">SYSTEM_ONLINE</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar - Table of Contents -->
        <aside class="lg:col-span-1">
          <div class="toc">
            <h3 class="text-sm font-bold text-text-primary font-mono uppercase tracking-wider mb-4">
              目录
            </h3>
            <ul>
              <li><a href="#overview">概述</a></li>
              <li><a href="#authentication">认证</a></li>
              <li><a href="#endpoints">API 端点</a></li>
              <li><a href="#modes">三种模式</a></li>
              <li><a href="#workflows">工作流配置</a></li>
              <li><a href="#credits">Credits 消耗</a></li>
              <li><a href="#errors">错误码</a></li>
              <li><a href="#examples">使用示例</a></li>
              <li><a href="#test">API 测试</a></li>
              <li><a href="#languages">支持的语言</a></li>
            </ul>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="lg:col-span-3 space-y-8">
          <!-- Overview Section -->
          <section id="overview" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // 概述
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                概述
              </h2>
              <p class="text-text-secondary mb-4">
                SEO Agent API 是一个统一的 API 接口，提供三种 SEO 分析模式：
              </p>
              <ul class="list-none space-y-2 mb-6">
                <li class="flex items-start gap-2">
                  <span class="text-primary font-mono">/</span>
                  <span class="text-text-secondary">
                    <strong class="text-text-primary">关键词挖掘</strong> (keyword_mining) - 基于种子关键词生成并分析 SEO 关键词
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-mono">/</span>
                  <span class="text-text-secondary">
                    <strong class="text-text-primary">批量翻译分析</strong> (batch_translation) - 批量翻译关键词并分析排名机会
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-mono">/</span>
                  <span class="text-text-secondary">
                    <strong class="text-text-primary">深度策略</strong> (deep_dive) - 为关键词生成全面的 SEO 内容策略
                  </span>
                </li>
              </ul>
              <div class="info-box">
                <p class="text-sm text-text-primary font-mono mb-2">
                  <strong>基础 URL:</strong> <span class="text-primary">${baseUrl}/api/v1</span>
                </p>
                <p class="text-sm text-text-primary font-mono mb-2">
                  <strong>Content-Type:</strong> <span class="text-primary">application/json</span>
                </p>
                <p class="text-sm text-text-primary font-mono">
                  <strong>CORS:</strong> <span class="text-primary">支持跨域请求</span>
                </p>
              </div>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Authentication Section -->
          <section id="authentication" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // 认证
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                认证
              </h2>
              <p class="text-text-secondary mb-4">
                所有 API 请求都需要在 <code class="text-primary">Authorization</code> header 中提供认证信息。支持两种认证方式：
              </p>
              
              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-6">1. JWT Token（用于 Web 应用）</h3>
              <div class="code-block">
                <code>Authorization: Bearer &lt;your_jwt_token&gt;</code>
              </div>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-6">2. API Key（用于程序化访问）</h3>
              <div class="code-block">
                <code>Authorization: Bearer nm_live_&lt;your_api_key&gt;</code>
              </div>

              <div class="warning-box mt-6">
                <p class="text-sm text-text-primary font-mono">
                  <strong>注意:</strong> 如果没有提供有效的认证信息，API 会返回 401 错误。
                </p>
              </div>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Endpoints Section -->
          <section id="endpoints" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // API 端点
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                主要 API 端点
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>端点</th>
                    <th>方法</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">/api/v1/seo-agent</code></td>
                    <td>POST</td>
                    <td>SEO 分析主接口</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">/api/v1/workflows</code></td>
                    <td>GET</td>
                    <td>获取工作流定义</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">/api/v1/workflow-configs</code></td>
                    <td>POST</td>
                    <td>创建工作流配置</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">/api/v1/workflow-configs</code></td>
                    <td>GET</td>
                    <td>获取工作流配置列表</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Modes Section -->
          <section id="modes" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // 三种模式
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                三种模式
              </h2>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-6">模式 1: 关键词挖掘 (keyword_mining)</h3>
              <p class="text-text-secondary mb-4">
                基于种子关键词生成 SEO 关键词，并可选择性地分析排名概率。
              </p>
              
              <h4 class="text-md font-bold text-text-primary font-mono mb-3">请求参数</h4>
              <table>
                <thead>
                  <tr>
                    <th>参数</th>
                    <th>类型</th>
                    <th>必填</th>
                    <th>默认值</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">mode</code></td>
                    <td>string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>必须为 "keyword_mining"</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">seedKeyword</code></td>
                    <td>string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>种子关键词</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">systemInstruction</code></td>
                    <td>string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>AI 系统指令，用于指导关键词生成</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">targetLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"en"</td>
                    <td>目标市场语言代码 (en, zh, ko, ja, ru, fr, pt, id, es, ar)</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">existingKeywords</code></td>
                    <td>string[]</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>[]</td>
                    <td>已生成的关键词列表（用于避免重复）</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">roundIndex</code></td>
                    <td>number</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>1</td>
                    <td>挖掘轮次</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">wordsPerRound</code></td>
                    <td>number</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>10</td>
                    <td>每轮生成的关键词数量 (5-20)</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">miningStrategy</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"horizontal"</td>
                    <td>挖掘策略："horizontal" (横向) 或 "vertical" (纵向)</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">userSuggestion</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>""</td>
                    <td>用户建议（用于指导下一轮生成）</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">uiLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"en"</td>
                    <td>UI 语言："en" 或 "zh"</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">analyzeRanking</code></td>
                    <td>boolean</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>true</td>
                    <td>是否分析排名概率</td>
                  </tr>
                </tbody>
              </table>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">请求示例</h4>
              <div class="code-block">
                <code>curl -X POST ${baseUrl}/api/v1/seo-agent \\<br>
  -H "Content-Type: application/json" \\<br>
  -H "Authorization: Bearer YOUR_API_KEY" \\<br>
  -d '{<br>
    "mode": "keyword_mining",<br>
    "seedKeyword": "coffee shop",<br>
    "systemInstruction": "Generate high-potential SEO keywords focusing on commercial intent.",<br>
    "targetLanguage": "ko",<br>
    "wordsPerRound": 10,<br>
    "miningStrategy": "horizontal",<br>
    "uiLanguage": "zh",<br>
    "analyzeRanking": true<br>
  }'</code>
              </div>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">响应示例</h4>
              <div class="code-block">
                <code>{<br>
  "success": true,<br>
  "mode": "keyword_mining",<br>
  "data": {<br>
    "keywords": [<br>
      {<br>
        "id": "kw-1234567890-0",<br>
        "keyword": "커피숍 프랜차이즈",<br>
        "translation": "咖啡店加盟",<br>
        "intent": "Commercial",<br>
        "volume": 3200,<br>
        "probability": "HIGH",<br>
        "topDomainType": "Niche Site",<br>
        "reasoning": "竞争较弱，蓝海机会",<br>
        "serankingData": {<br>
          "volume": 3200,<br>
          "difficulty": 25,<br>
          "cpc": 1.2,<br>
          "competition": 0.3<br>
        }<br>
      }<br>
    ],<br>
    "count": 10,<br>
    "seedKeyword": "coffee shop",<br>
    "targetLanguage": "ko",<br>
    "roundIndex": 1<br>
  }<br>
}</code>
              </div>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-8">模式 2: 批量翻译分析 (batch_translation)</h3>
              <p class="text-text-secondary mb-4">
                批量翻译关键词到目标语言，并分析每个关键词的排名机会。
              </p>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3">请求参数</h4>
              <table>
                <thead>
                  <tr>
                    <th>参数</th>
                    <th>类型</th>
                    <th>必填</th>
                    <th>默认值</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">mode</code></td>
                    <td>string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>必须为 "batch_translation"</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">keywords</code></td>
                    <td>string | string[]</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>关键词列表（逗号分隔字符串或数组）</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">systemInstruction</code></td>
                    <td>string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>AI 系统指令，用于分析排名机会</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">targetLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"en"</td>
                    <td>目标市场语言代码</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">uiLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"en"</td>
                    <td>UI 语言："en" 或 "zh"</td>
                  </tr>
                </tbody>
              </table>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">请求示例</h4>
              <div class="code-block">
                <code>curl -X POST ${baseUrl}/api/v1/seo-agent \\<br>
  -H "Content-Type: application/json" \\<br>
  -H "Authorization: Bearer YOUR_API_KEY" \\<br>
  -d '{<br>
    "mode": "batch_translation",<br>
    "keywords": "coffee shop, espresso machine, latte art, cold brew",<br>
    "systemInstruction": "Analyze SEO ranking opportunities for these keywords.",<br>
    "targetLanguage": "ko",<br>
    "uiLanguage": "zh"<br>
  }'</code>
              </div>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">响应示例</h4>
              <div class="code-block">
                <code>{<br>
  "success": true,<br>
  "mode": "batch_translation",<br>
  "data": {<br>
    "keywords": [<br>
      {<br>
        "id": "bt-1234567890-0",<br>
        "keyword": "커피숍",<br>
        "translation": "coffee shop",<br>
        "intent": "Informational",<br>
        "volume": 4500,<br>
        "probability": "HIGH",<br>
        "topDomainType": "Niche Site",<br>
        "reasoning": "竞争较弱，有机会排名",<br>
        "serankingData": {<br>
          "volume": 4500,<br>
          "difficulty": 28,<br>
          "cpc": 1.5<br>
        }<br>
      }<br>
    ],<br>
    "translationResults": [<br>
      {<br>
        "original": "coffee shop",<br>
        "translated": "커피숍",<br>
        "translationBack": "coffee shop"<br>
      }<br>
    ],<br>
    "total": 4,<br>
    "targetLanguage": "ko"<br>
  }<br>
}</code>
              </div>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-8">模式 3: 深度策略 (deep_dive)</h3>
              <p class="text-text-secondary mb-4">
                为指定关键词生成全面的 SEO 内容策略，包括页面标题、描述、内容结构、长尾关键词等。
              </p>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3">请求参数</h4>
              <table>
                <thead>
                  <tr>
                    <th>参数</th>
                    <th>类型</th>
                    <th>必填</th>
                    <th>默认值</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">mode</code></td>
                    <td>string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>必须为 "deep_dive"</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">keyword</code></td>
                    <td>object | string</td>
                    <td><span class="badge required">必填</span></td>
                    <td>-</td>
                    <td>关键词对象或字符串</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">targetLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"en"</td>
                    <td>目标市场语言代码</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">uiLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>"en"</td>
                    <td>UI 语言："en" 或 "zh"</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">strategyPrompt</code></td>
                    <td>string</td>
                    <td><span class="badge optional">可选</span></td>
                    <td>-</td>
                    <td>自定义策略生成提示词</td>
                  </tr>
                </tbody>
              </table>

              <p class="text-text-secondary mb-3 mt-4 font-mono text-sm">
                <strong>Keyword 对象格式（如果提供对象）:</strong>
              </p>
              <div class="code-block mb-4">
                <code>{<br>
  "id": "kw-123",<br>
  "keyword": "coffee shop",<br>
  "translation": "咖啡店",<br>
  "intent": "Commercial",<br>
  "volume": 1000<br>
}</code>
              </div>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">请求示例</h4>
              <p class="text-text-secondary mb-2 font-mono text-sm">使用对象格式:</p>
              <div class="code-block mb-4">
                <code>curl -X POST ${baseUrl}/api/v1/seo-agent \\<br>
  -H "Content-Type: application/json" \\<br>
  -H "Authorization: Bearer YOUR_API_KEY" \\<br>
  -d '{<br>
    "mode": "deep_dive",<br>
    "keyword": {<br>
      "id": "kw-123",<br>
      "keyword": "coffee shop",<br>
      "translation": "咖啡店",<br>
      "intent": "Commercial",<br>
      "volume": 1000<br>
    },<br>
    "targetLanguage": "ko",<br>
    "uiLanguage": "zh"<br>
  }'</code>
              </div>
              <p class="text-text-secondary mb-2 font-mono text-sm">或使用简化格式:</p>
              <div class="code-block">
                <code>curl -X POST ${baseUrl}/api/v1/seo-agent \\<br>
  -H "Content-Type: application/json" \\<br>
  -H "Authorization: Bearer YOUR_API_KEY" \\<br>
  -d '{<br>
    "mode": "deep_dive",<br>
    "keyword": "coffee shop",<br>
    "targetLanguage": "ko",<br>
    "uiLanguage": "zh"<br>
  }'</code>
              </div>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">响应示例</h4>
              <div class="code-block">
                <code>{<br>
  "success": true,<br>
  "mode": "deep_dive",<br>
  "data": {<br>
    "report": {<br>
      "targetKeyword": "커피숍",<br>
      "pageTitleH1": "최고의 커피숍 가이드 2024",<br>
      "pageTitleH1_trans": "最佳咖啡店指南 2024",<br>
      "metaDescription": "커피숍 선택 가이드: 위치, 메뉴, 가격 비교...",<br>
      "metaDescription_trans": "咖啡店选择指南：位置、菜单、价格比较...",<br>
      "urlSlug": "coffee-shop-guide",<br>
      "contentStructure": [<br>
        {<br>
          "header": "커피숍 선택 기준",<br>
          "header_trans": "咖啡店选择标准",<br>
          "description": "위치, 가격, 메뉴 다양성 등을 고려하세요.",<br>
          "description_trans": "考虑位置、价格、菜单多样性等因素。"<br>
        }<br>
      ],<br>
      "longTailKeywords": ["커피숍 프랜차이즈", "커피숍 창업 비용"],<br>
      "longTailKeywords_trans": ["咖啡店加盟", "咖啡店创业成本"],<br>
      "recommendedWordCount": 2000<br>
    },<br>
    "coreKeywords": [<br>
      {<br>
        "id": "cd-1234567890-0",<br>
        "keyword": "커피숍 프랜차이즈",<br>
        "translation": "커피숍 프랜차이즈",<br>
        "volume": 3200,<br>
        "probability": "HIGH",<br>
        "topDomainType": "Niche Site"<br>
      }<br>
    ],<br>
    "keyword": "커피숍",<br>
    "targetLanguage": "ko"<br>
  }<br>
}</code>
              </div>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Credits Section -->
          <section id="credits" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // Credits 消耗规则
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                Credits 消耗规则
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>模式</th>
                    <th>基础消耗</th>
                    <th>计算方式</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">keyword_mining</code></td>
                    <td>20 Credits</td>
                    <td>每 10 个关键词 = 20 Credits（向上取整）</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">batch_translation</code></td>
                    <td>20 Credits</td>
                    <td>每 10 个关键词 = 20 Credits（向上取整）</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">deep_dive</code></td>
                    <td>30 Credits</td>
                    <td>固定 30 Credits</td>
                  </tr>
                </tbody>
              </table>
              <div class="warning-box mt-6">
                <p class="text-sm text-text-primary font-mono">
                  <strong>注意:</strong> API 会在执行前检查 Credits 余额，余额不足会返回 402 错误。操作成功后会自动扣除相应的 Credits。
                </p>
              </div>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Errors Section -->
          <section id="errors" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // 错误码
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                错误码
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>HTTP 状态码</th>
                    <th>错误类型</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>401</td>
                    <td>Unauthorized</td>
                    <td>缺少或无效的认证 token</td>
                  </tr>
                  <tr>
                    <td>402</td>
                    <td>Payment Required</td>
                    <td>Credits 余额不足</td>
                  </tr>
                  <tr>
                    <td>400</td>
                    <td>Bad Request</td>
                    <td>请求参数错误或缺失</td>
                  </tr>
                  <tr>
                    <td>405</td>
                    <td>Method Not Allowed</td>
                    <td>请求方法不支持</td>
                  </tr>
                  <tr>
                    <td>500</td>
                    <td>Internal Server Error</td>
                    <td>服务器内部错误</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Examples Section -->
          <section id="examples" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // 使用示例
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                使用示例
              </h2>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3">JavaScript/TypeScript</h3>
              <div class="code-block">
                <code>async function callSEOAgent(mode, params, apiKey) {<br>
  const response = await fetch("${baseUrl}/api/v1/seo-agent", {<br>
    method: "POST",<br>
    headers: {<br>
      "Content-Type": "application/json",<br>
      Authorization: \`Bearer \${apiKey}\`,<br>
    },<br>
    body: JSON.stringify({<br>
      mode,<br>
      ...params,<br>
    }),<br>
  });<br><br>
  if (!response.ok) {<br>
    const error = await response.json();<br>
    throw new Error(error.message || error.error);<br>
  }<br><br>
  return await response.json();<br>
}<br><br>
// 使用 API Key<br>
const apiKey = "nm_live_YOUR_API_KEY";<br><br>
// 关键词挖掘<br>
const result = await callSEOAgent(<br>
  "keyword_mining",<br>
  {<br>
    seedKeyword: "coffee shop",<br>
    systemInstruction: "Generate high-potential SEO keywords.",<br>
    targetLanguage: "ko",<br>
  },<br>
  apiKey<br>
);</code>
              </div>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-6">Python</h3>
              <div class="code-block">
                <code>import requests<br><br>
def call_seo_agent(mode, **params):<br>
    url = '${baseUrl}/api/v1/seo-agent'<br>
    headers = {<br>
        'Content-Type': 'application/json',<br>
        'Authorization': 'Bearer YOUR_API_KEY'<br>
    }<br>
    payload = {<br>
        'mode': mode,<br>
        **params<br>
    }<br>
    <br>
    response = requests.post(url, json=payload, headers=headers)<br>
    response.raise_for_status()<br>
    return response.json()<br><br>
# 关键词挖掘<br>
result = call_seo_agent(<br>
    'keyword_mining',<br>
    seedKeyword='coffee shop',<br>
    systemInstruction='Generate high-potential SEO keywords.',<br>
    targetLanguage='ko'<br>
)</code>
              </div>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- API Test Section -->
          <section id="test" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // API 测试
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                在线测试 API
              </h2>
              <p class="text-text-secondary mb-6">
                在下方直接测试 API 接口，输入参数并查看返回结果。
              </p>

              <!-- API Selector -->
              <div class="mb-6">
                <label class="block text-sm font-bold text-text-primary font-mono mb-2">
                  选择 API 端点
                </label>
                <select id="apiEndpoint" class="w-full bg-background border border-border text-text-primary font-mono p-3 focus:outline-none focus:border-primary">
                  <option value="seo-agent">POST /api/v1/seo-agent</option>
                  <option value="workflows">GET /api/v1/workflows</option>
                  <option value="workflow-configs">GET /api/v1/workflow-configs</option>
                  <option value="workflow-configs-create">POST /api/v1/workflow-configs</option>
                </select>
              </div>

              <!-- Method and URL -->
              <div class="mb-6">
                <label class="block text-sm font-bold text-text-primary font-mono mb-2">
                  请求方法 & URL
                </label>
                <div class="flex items-center gap-2">
                  <span id="httpMethod" class="method-badge post">POST</span>
                  <input type="text" id="apiUrl" value="${baseUrl}/api/v1/seo-agent" 
                    class="flex-1 bg-background border border-border text-text-primary font-mono p-3 focus:outline-none focus:border-primary" />
                  <button id="sendBtn" onclick="sendRequest()" 
                    class="px-6 py-3 bg-primary text-black font-mono font-bold hover:bg-primary/80 transition-colors">
                    发送
                  </button>
                </div>
              </div>

              <!-- Headers -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-bold text-text-primary font-mono">
                    Headers
                  </label>
                  <button onclick="toggleSection('headers')" class="text-text-tertiary hover:text-text-primary">
                    <span id="headersToggle">▼</span>
                  </button>
                </div>
                <div id="headersSection" class="space-y-3">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" id="authEnabled" checked 
                      class="w-4 h-4 text-primary bg-background border-border focus:ring-primary" />
                    <label class="text-text-secondary font-mono text-sm">Authorization</label>
                    <select id="authType" class="bg-background border border-border text-text-primary font-mono px-2 py-1 text-sm">
                      <option value="Bearer">Bearer</option>
                    </select>
                    <input type="text" id="authToken" placeholder="输入 JWT Token 或 API Key (nm_live_...)" 
                      class="flex-1 bg-background border border-border text-text-primary font-mono px-3 py-1 text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>

              <!-- Body -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <label class="text-sm font-bold text-text-primary font-mono">
                      Body
                    </label>
                    <select id="bodyType" class="bg-background border border-border text-text-primary font-mono px-2 py-1 text-sm">
                      <option value="json">JSON</option>
                    </select>
                    <button onclick="loadExample()" class="text-text-tertiary hover:text-text-primary text-sm font-mono">
                      示例 ▼
                    </button>
                  </div>
                  <button onclick="toggleSection('body')" class="text-text-tertiary hover:text-text-primary">
                    <span id="bodyToggle">▼</span>
                  </button>
                </div>
                <div id="bodySection">
                  <textarea id="requestBody" rows="12" 
                    class="w-full bg-background border border-border text-text-primary font-mono p-4 text-sm focus:outline-none focus:border-primary"
                    placeholder='{\n  "mode": "keyword_mining",\n  "seedKeyword": "coffee shop",\n  "systemInstruction": "Generate high-potential SEO keywords."\n}'>{
  "mode": "keyword_mining",
  "seedKeyword": "coffee shop",
  "systemInstruction": "Generate high-potential SEO keywords.",
  "targetLanguage": "ko",
  "wordsPerRound": 10,
  "analyzeRanking": true
}</textarea>
                </div>
              </div>

              <!-- Response -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-bold text-text-primary font-mono">
                    返回结果
                  </label>
                  <button onclick="toggleSection('response')" class="text-text-tertiary hover:text-text-primary">
                    <span id="responseToggle">▼</span>
                  </button>
                </div>
                <div id="responseSection" class="min-h-[200px]">
                  <div id="responsePlaceholder" class="flex flex-col items-center justify-center h-[200px] text-text-tertiary">
                    <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <p class="font-mono text-sm">点击"发送"按钮获取返回结果</p>
                  </div>
                  <div id="responseContent" class="hidden">
                    <div class="mb-2">
                      <span id="responseStatus" class="method-badge get"></span>
                      <span id="responseTime" class="text-text-tertiary font-mono text-xs ml-2"></span>
                    </div>
                    <pre id="responseBody" class="bg-background border border-border p-4 text-text-primary font-mono text-sm overflow-auto max-h-[500px]"></pre>
                  </div>
                </div>
              </div>
            </div>
            <div class="progress-bar"></div>
          </section>

          <!-- Languages Section -->
          <section id="languages" class="terminal-widget">
            <div class="terminal-header">
              <div class="flex items-center gap-2">
                <div class="status-dots">
                  <div class="status-dot red"></div>
                  <div class="status-dot yellow"></div>
                  <div class="status-dot green"></div>
                </div>
                <span class="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  sys_module // 支持的语言
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                支持的语言代码
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>代码</th>
                    <th>语言</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>en</td><td>English</td></tr>
                  <tr><td>zh</td><td>Chinese</td></tr>
                  <tr><td>ko</td><td>Korean</td></tr>
                  <tr><td>ja</td><td>Japanese</td></tr>
                  <tr><td>ru</td><td>Russian</td></tr>
                  <tr><td>fr</td><td>French</td></tr>
                  <tr><td>pt</td><td>Portuguese</td></tr>
                  <tr><td>id</td><td>Indonesian</td></tr>
                  <tr><td>es</td><td>Spanish</td></tr>
                  <tr><td>ar</td><td>Arabic</td></tr>
                </tbody>
              </table>
            </div>
            <div class="progress-bar"></div>
          </section>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-border bg-surface mt-16">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <p class="text-center text-text-tertiary text-sm font-mono">
          © 2024 NicheDigger. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</body>
</html>`;

  return res.status(200).send(html);
}

