import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API 文档页面
 * GET /docs?lang=en 或 /docs?lang=zh
 */

// 翻译映射对象
const translations = {
  zh: {
    title: 'NicheDigger API 文档 - NicheDigger',
    headerTitle: 'NicheDigger API',
    headerSubtitle: '统一的 NicheDigger API 接口',
    toc: '目录',
    overview: '概述',
    authentication: '认证',
    endpoints: 'API 端点',
    modes: '三种模式',
    workflows: '工作流配置',
    credits: 'Credits 消耗',
    errors: '错误码',
    examples: '使用示例',
    test: 'API 测试',
    languages: '支持的语言',
    overviewDesc: 'SEO Agent API 是一个统一的 API 接口，提供三种 SEO 分析模式：',
    keywordMining: '关键词挖掘',
    keywordMiningDesc: '基于种子关键词生成并分析 SEO 关键词',
    batchTranslation: '批量翻译分析',
    batchTranslationDesc: '批量翻译关键词并分析排名机会',
    deepDive: '深度策略',
    deepDiveDesc: '为关键词生成全面的 SEO 内容策略',
    baseUrl: '基础 URL:',
    contentType: 'Content-Type:',
    cors: 'CORS:',
    corsSupport: '支持跨域请求',
    authDesc: '所有 API 请求都需要在',
    authHeader: 'header 中提供认证信息。支持两种认证方式：',
    apiKeyRecommended: 'API Key（推荐）',
    apiKeyDesc: '使用 API Key 进行认证更安全，建议所有 API 调用都使用 API Key。你可以在控制台的 API Keys 页面创建和管理 API Key。',
    note: '注意:',
    authWarning: '如果没有提供有效的认证信息，API 会返回 401 错误。',
    mainEndpoints: '主要 API 端点',
    endpoint: '端点',
    method: '方法',
    description: '说明',
    seoAgentMain: 'SEO 分析主接口',
    getWorkflows: '获取工作流定义',
    createWorkflowConfig: '创建工作流配置',
    getWorkflowConfigs: '获取工作流配置列表',
    mode1: '模式 1: 关键词挖掘 (keyword_mining)',
    mode1Desc: '基于种子关键词生成 SEO 关键词，并可选择性地分析排名概率。',
    requestParams: '请求参数',
    param: '参数',
    type: '类型',
    required: '必填',
    optional: '可选',
    defaultValue: '默认值',
    paramDesc: '说明',
    mustBe: '必须为',
    seedKeyword: '种子关键词',
    systemInstruction: 'AI 系统指令，用于指导关键词生成',
    targetLanguage: '目标市场语言代码 (en, zh, ko, ja, ru, fr, pt, id, es, ar)',
    existingKeywords: '已生成的关键词列表（用于避免重复）',
    roundIndex: '挖掘轮次',
    wordsPerRound: '每轮生成的关键词数量 (5-20)',
    miningStrategy: '挖掘策略："horizontal" (横向) 或 "vertical" (纵向)',
    userSuggestion: '用户建议（用于指导下一轮生成）',
    uiLanguage: 'UI 语言："en" 或 "zh"',
    analyzeRanking: '是否分析排名概率',
    requestExample: '请求示例',
    responseExample: '响应示例',
    mode2: '模式 2: 批量翻译分析 (batch_translation)',
    mode2Desc: '批量翻译关键词到目标语言，并分析每个关键词的排名机会。',
    keywordsList: '关键词列表（逗号分隔字符串或数组）',
    systemInstructionAnalysis: 'AI 系统指令，用于分析排名机会',
    mode3: '模式 3: 深度策略 (deep_dive)',
    mode3Desc: '为指定关键词生成全面的 SEO 内容策略，包括页面标题、描述、内容结构、长尾关键词等。',
    keywordObject: '关键词对象或字符串',
    keywordObjectFormat: 'Keyword 对象格式（如果提供对象）:',
    customStrategyPrompt: '自定义策略生成提示词',
    useObjectFormat: '使用对象格式:',
    orUseSimpleFormat: '或使用简化格式:',
    creditsRules: 'Credits 消耗规则',
    mode: '模式',
    baseCost: '基础消耗',
    calculation: '计算方式',
    per10Keywords: '每 10 个关键词 = 20 Credits（向上取整）',
    fixed30Credits: '固定 30 Credits',
    creditsWarning: 'API 会在执行前检查 Credits 余额，余额不足会返回 402 错误。操作成功后会自动扣除相应的 Credits。',
    errorCodes: '错误码',
    httpStatus: 'HTTP 状态码',
    errorType: '错误类型',
    missingAuth: '缺少或无效的认证 token',
    insufficientCredits: 'Credits 余额不足',
    badRequest: '请求参数错误或缺失',
    methodNotAllowed: '请求方法不支持',
    serverError: '服务器内部错误',
    usageExamples: '使用示例',
    onlineTest: '在线测试 API',
    onlineTestDesc: '在下方直接测试 API 接口，输入参数并查看返回结果。',
    selectEndpoint: '选择 API 端点',
    requestMethodUrl: '请求方法 & URL',
    send: '发送',
    sending: '发送中...',
    body: 'Body',
    example: '示例',
    response: '返回结果',
    clickSend: '点击"发送"按钮获取返回结果',
    supportedLanguages: '支持的语言代码',
    code: '代码',
    language: '语言',
    createApiKey: '创建 API Key',
    createNewApiKey: '创建新 API Key',
    creating: '创建中...',
    detectedApiKeys: '已检测到',
    apiKeys: '个 API Key，最新:',
    unnamed: '未命名',
    noApiKey: '未检测到 API Key，请创建一个',
    apiKeyCreated: 'API Key 已创建并自动填入:',
    apiKeyAutoFilled: 'API Key 已自动填入（双击输入框可切换显示/隐藏）',
    apiKeyCreatedSuccess: 'API Key 创建成功！已自动填入 Authorization 字段。',
    importantNote: '重要提示：',
    keyShownOnce: '此 Key 只会显示一次，请妥善保管',
    doubleClickToView: '双击输入框可临时查看完整 Key',
    copyToSafe: '建议复制保存到安全的地方',
    copyToClipboard: '是否现在复制到剪贴板？',
    apiKeyCopied: 'API Key 已复制到剪贴板',
    apiKeySelected: 'API Key 已选中，请手动复制',
    createFailed: '创建 API Key 失败',
    createFailedLogin: '创建失败：请先登录',
    createFailedLimit: '创建失败：已达到 API Key 数量上限',
    createFailedError: '创建失败：',
    responseFormatError: '创建 API Key 失败：响应格式错误',
    inputApiKeyName: '请输入 API Key 名称（可选，直接回车使用默认名称）:',
    selectApiKey: '选择 API Key',
    apiKeyLoaded: '（已加载）',
    pleaseSelectOrCreate: '请从下拉框选择或创建新的 API Key',
    pleaseEnterFullKey: '请输入完整的 API Key',
  },
  en: {
    title: 'NicheDigger API Documentation - NicheDigger',
    headerTitle: 'NicheDigger API',
    headerSubtitle: 'Unified NicheDigger API Interface',
    toc: 'Table of Contents',
    overview: 'Overview',
    authentication: 'Authentication',
    endpoints: 'API Endpoints',
    modes: 'Three Modes',
    workflows: 'Workflow Configurations',
    credits: 'Credits Consumption',
    errors: 'Error Codes',
    examples: 'Usage Examples',
    test: 'API Testing',
    languages: 'Supported Languages',
    overviewDesc: 'SEO Agent API is a unified API interface providing three SEO analysis modes:',
    keywordMining: 'Keyword Mining',
    keywordMiningDesc: 'Generate and analyze SEO keywords based on seed keywords',
    batchTranslation: 'Batch Translation Analysis',
    batchTranslationDesc: 'Batch translate keywords and analyze ranking opportunities',
    deepDive: 'Deep Dive Strategy',
    deepDiveDesc: 'Generate comprehensive SEO content strategy for keywords',
    baseUrl: 'Base URL:',
    contentType: 'Content-Type:',
    cors: 'CORS:',
    corsSupport: 'Cross-origin requests supported',
    authDesc: 'All API requests require authentication information in the',
    authHeader: 'header. Two authentication methods are supported:',
    apiKeyRecommended: 'API Key (Recommended)',
    apiKeyDesc: 'Using API Key for authentication is more secure. It is recommended to use API Key for all API calls. You can create and manage API Keys in the API Keys page of the console.',
    note: 'Note:',
    authWarning: 'If valid authentication information is not provided, the API will return a 401 error.',
    mainEndpoints: 'Main API Endpoints',
    endpoint: 'Endpoint',
    method: 'Method',
    description: 'Description',
    seoAgentMain: 'SEO Analysis Main Interface',
    getWorkflows: 'Get Workflow Definitions',
    createWorkflowConfig: 'Create Workflow Configuration',
    getWorkflowConfigs: 'Get Workflow Configuration List',
    mode1: 'Mode 1: Keyword Mining (keyword_mining)',
    mode1Desc: 'Generate SEO keywords based on seed keywords and optionally analyze ranking probability.',
    requestParams: 'Request Parameters',
    param: 'Parameter',
    type: 'Type',
    required: 'Required',
    optional: 'Optional',
    defaultValue: 'Default Value',
    paramDesc: 'Description',
    mustBe: 'Must be',
    seedKeyword: 'Seed keyword',
    systemInstruction: 'AI system instruction for guiding keyword generation',
    targetLanguage: 'Target market language code (en, zh, ko, ja, ru, fr, pt, id, es, ar)',
    existingKeywords: 'List of generated keywords (to avoid duplicates)',
    roundIndex: 'Mining round index',
    wordsPerRound: 'Number of keywords generated per round (5-20)',
    miningStrategy: 'Mining strategy: "horizontal" or "vertical"',
    userSuggestion: 'User suggestion (for guiding next round generation)',
    uiLanguage: 'UI language: "en" or "zh"',
    analyzeRanking: 'Whether to analyze ranking probability',
    requestExample: 'Request Example',
    responseExample: 'Response Example',
    mode2: 'Mode 2: Batch Translation Analysis (batch_translation)',
    mode2Desc: 'Batch translate keywords to target language and analyze ranking opportunities for each keyword.',
    keywordsList: 'Keyword list (comma-separated string or array)',
    systemInstructionAnalysis: 'AI system instruction for analyzing ranking opportunities',
    mode3: 'Mode 3: Deep Dive Strategy (deep_dive)',
    mode3Desc: 'Generate comprehensive SEO content strategy for specified keywords, including page titles, descriptions, content structure, long-tail keywords, etc.',
    keywordObject: 'Keyword object or string',
    keywordObjectFormat: 'Keyword Object Format (if object is provided):',
    customStrategyPrompt: 'Custom strategy generation prompt',
    useObjectFormat: 'Using object format:',
    orUseSimpleFormat: 'Or using simplified format:',
    creditsRules: 'Credits Consumption Rules',
    mode: 'Mode',
    baseCost: 'Base Cost',
    calculation: 'Calculation Method',
    per10Keywords: 'Every 10 keywords = 20 Credits (rounded up)',
    fixed30Credits: 'Fixed 30 Credits',
    creditsWarning: 'The API will check Credits balance before execution. Insufficient balance will return a 402 error. Credits will be automatically deducted after successful operation.',
    errorCodes: 'Error Codes',
    httpStatus: 'HTTP Status Code',
    errorType: 'Error Type',
    missingAuth: 'Missing or invalid authentication token',
    insufficientCredits: 'Insufficient Credits balance',
    badRequest: 'Request parameter error or missing',
    methodNotAllowed: 'Request method not supported',
    serverError: 'Internal server error',
    usageExamples: 'Usage Examples',
    onlineTest: 'Online API Testing',
    onlineTestDesc: 'Test the API interface directly below, enter parameters and view return results.',
    selectEndpoint: 'Select API Endpoint',
    requestMethodUrl: 'Request Method & URL',
    send: 'Send',
    sending: 'Sending...',
    body: 'Body',
    example: 'Example',
    response: 'Response',
    clickSend: 'Click the "Send" button to get return results',
    supportedLanguages: 'Supported Language Codes',
    code: 'Code',
    language: 'Language',
    createApiKey: 'Create API Key',
    createNewApiKey: 'Create New API Key',
    creating: 'Creating...',
    detectedApiKeys: 'Detected',
    apiKeys: 'API Keys, latest:',
    unnamed: 'Unnamed',
    noApiKey: 'No API Key detected, please create one',
    apiKeyCreated: 'API Key created and auto-filled:',
    apiKeyAutoFilled: 'API Key auto-filled (double-click input to toggle show/hide)',
    apiKeyCreatedSuccess: 'API Key created successfully! Auto-filled in Authorization field.',
    importantNote: 'Important:',
    keyShownOnce: 'This Key will only be shown once, please keep it safe',
    doubleClickToView: 'Double-click input to temporarily view full Key',
    copyToSafe: 'Recommend copying and saving to a safe place',
    copyToClipboard: 'Copy to clipboard now?',
    apiKeyCopied: 'API Key copied to clipboard',
    apiKeySelected: 'API Key selected, please copy manually',
    createFailed: 'Failed to create API Key',
    createFailedLogin: 'Creation failed: Please login first',
    createFailedLimit: 'Creation failed: API Key limit reached',
    createFailedError: 'Creation failed:',
    responseFormatError: 'Failed to create API Key: Response format error',
    inputApiKeyName: 'Enter API Key name (optional, press Enter for default name):',
    selectApiKey: 'Select API Key',
    apiKeyLoaded: '(Loaded)',
    pleaseSelectOrCreate: 'Please select from dropdown or create a new API Key',
    pleaseEnterFullKey: 'Please enter the full API Key',
  },
};

// 检测语言
function detectLanguage(req: VercelRequest): 'zh' | 'en' {
  // 优先从查询参数获取
  const queryLang = req.query?.lang as string;
  if (queryLang === 'en' || queryLang === 'zh') {
    return queryLang;
  }

  // 从 Accept-Language header 检测
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    if (acceptLanguage.includes('zh')) {
      return 'zh';
    }
    if (acceptLanguage.includes('en')) {
      return 'en';
    }
  }

  // 默认返回中文
  return 'zh';
}

// 获取翻译文本
function t(lang: 'zh' | 'en', key: keyof typeof translations.zh): string {
  return translations[lang][key] || translations.zh[key];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!req || !req.method) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 检测语言
    const lang = detectLanguage(req);
    const isZh = lang === 'zh';

    // 设置内容类型为 HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const baseUrl = 'https://www.nichedigger.ai';

    const html = `<!DOCTYPE html>
<html lang="${isZh ? 'zh-CN' : 'en'}" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t(lang, 'title')}</title>
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
    const currentLang = '${lang}';
    const translations = ${JSON.stringify(translations[lang])};
    
    // 获取翻译文本
    function t(key) {
      return translations[key] || key;
    }
    
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
      if (!section || !toggle) return;
      
      if (section.style.display === 'none') {
        section.style.display = 'block';
        toggle.textContent = '▼';
      } else {
        section.style.display = 'none';
        toggle.textContent = '▶';
      }
    }

    // 更新端点配置（统一函数，用于初始化和切换）
    // 直接挂载到window对象，确保HTML中的onchange可以调用
    window.updateEndpointConfig = function() {
      console.log('updateEndpointConfig called!');
      try {
        const endpointEl = document.getElementById('apiEndpoint');
        if (!endpointEl) {
          console.error('apiEndpoint element not found');
          return;
        }

        const endpoint = endpointEl.value;
        console.log('Selected endpoint:', endpoint);

        if (!endpoint) {
          console.warn('No endpoint selected');
          return;
        }

        if (!apiEndpoints || !apiEndpoints[endpoint]) {
          console.error('Unknown endpoint:', endpoint, 'Available:', apiEndpoints ? Object.keys(apiEndpoints) : 'apiEndpoints not defined');
          return;
        }

        const config = apiEndpoints[endpoint];
        console.log('Config for endpoint:', config);

        // 更新请求体
        const bodyEl = document.getElementById('requestBody');
        if (bodyEl) {
          if (config.defaultBody) {
            bodyEl.value = JSON.stringify(config.defaultBody, null, 2);
            console.log('Updated body with defaultBody');
          } else {
            bodyEl.value = '{}';
            console.log('Updated body to empty object');
          }
        } else {
          console.error('requestBody element not found');
        }

        console.log('Endpoint config updated successfully');
      } catch (error) {
        console.error('Error updating endpoint config:', error);
      }
    };

    // 复制当前URL（挂载到window对象以便HTML调用）
    window.copyCurrentUrl = function() {
      try {
        const endpointEl = document.getElementById('apiEndpoint');
        if (!endpointEl) {
          console.error('apiEndpoint element not found');
          return;
        }

        const endpoint = endpointEl.value;
        if (!apiEndpoints || !apiEndpoints[endpoint]) {
          console.error('Unknown endpoint:', endpoint);
          return;
        }

        const config = apiEndpoints[endpoint];
        const url = config.url;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(url).then(function() {
          const copyBtn = document.getElementById('copyUrlBtn');
          if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = currentLang === 'zh' ? '已复制' : 'Copied';
            copyBtn.classList.add('bg-primary/20', 'border-primary');
            setTimeout(function() {
              copyBtn.textContent = originalText;
              copyBtn.classList.remove('bg-primary/20', 'border-primary');
            }, 2000);
          }
        }).catch(function(err) {
          console.error('Failed to copy URL:', err);
          alert(currentLang === 'zh' ? '复制失败，请手动复制' : 'Copy failed, please copy manually');
        });
      } catch (error) {
        console.error('Error copying URL:', error);
      }
    };

    // 加载示例（保持向后兼容）
    function loadExample() {
      if (window.updateEndpointConfig) {
        window.updateEndpointConfig();
      } else {
        console.warn('updateEndpointConfig not available yet');
      }
    }

    // 设置 API 端点监听器（多种方式确保兼容性）
    function setupApiEndpointListener() {
      console.log('Setting up API endpoint listener...');

      // 方式1: 使用事件委托，在document上监听，避免元素不存在的问题
      document.addEventListener('change', function(e) {
        const target = e.target;
        if (target && target.id === 'apiEndpoint') {
          console.log('Endpoint changed (delegated):', target.value);
          if (window.updateEndpointConfig) {
            window.updateEndpointConfig();
          } else {
            console.error('updateEndpointConfig not found on window!');
          }
        }
      });

      // 方式2: 尝试直接在元素上添加事件监听器
      // 使用 MutationObserver 等待元素出现
      const observer = new MutationObserver(function(mutations, obs) {
        const endpointEl = document.getElementById('apiEndpoint');
        if (endpointEl) {
          console.log('Found apiEndpoint element, adding direct listener');
          endpointEl.addEventListener('change', function() {
            console.log('Endpoint changed (direct):', this.value);
            if (window.updateEndpointConfig) {
              window.updateEndpointConfig();
            }
          });
          // 找到元素后停止观察
          obs.disconnect();
        }
      });

      // 开始观察 document.body 的子元素变化
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        // 如果 body 还不存在，等待 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
          const endpointEl = document.getElementById('apiEndpoint');
          if (endpointEl) {
            console.log('Found apiEndpoint after DOMContentLoaded');
            endpointEl.addEventListener('change', function() {
              console.log('Endpoint changed (DOMContentLoaded):', this.value);
              if (window.updateEndpointConfig) {
                window.updateEndpointConfig();
              }
            });
          }
        });
      }

      console.log('API endpoint listener setup complete');
    }

    // 发送请求
    async function sendRequest() {
      const endpointEl = document.getElementById('apiEndpoint');
      const authEnabledEl = document.getElementById('authEnabled');
      const authTokenEl = document.getElementById('authToken');
      const bodyTextEl = document.getElementById('requestBody');
      const sendBtn = document.getElementById('sendBtn');
      const responsePlaceholder = document.getElementById('responsePlaceholder');
      const responseContent = document.getElementById('responseContent');
      const responseBody = document.getElementById('responseBody');
      const responseStatus = document.getElementById('responseStatus');
      const responseTime = document.getElementById('responseTime');

      if (!endpointEl || !authEnabledEl || !authTokenEl || !bodyTextEl || !sendBtn) {
        console.error('Required DOM elements not found');
        return;
      }

      const endpoint = endpointEl.value;
      if (!apiEndpoints || !apiEndpoints[endpoint]) {
        console.error('Unknown endpoint:', endpoint);
        return;
      }

      const config = apiEndpoints[endpoint];
      const method = config.method;
      const url = config.url;
      const authEnabled = authEnabledEl.checked;
      const authToken = authTokenEl.value || '';
      const bodyText = bodyTextEl.value || '';

      // 检查 API key 是否完整（不能包含 ...）
      if (authEnabled && authToken && authToken.includes('...')) {
        responsePlaceholder.style.display = 'none';
        responseContent.classList.remove('hidden');
        responseStatus.textContent = 'Error';
        responseStatus.className = 'method-badge delete';
        responseTime.textContent = '0ms';
        responseBody.textContent = 'Error: Please enter the full API key. The key cannot contain "...". If you selected an API key from the dropdown, make sure you have the complete key saved in localStorage.';
        responseBody.style.color = '#ef4444';
        sendBtn.classList.remove('loading');
        sendBtn.textContent = t('send');
        return;
      }

      // 显示加载状态
      sendBtn.classList.add('loading');
      sendBtn.textContent = t('sending');
      responsePlaceholder.style.display = 'none';
      responseContent.classList.remove('hidden');

      const startTime = Date.now();

      try {
        // 构建 headers
        const headers = {
          'Content-Type': 'application/json'
        };

        if (authEnabled && authToken && authToken.trim()) {
          headers['Authorization'] = 'Bearer ' + authToken.trim();
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
        const contentType = response.headers?.get('content-type');
        if (contentType && typeof contentType === 'string' && contentType.includes('application/json')) {
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
        const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : String(error);
        responseBody.textContent = 'Error: ' + errorMessage;
        responseBody.style.color = '#ef4444';
      } finally {
        sendBtn.classList.remove('loading');
        sendBtn.textContent = t('send');
      }
    }

    // 存储 API keys 列表
    let apiKeysList = [];

    // 初始化界面文本（根据语言）
    function initUIText() {
      const selectEl = document.getElementById('apiKeySelect');
      const inputEl = document.getElementById('authToken');

      if (selectEl && selectEl.options.length > 0) {
        selectEl.options[0].textContent = '-- ' + t('selectApiKey') + ' --';
      }

      if (inputEl) {
        inputEl.placeholder = currentLang === 'zh' ? '输入 API Key (nm_live_...)' : 'Enter API Key (nm_live_...)';
      }
    }

    // 当 API key 下拉框选择改变时
    function onApiKeySelectChange() {
      const selectEl = document.getElementById('apiKeySelect');
      const inputEl = document.getElementById('authToken');

      if (!selectEl || !inputEl) return;

      const selectedValue = selectEl.value;

      if (selectedValue) {
        // 尝试从 localStorage 获取对应的完整 API key
        const savedKey = localStorage.getItem('nichedigger_api_key_' + selectedValue);
        if (savedKey) {
          inputEl.value = savedKey;
          inputEl.type = 'password';
        } else {
          // 如果没有保存的完整 key，显示 keyPrefix 并提示用户
          const selectedKey = apiKeysList.find(function(k) { return k.id === selectedValue; });
          if (selectedKey) {
            inputEl.value = selectedKey.keyPrefix + '...';
            inputEl.type = 'text';
            inputEl.placeholder = t('pleaseEnterFullKey');
          }
        }
      } else {
        inputEl.value = '';
        inputEl.type = 'text';
      }
    }

    // 检查用户登录状态并获取 API Key
    async function checkUserAndLoadApiKey() {
      console.log('checkUserAndLoadApiKey called');
      try {
        // 检查用户是否登录
        console.log('Checking user session...');
        const sessionResponse = await fetch(baseUrl + '/api/auth/session', {
          method: 'GET',
          credentials: 'include'
        });
        
        console.log('Session response status:', sessionResponse.status);
        
        if (!sessionResponse.ok) {
          console.log('Session check failed, user not authenticated');
          return;
        }
        
        const sessionData = await sessionResponse.json();
        console.log('Session data:', sessionData);
        
        if (!sessionData.authenticated || !sessionData.user) {
          console.log('User not authenticated');
          return;
        }
        
        // 用户已登录，尝试获取 API keys
        try {
          console.log('Fetching API keys...');
          // 获取 API keys（使用 cookie 中的 JWT token）
          const apiKeysResponse = await fetch(baseUrl + '/api/v1/api-keys', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('API keys response status:', apiKeysResponse.status);
          
          if (apiKeysResponse.ok) {
            const apiKeysData = await apiKeysResponse.json();
            
            if (apiKeysData.success && apiKeysData.data && apiKeysData.data.apiKeys && apiKeysData.data.apiKeys.length > 0) {
              // 保存 API keys 列表
              apiKeysList = apiKeysData.data.apiKeys;

              // 获取DOM元素
              const selectEl = document.getElementById('apiKeySelect');
              const inputEl = document.getElementById('authToken');
              const statusDiv = document.getElementById('apiKeyStatus');
              const createBtn = document.getElementById('createApiKeyBtn');

              if (selectEl) {
                // 清空现有选项
                selectEl.innerHTML = '<option value="">-- ' + t('selectApiKey') + ' --</option>';

                // 添加所有活跃的 API keys
                apiKeysList.forEach(function(key) {
                  if (key.isActive) {
                    const option = document.createElement('option');
                    option.value = key.id;
                    option.textContent = key.keyPrefix + '... (' + (key.name || t('unnamed')) + ')';
                    selectEl.appendChild(option);
                  }
                });

                // 显示下拉框
                selectEl.classList.remove('hidden');

                // 自动选中第一个可用的API key
                const activeKey = apiKeysList.find(function(key) { return key.isActive; }) || apiKeysList[0];
                
                if (activeKey && activeKey.id) {
                  // 自动选中第一个API key
                  if (selectEl) {
                    selectEl.value = activeKey.id;
                  }

                  // 尝试从localStorage获取该key的完整值（如果之前在这个浏览器创建过）
                  const savedKeyById = localStorage.getItem('nichedigger_api_key_' + activeKey.id);
                  const savedApiKey = localStorage.getItem('nichedigger_api_key');
                  
                  // 优先使用对应ID的key，如果没有则使用通用key
                  let foundKey = false;
                  if (savedKeyById && savedKeyById.startsWith('nm_live_')) {
                    // 找到了对应ID的完整key
                    if (inputEl) {
                      inputEl.value = savedKeyById;
                      inputEl.type = 'password';
                    }
                    foundKey = true;
                  } else if (savedApiKey && savedApiKey.startsWith('nm_live_')) {
                    // 使用通用的保存key（可能是之前创建的）
                    if (inputEl) {
                      inputEl.value = savedApiKey;
                      inputEl.type = 'password';
                    }
                    foundKey = true;
                  } else {
                    // 没有保存的完整key，显示前缀提示用户输入
                    if (inputEl) {
                      inputEl.value = activeKey.keyPrefix + '...';
                      inputEl.type = 'text';
                      inputEl.placeholder = t('pleaseEnterFullKey');
                    }
                  }

                  // 显示状态信息
                  if (statusDiv) {
                    if (foundKey) {
                      statusDiv.textContent = t('detectedApiKeys') + ' ' + apiKeysData.data.count + ' ' + t('apiKeys') + ' ' + t('apiKeyLoaded');
                      statusDiv.classList.remove('hidden');
                      statusDiv.classList.add('text-primary');
                    } else {
                      statusDiv.textContent = t('detectedApiKeys') + ' ' + apiKeysData.data.count + ' ' + t('apiKeys') + ' - ' + t('pleaseSelectOrCreate');
                      statusDiv.classList.remove('hidden');
                      statusDiv.classList.add('text-accent-yellow');
                    }
                  }
                } else {
                  // 没有可用的API key
                  if (statusDiv) {
                    statusDiv.textContent = t('noApiKey');
                    statusDiv.classList.remove('hidden');
                    statusDiv.classList.add('text-accent-yellow');
                  }
                }

                // 显示创建新按钮
                if (createBtn) {
                  createBtn.classList.remove('hidden');
                  createBtn.textContent = t('createNewApiKey');
                }
              }
            } else {
              // 没有 API key，显示创建按钮
              showCreateApiKeyButton();
            }
          } else if (apiKeysResponse.status === 401) {
            // 未授权，可能 token 过期，不显示创建按钮
            console.log('API keys request returned 401, user may not be authenticated');
            return;
          } else {
            // 其他错误，尝试显示创建按钮
            console.log('API keys request failed with status:', apiKeysResponse.status);
            const errorText = await apiKeysResponse.text();
            console.log('API keys error response:', errorText);
            showCreateApiKeyButton();
          }
        } catch (error) {
          console.error('Error fetching API keys:', error);
          console.error('Error details:', error.message, error.stack);
          // 网络错误等，不显示创建按钮
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        console.error('Error details:', error.message, error.stack);
      }
    }
    
    // 显示创建 API Key 按钮
    function showCreateApiKeyButton() {
      const createBtn = document.getElementById('createApiKeyBtn');
      const statusDiv = document.getElementById('apiKeyStatus');
      
      if (createBtn) {
        createBtn.classList.remove('hidden');
        createBtn.textContent = t('createApiKey');
      }
      
      if (statusDiv) {
        statusDiv.textContent = t('noApiKey');
        statusDiv.classList.remove('hidden');
        statusDiv.classList.remove('text-text-secondary');
        statusDiv.classList.add('text-accent-yellow');
      }
    }
    
    // 创建 API Key
    async function createApiKey() {
      const createBtn = document.getElementById('createApiKeyBtn');
      const statusDiv = document.getElementById('apiKeyStatus');
      const authTokenInput = document.getElementById('authToken');
      
      if (createBtn && createBtn instanceof HTMLButtonElement) {
        createBtn.disabled = true;
        createBtn.textContent = t('creating');
      }
      
      try {
        // 获取 API key 名称
        const name = prompt(t('inputApiKeyName')) || 'API Test Key';
        
        if (name === null) {
          // 用户取消了
          if (createBtn && createBtn instanceof HTMLButtonElement) {
            createBtn.disabled = false;
            const currentText = createBtn.textContent || '';
            createBtn.textContent = currentText.includes('New') || currentText.includes('新') ? t('createNewApiKey') : t('createApiKey');
          }
          return;
        }
        
        // 创建 API key（使用 cookie 中的认证信息）
        const response = await fetch(baseUrl + '/api/v1/api-keys', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim() || 'API Test Key'
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || t('createFailed'));
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.apiKey) {
          const apiKey = data.data.apiKey;
          const apiKeyId = data.data.id;

          // 保存到 localStorage（通用 key 和带 ID 的 key）
          try {
            localStorage.setItem('nichedigger_api_key', apiKey);
            if (apiKeyId) {
              localStorage.setItem('nichedigger_api_key_' + apiKeyId, apiKey);
            }
          } catch (e) {
            console.warn('Failed to save API key to localStorage:', e);
          }

          // 自动填入 API key
          if (authTokenInput && authTokenInput instanceof HTMLInputElement) {
            authTokenInput.value = apiKey;
            authTokenInput.type = 'password'; // 默认隐藏完整 key
            authTokenInput.title = t('apiKeyAutoFilled');

            // 添加双击显示/隐藏功能
            try {
              const existingHandler = authTokenInput.getAttribute('data-dblclick-handler');
              if (!existingHandler && authTokenInput) {
                authTokenInput.addEventListener('dblclick', function() {
                  if (this.type === 'password') {
                    this.type = 'text';
                    var self = this;
                    setTimeout(function() {
                      if (self instanceof HTMLInputElement) {
                        self.type = 'password';
                      }
                    }, 5000);
                  } else {
                    this.type = 'password';
                  }
                });
                authTokenInput.setAttribute('data-dblclick-handler', 'true');
              }
            } catch (e) {
              console.warn('Failed to add double-click handler:', e);
            }
          }

          // 更新状态
          if (statusDiv) {
            statusDiv.textContent = '✓ ' + t('apiKeyCreated') + ' ' + data.data.keyPrefix + '... (' + (data.data.name || t('unnamed')) + ')';
            statusDiv.classList.remove('text-accent-yellow', 'text-red-500');
            statusDiv.classList.add('text-primary');
          }

          // 更新下拉框（如果有新的 API key）
          if (apiKeyId) {
            const selectEl = document.getElementById('apiKeySelect');
            if (selectEl) {
              // 添加新创建的 API key 到下拉框
              const option = document.createElement('option');
              option.value = apiKeyId;
              option.textContent = data.data.keyPrefix + '... (' + (data.data.name || t('unnamed')) + ')';
              selectEl.appendChild(option);

              // 选中新创建的 API key
              selectEl.value = apiKeyId;

              // 显示下拉框（如果之前隐藏的话）
              selectEl.classList.remove('hidden');
            }
          }

          // 更新创建按钮
          if (createBtn) {
            createBtn.textContent = t('createNewApiKey');
            createBtn.disabled = false;
          }
          
          // 显示成功提示
          const confirmMsg = t('apiKeyCreatedSuccess') + '\n\n' +
            '⚠️ ' + t('importantNote') + '\n' +
            '1. ' + t('keyShownOnce') + '\n' +
            '2. ' + t('doubleClickToView') + '\n' +
            '3. ' + t('copyToSafe') + '\n\n' +
            t('copyToClipboard');
          
          if (confirm(confirmMsg) && authTokenInput) {
            try {
              await navigator.clipboard.writeText(authTokenInput.value);
              alert('✓ ' + t('apiKeyCopied'));
            } catch (e) {
              // 复制失败，手动选择
              authTokenInput.select();
              document.execCommand('copy');
              alert('✓ ' + t('apiKeySelected'));
            }
          }
        } else {
          throw new Error(t('responseFormatError'));
        }
      } catch (error) {
        console.error('Error creating API key:', error);
        
        let errorMsg = t('createFailed');
        const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : String(error);
        if (errorMessage) {
          if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
            errorMsg = t('createFailedLogin');
          } else if (errorMessage.includes('limit')) {
            errorMsg = t('createFailedLimit');
          } else {
            errorMsg = t('createFailedError') + errorMessage;
          }
        }
        
        alert(errorMsg);
        
        if (createBtn && createBtn instanceof HTMLButtonElement) {
          createBtn.disabled = false;
          const currentText = createBtn.textContent || '';
          createBtn.textContent = currentText.includes('New') || currentText.includes('新') ? t('createNewApiKey') : t('createApiKey');
        }
        
        if (statusDiv) {
          statusDiv.textContent = errorMsg;
          statusDiv.classList.remove('text-primary', 'text-text-secondary');
          statusDiv.classList.add('text-red-500');
        }
      }
    }
    
    // 初始化
    function initializePage() {
      try {
        console.log('Initializing page...');
        console.log('updateEndpointConfig available:', typeof window.updateEndpointConfig);
        console.log('DOM ready state:', document.readyState);

        initUIText();
        setupApiEndpointListener();

        // 立即执行一次，确保初始配置正确
        if (window.updateEndpointConfig) {
          window.updateEndpointConfig();
          console.log('Initial endpoint config loaded');
        }

        // 确保DOM元素存在后再调用
        const authTokenEl = document.getElementById('authToken');
        const apiKeySelectEl = document.getElementById('apiKeySelect');
        console.log('DOM elements check - authToken:', !!authTokenEl, 'apiKeySelect:', !!apiKeySelectEl);
        
        // 延迟一点确保DOM完全渲染
        setTimeout(function() {
          console.log('Calling checkUserAndLoadApiKey...');
          checkUserAndLoadApiKey();
        }, 100);
        
        console.log('Page initialization complete');
      } catch (error) {
        console.error('Error initializing page:', error);
      }
    }

    // 页面加载完成后初始化
    function startInitialization() {
      console.log('startInitialization called, readyState:', document.readyState);
      if (document.readyState === 'loading') {
        console.log('Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', function() {
          console.log('DOMContentLoaded fired');
          initializePage();
        });
      } else {
        // DOM 已经加载完成，直接执行
        console.log('DOM already loaded, initializing immediately');
        initializePage();
      }
    }
    
    // 立即尝试初始化
    startInitialization();
    
    // 也监听window.onload作为备用
    window.addEventListener('load', function() {
      console.log('Window load event fired');
      // 如果之前没有成功初始化，再次尝试
      const authTokenEl = document.getElementById('authToken');
      if (authTokenEl && !authTokenEl.value) {
        console.log('Retrying checkUserAndLoadApiKey on window load');
        checkUserAndLoadApiKey();
      }
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
              ${t(lang, 'headerTitle')}
            </h1>
            <p class="text-sm text-text-tertiary font-mono">
              ${t(lang, 'headerSubtitle')}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <a href="?lang=zh" class="px-2 py-1 text-xs font-mono ${isZh ? 'text-primary border border-primary' : 'text-text-tertiary hover:text-text-primary'}">中文</a>
            <span class="text-text-tertiary">|</span>
            <a href="?lang=en" class="px-2 py-1 text-xs font-mono ${!isZh ? 'text-primary border border-primary' : 'text-text-tertiary hover:text-text-primary'}">English</a>
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
              ${t(lang, 'toc')}
            </h3>
            <ul>
              <li><a href="#overview">${t(lang, 'overview')}</a></li>
              <li><a href="#authentication">${t(lang, 'authentication')}</a></li>
              <li><a href="#endpoints">${t(lang, 'endpoints')}</a></li>
              <li><a href="#modes">${t(lang, 'modes')}</a></li>
              <li><a href="#workflows">${t(lang, 'workflows')}</a></li>
              <li><a href="#credits">${t(lang, 'credits')}</a></li>
              <li><a href="#errors">${t(lang, 'errors')}</a></li>
              <li><a href="#examples">${t(lang, 'examples')}</a></li>
              <li><a href="#test">${t(lang, 'test')}</a></li>
              <li><a href="#languages">${t(lang, 'languages')}</a></li>
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
                  sys_module // ${t(lang, 'overview')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'overview')}
              </h2>
              <p class="text-text-secondary mb-4">
                ${t(lang, 'overviewDesc')}
              </p>
              <ul class="list-none space-y-2 mb-6">
                <li class="flex items-start gap-2">
                  <span class="text-primary font-mono">/</span>
                  <span class="text-text-secondary">
                    <strong class="text-text-primary">${t(lang, 'keywordMining')}</strong> (keyword_mining) - ${t(lang, 'keywordMiningDesc')}
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-mono">/</span>
                  <span class="text-text-secondary">
                    <strong class="text-text-primary">${t(lang, 'batchTranslation')}</strong> (batch_translation) - ${t(lang, 'batchTranslationDesc')}
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-mono">/</span>
                  <span class="text-text-secondary">
                    <strong class="text-text-primary">${t(lang, 'deepDive')}</strong> (deep_dive) - ${t(lang, 'deepDiveDesc')}
                  </span>
                </li>
              </ul>
              <div class="info-box">
                <p class="text-sm text-text-primary font-mono mb-2">
                  <strong>${t(lang, 'baseUrl')}</strong> <span class="text-primary">${baseUrl}/api/v1</span>
                </p>
                <p class="text-sm text-text-primary font-mono mb-2">
                  <strong>${t(lang, 'contentType')}</strong> <span class="text-primary">application/json</span>
                </p>
                <p class="text-sm text-text-primary font-mono">
                  <strong>${t(lang, 'cors')}</strong> <span class="text-primary">${t(lang, 'corsSupport')}</span>
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
                  sys_module // ${t(lang, 'authentication')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'authentication')}
              </h2>
              <p class="text-text-secondary mb-4">
                ${t(lang, 'authDesc')} <code class="text-primary">Authorization</code> ${t(lang, 'authHeader')}
              </p>
              
              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-6">${t(lang, 'apiKeyRecommended')}</h3>
              <div class="code-block">
                <code>Authorization: Bearer nm_live_&lt;your_api_key&gt;</code>
              </div>
              <p class="text-text-secondary mt-3 mb-4">
                ${t(lang, 'apiKeyDesc')}
              </p>

              <div class="warning-box mt-6">
                <p class="text-sm text-text-primary font-mono">
                  <strong>${t(lang, 'note')}</strong> ${t(lang, 'authWarning')}
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
                  sys_module // ${t(lang, 'endpoints')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'mainEndpoints')}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>${t(lang, 'endpoint')}</th>
                    <th>${t(lang, 'method')}</th>
                    <th>${t(lang, 'description')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">/api/v1/seo-agent</code></td>
                    <td>POST</td>
                    <td>${t(lang, 'seoAgentMain')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">/api/v1/workflows</code></td>
                    <td>GET</td>
                    <td>${t(lang, 'getWorkflows')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">/api/v1/workflow-configs</code></td>
                    <td>POST</td>
                    <td>${t(lang, 'createWorkflowConfig')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">/api/v1/workflow-configs</code></td>
                    <td>GET</td>
                    <td>${t(lang, 'getWorkflowConfigs')}</td>
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
                  sys_module // ${t(lang, 'modes')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'modes')}
              </h2>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-6">${t(lang, 'mode1')}</h3>
              <p class="text-text-secondary mb-4">
                ${t(lang, 'mode1Desc')}
              </p>
              
              <h4 class="text-md font-bold text-text-primary font-mono mb-3">${t(lang, 'requestParams')}</h4>
              <table>
                <thead>
                  <tr>
                    <th>${t(lang, 'param')}</th>
                    <th>${t(lang, 'type')}</th>
                    <th>${t(lang, 'required')}</th>
                    <th>${t(lang, 'defaultValue')}</th>
                    <th>${t(lang, 'paramDesc')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">mode</code></td>
                    <td>string</td>
                    <td><span class="badge required">${t(lang, 'required')}</span></td>
                    <td>-</td>
                    <td>${t(lang, 'mustBe')} "keyword_mining"</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">seedKeyword</code></td>
                    <td>string</td>
                    <td><span class="badge required">${t(lang, 'required')}</span></td>
                    <td>-</td>
                    <td>${t(lang, 'seedKeyword')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">systemInstruction</code></td>
                    <td>string</td>
                    <td><span class="badge required">${t(lang, 'required')}</span></td>
                    <td>-</td>
                    <td>${t(lang, 'systemInstruction')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">targetLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>"en"</td>
                    <td>${t(lang, 'targetLanguage')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">existingKeywords</code></td>
                    <td>string[]</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>[]</td>
                    <td>${t(lang, 'existingKeywords')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">roundIndex</code></td>
                    <td>number</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>1</td>
                    <td>${t(lang, 'roundIndex')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">wordsPerRound</code></td>
                    <td>number</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>10</td>
                    <td>${t(lang, 'wordsPerRound')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">miningStrategy</code></td>
                    <td>string</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>"horizontal"</td>
                    <td>${t(lang, 'miningStrategy')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">userSuggestion</code></td>
                    <td>string</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>""</td>
                    <td>${t(lang, 'userSuggestion')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">uiLanguage</code></td>
                    <td>string</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>"en"</td>
                    <td>${t(lang, 'uiLanguage')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">analyzeRanking</code></td>
                    <td>boolean</td>
                    <td><span class="badge optional">${t(lang, 'optional')}</span></td>
                    <td>true</td>
                    <td>${t(lang, 'analyzeRanking')}</td>
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

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-8">${t(lang, 'mode2')}</h3>
              <p class="text-text-secondary mb-4">
                ${t(lang, 'mode2Desc')}
              </p>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3">${t(lang, 'requestParams')}</h4>
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

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3 mt-8">${t(lang, 'mode3')}</h3>
              <p class="text-text-secondary mb-4">
                ${t(lang, 'mode3Desc')}
              </p>

              <h4 class="text-md font-bold text-text-primary font-mono mb-3">${t(lang, 'requestParams')}</h4>
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
                <strong>${t(lang, 'keywordObjectFormat')}</strong>
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

              <h4 class="text-md font-bold text-text-primary font-mono mb-3 mt-6">${t(lang, 'requestExample')}</h4>
              <p class="text-text-secondary mb-2 font-mono text-sm">${t(lang, 'useObjectFormat')}</p>
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
              <p class="text-text-secondary mb-2 font-mono text-sm">${t(lang, 'orUseSimpleFormat')}</p>
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
                  sys_module // ${t(lang, 'creditsRules')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'creditsRules')}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>${t(lang, 'mode')}</th>
                    <th>${t(lang, 'baseCost')}</th>
                    <th>${t(lang, 'calculation')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="text-primary">keyword_mining</code></td>
                    <td>20 Credits</td>
                    <td>${t(lang, 'per10Keywords')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">batch_translation</code></td>
                    <td>20 Credits</td>
                    <td>${t(lang, 'per10Keywords')}</td>
                  </tr>
                  <tr>
                    <td><code class="text-primary">deep_dive</code></td>
                    <td>30 Credits</td>
                    <td>${t(lang, 'fixed30Credits')}</td>
                  </tr>
                </tbody>
              </table>
              <div class="warning-box mt-6">
                <p class="text-sm text-text-primary font-mono">
                  <strong>${t(lang, 'note')}</strong> ${t(lang, 'creditsWarning')}
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
                  sys_module // ${t(lang, 'errorCodes')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'errorCodes')}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>${t(lang, 'httpStatus')}</th>
                    <th>${t(lang, 'errorType')}</th>
                    <th>${t(lang, 'description')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>401</td>
                    <td>Unauthorized</td>
                    <td>${t(lang, 'missingAuth')}</td>
                  </tr>
                  <tr>
                    <td>402</td>
                    <td>Payment Required</td>
                    <td>${t(lang, 'insufficientCredits')}</td>
                  </tr>
                  <tr>
                    <td>400</td>
                    <td>Bad Request</td>
                    <td>${t(lang, 'badRequest')}</td>
                  </tr>
                  <tr>
                    <td>405</td>
                    <td>Method Not Allowed</td>
                    <td>${t(lang, 'methodNotAllowed')}</td>
                  </tr>
                  <tr>
                    <td>500</td>
                    <td>Internal Server Error</td>
                    <td>${t(lang, 'serverError')}</td>
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
                  sys_module // ${t(lang, 'usageExamples')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'usageExamples')}
              </h2>

              <h3 class="text-lg font-bold text-text-primary font-mono mb-3">JavaScript/TypeScript</h3>
              <div class="code-block">
                <code>async function callSEOAgent(mode, params, apiKey) {<br>
  const response = await fetch("${baseUrl}/api/v1/seo-agent", {<br>
    method: "POST",<br>
    headers: {<br>
      "Content-Type": "application/json",<br>
      Authorization: &#96;Bearer &#36;{apiKey}&#96;,<br>
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
                  sys_module // ${t(lang, 'test')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'onlineTest')}
              </h2>
              <p class="text-text-secondary mb-6">
                ${t(lang, 'onlineTestDesc')}
              </p>

              <!-- Method and URL -->
              <div class="mb-6">
                <label class="block text-sm font-bold text-text-primary font-mono mb-2">
                  ${t(lang, 'requestMethodUrl')}
                </label>
                <div class="flex items-center gap-2">
                  <select id="apiEndpoint" class="flex-1 bg-background border border-border text-text-primary font-mono px-3 py-3 focus:outline-none focus:border-primary" onchange="window.updateEndpointConfig && window.updateEndpointConfig()">
                    <option value="seo-agent">POST https://www.nichedigger.ai/api/v1/seo-agent</option>
                    <option value="workflows">GET https://www.nichedigger.ai/api/v1/workflows</option>
                    <option value="workflow-configs">GET https://www.nichedigger.ai/api/v1/workflow-configs</option>
                    <option value="workflow-configs-create">POST https://www.nichedigger.ai/api/v1/workflow-configs</option>
                  </select>
                  <button id="copyUrlBtn" onclick="window.copyCurrentUrl && window.copyCurrentUrl()" 
                    class="px-4 py-3 bg-background border border-border text-text-primary font-mono text-sm hover:bg-surface hover:border-primary transition-colors" 
                    title="${isZh ? '复制URL' : 'Copy URL'}">
                    ${isZh ? '复制' : 'Copy'}
                  </button>
                  <button id="sendBtn" onclick="sendRequest()" 
                    class="px-6 py-3 bg-primary text-black font-mono font-bold hover:bg-primary/80 transition-colors">
                    ${t(lang, 'send')}
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
                    <select id="apiKeySelect" class="bg-background border border-border text-text-primary font-mono px-3 py-1 text-sm focus:outline-none focus:border-primary hidden" onchange="onApiKeySelectChange()">
                      <option value="">-- Select API Key --</option>
                    </select>
                    <input type="text" id="authToken" placeholder="Enter API Key (nm_live_...)"
                      class="flex-1 bg-background border border-border text-text-primary font-mono px-3 py-1 text-sm focus:outline-none focus:border-primary" />
                    <button id="createApiKeyBtn" onclick="createApiKey()"
                      class="px-3 py-1 bg-primary/20 border border-primary/30 text-primary font-mono text-xs hover:bg-primary/30 transition-colors hidden">
                      ${t(lang, 'createApiKey')}
                    </button>
                  </div>
                  <div id="apiKeyStatus" class="text-xs font-mono text-text-tertiary hidden"></div>
                </div>
              </div>

              <!-- Body -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <label class="text-sm font-bold text-text-primary font-mono">
                      ${t(lang, 'body')}
                    </label>
                    <select id="bodyType" class="bg-background border border-border text-text-primary font-mono px-2 py-1 text-sm">
                      <option value="json">JSON</option>
                    </select>
                    <button onclick="loadExample()" class="text-text-tertiary hover:text-text-primary text-sm font-mono">
                      ${t(lang, 'example')} ▼
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
                    ${t(lang, 'response')}
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
                    <p class="font-mono text-sm">${t(lang, 'clickSend')}</p>
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
                  sys_module // ${t(lang, 'languages')}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold text-text-primary font-mono uppercase tracking-tight mb-4">
                ${t(lang, 'supportedLanguages')}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>${t(lang, 'code')}</th>
                    <th>${t(lang, 'language')}</th>
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
  } catch (error) {
    console.error('Error generating API docs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to generate API documentation',
      message: errorMessage
    });
  }
}

