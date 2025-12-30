import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { Copy, Send, ChevronDown, ChevronUp } from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  apiKey?: string;
  isActive: boolean;
}

interface APIEndpoint {
  value: string;
  method: string;
  url: string;
  label: string;
  defaultBody?: any;
}

const APIDocs: React.FC = () => {
  const { authenticated, getToken } = useAuth();
  const { lang } = useContext(LanguageContext);
  const isZh = lang === "cn";

  const baseUrl = "https://www.nichedigger.ai";

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("seo-agent");
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [authEnabled, setAuthEnabled] = useState<boolean>(true);
  const [requestBody, setRequestBody] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sections, setSections] = useState<{ [key: string]: boolean }>({
    headers: true,
    body: true,
    response: true,
  });

  const apiEndpoints: { [key: string]: APIEndpoint } = {
    "seo-agent": {
      value: "seo-agent",
      method: "POST",
      url: `${baseUrl}/api/v1/seo-agent`,
      label: `POST https://www.nichedigger.ai/api/v1/seo-agent`,
      defaultBody: {
        mode: "keyword_mining",
        seedKeyword: "coffee shop",
        systemInstruction: "Generate high-potential SEO keywords.",
        targetLanguage: "ko",
        wordsPerRound: 10,
        analyzeRanking: true,
      },
    },
    workflows: {
      value: "workflows",
      method: "GET",
      url: `${baseUrl}/api/v1/workflows`,
      label: `GET https://www.nichedigger.ai/api/v1/workflows`,
    },
    "workflow-configs": {
      value: "workflow-configs",
      method: "GET",
      url: `${baseUrl}/api/v1/workflow-configs`,
      label: `GET https://www.nichedigger.ai/api/v1/workflow-configs`,
    },
    "workflow-configs-create": {
      value: "workflow-configs-create",
      method: "POST",
      url: `${baseUrl}/api/v1/workflow-configs`,
      label: `POST https://www.nichedigger.ai/api/v1/workflow-configs`,
      defaultBody: {
        workflowId: "mining",
        name: "My Custom Config",
        nodes: [
          {
            id: "mining-gen",
            type: "agent",
            name: "Keyword Generation Agent",
            prompt:
              "Generate high-potential SEO keywords focusing on commercial intent.",
          },
        ],
      },
    },
    "workflow-configs-get": {
      value: "workflow-configs-get",
      method: "GET",
      url: `${baseUrl}/api/v1/workflow-configs/mining-1234567890-abc123`,
      label: `GET https://www.nichedigger.ai/api/v1/workflow-configs/{id}`,
    },
    "workflow-configs-update": {
      value: "workflow-configs-update",
      method: "PUT",
      url: `${baseUrl}/api/v1/workflow-configs/mining-1234567890-abc123`,
      label: `PUT https://www.nichedigger.ai/api/v1/workflow-configs/{id}`,
      defaultBody: {
        name: "Updated Config Name",
        nodes: [
          {
            id: "mining-gen",
            type: "agent",
            name: "Keyword Generation Agent",
            prompt: "Updated prompt here...",
          },
        ],
      },
    },
    "workflow-configs-delete": {
      value: "workflow-configs-delete",
      method: "DELETE",
      url: `${baseUrl}/api/v1/workflow-configs/mining-1234567890-abc123`,
      label: `DELETE https://www.nichedigger.ai/api/v1/workflow-configs/{id}`,
    },
  };

  // 获取API keys
  useEffect(() => {
    console.log("APIDocs: useEffect triggered", { authenticated });

    const fetchApiKeys = async () => {
      console.log("APIDocs: fetchApiKeys called", { authenticated });

      if (!authenticated) {
        console.log("APIDocs: User not authenticated, skipping API keys fetch");
        return;
      }

      try {
        const token = getToken();
        console.log("APIDocs: Got token", { hasToken: !!token });

        if (!token) {
          console.log("APIDocs: No token available");
          return;
        }

        console.log("APIDocs: Fetching API keys from /api/v1/api-keys");
        const response = await fetch("/api/v1/api-keys", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("APIDocs: API keys response", {
          status: response.status,
          ok: response.ok,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("APIDocs: API keys data", data);
          const keys = data.data?.apiKeys || [];
          const activeKeys = keys.filter((k: APIKey) => k.isActive);
          console.log("APIDocs: Active keys", activeKeys);
          setApiKeys(activeKeys);

          // 自动选中第一个API key
          if (keys.length > 0) {
            const firstKey = keys.find((k: APIKey) => k.isActive) || keys[0];
            console.log("APIDocs: Selected first key", firstKey);
            setSelectedApiKeyId(firstKey.id);

            // 尝试从localStorage获取完整key
            const savedKey = localStorage.getItem(
              `nichedigger_api_key_${firstKey.id}`
            );
            const savedApiKey = localStorage.getItem("nichedigger_api_key");
            if (
              savedKey &&
              savedKey.startsWith("nm_live_") &&
              !savedKey.includes("...")
            ) {
              console.log("APIDocs: Using saved key by ID");
              setAuthToken(savedKey);
            } else if (
              savedApiKey &&
              savedApiKey.startsWith("nm_live_") &&
              !savedApiKey.includes("...")
            ) {
              console.log("APIDocs: Using saved general key");
              setAuthToken(savedApiKey);
            } else {
              console.log(
                "APIDocs: No complete key found, leaving empty for user input"
              );
              // 不设置包含 ... 的值，让用户手动输入完整 key
              setAuthToken("");
            }
          } else {
            console.log("APIDocs: No API keys found");
          }
        } else {
          const errorText = await response.text();
          console.error("APIDocs: Failed to fetch API keys", {
            status: response.status,
            error: errorText,
          });
        }
      } catch (error) {
        console.error("APIDocs: Error fetching API keys:", error);
      }
    };

    fetchApiKeys();
  }, [authenticated, getToken]);

  // 当选择API key时更新token
  useEffect(() => {
    if (selectedApiKeyId) {
      const selectedKey = apiKeys.find((k) => k.id === selectedApiKeyId);
      if (selectedKey) {
        const savedKey = localStorage.getItem(
          `nichedigger_api_key_${selectedKey.id}`
        );
        if (
          savedKey &&
          savedKey.startsWith("nm_live_") &&
          !savedKey.includes("...")
        ) {
          setAuthToken(savedKey);
        } else {
          // 不设置包含 ... 的值，让用户手动输入完整 key
          setAuthToken("");
        }
      }
    }
  }, [selectedApiKeyId, apiKeys]);

  // 更新请求体
  useEffect(() => {
    const endpoint = apiEndpoints[selectedEndpoint];
    if (endpoint?.defaultBody) {
      setRequestBody(JSON.stringify(endpoint.defaultBody, null, 2));
    } else {
      setRequestBody("{}");
    }
  }, [selectedEndpoint]);

  // 复制URL
  const copyUrl = async () => {
    const endpoint = apiEndpoints[selectedEndpoint];
    if (endpoint) {
      try {
        await navigator.clipboard.writeText(endpoint.url);
        // 可以添加toast提示
      } catch (error) {
        console.error("Failed to copy URL:", error);
      }
    }
  };

  // 发送请求
  const sendRequest = async () => {
    const endpoint = apiEndpoints[selectedEndpoint];
    if (!endpoint) return;

    setLoading(true);
    setResponse(null);

    try {
      const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      // 所有接口都支持 API Key 认证
      // 确保 key 完整且不包含 ...（表示不完整的 key）
      if (
        authEnabled &&
        authToken &&
        authToken.startsWith("nm_live_") &&
        !authToken.includes("...")
      ) {
        headers["Authorization"] = `Bearer ${authToken}`;
      } else if (authEnabled && authToken && authToken.includes("...")) {
        setResponse({
          error: isZh
            ? "API Key 不完整，请输入完整的 API Key（不包含 ...）"
            : "API Key is incomplete. Please enter the complete API Key (without ...)",
        });
        setLoading(false);
        return;
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers,
      };

      if (endpoint.method === "POST" || endpoint.method === "PUT") {
        try {
          const body = JSON.parse(requestBody);
          options.body = JSON.stringify(body);
        } catch (e) {
          setResponse({
            error: `Invalid JSON in request body: ${
              e instanceof Error ? e.message : String(e)
            }`,
          });
          setLoading(false);
          return;
        }
      }

      const startTime = Date.now();
      const res = await fetch(endpoint.url, options);
      const duration = Date.now() - startTime;

      let responseData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        duration,
        data: responseData,
      });
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const currentEndpoint = apiEndpoints[selectedEndpoint];

  return (
    <div className="min-h-screen bg-background text-zinc-300">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white font-mono uppercase tracking-tight mb-1">
                {isZh ? "NicheDigger API" : "NicheDigger API"}
              </h1>
              <p className="text-sm text-zinc-500 font-mono">
                {isZh
                  ? "统一的 NicheDigger API 接口"
                  : "Unified NicheDigger API Interface"}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-primary uppercase tracking-wider">
                SYSTEM_ONLINE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
                {isZh ? "目录" : "Table of Contents"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#overview"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "概述" : "Overview"}
                  </a>
                </li>
                <li>
                  <a
                    href="#authentication"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "认证" : "Authentication"}
                  </a>
                </li>
                <li>
                  <a
                    href="#endpoints"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "API 端点" : "API Endpoints"}
                  </a>
                </li>
                <li>
                  <a
                    href="#credits"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "Credits 消耗" : "Credits Consumption"}
                  </a>
                </li>
                <li>
                  <a
                    href="#modes"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "三种模式" : "Three Modes"}
                  </a>
                </li>
                <li>
                  <a
                    href="#workflows"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "工作流配置" : "Workflows"}
                  </a>
                </li>
                <li>
                  <a
                    href="#errors"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "错误码" : "Error Codes"}
                  </a>
                </li>
                <li>
                  <a
                    href="#languages"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "支持的语言" : "Languages"}
                  </a>
                </li>
                <li>
                  <a
                    href="#test"
                    className="text-zinc-400 hover:text-primary font-mono"
                  >
                    {isZh ? "API 测试" : "API Testing"}
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <section
              id="overview"
              className="bg-zinc-900 border border-zinc-800"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "概述" : "Overview"}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {isZh
                    ? "SEO Agent API 是一个统一的 API 接口，提供三种 SEO 分析模式："
                    : "SEO Agent API is a unified API interface providing three SEO analysis modes:"}
                </p>
                <ul className="list-none space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-mono">/</span>
                    <span className="text-zinc-400">
                      <strong className="text-white">
                        {isZh ? "关键词挖掘" : "Keyword Mining"}
                      </strong>{" "}
                      (keyword_mining) -{" "}
                      {isZh
                        ? "基于种子关键词生成并分析 SEO 关键词"
                        : "Generate and analyze SEO keywords based on seed keywords"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-mono">/</span>
                    <span className="text-zinc-400">
                      <strong className="text-white">
                        {isZh ? "批量翻译分析" : "Batch Translation Analysis"}
                      </strong>{" "}
                      (batch_translation) -{" "}
                      {isZh
                        ? "批量翻译关键词并分析排名机会"
                        : "Batch translate keywords and analyze ranking opportunities"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-mono">/</span>
                    <span className="text-zinc-400">
                      <strong className="text-white">
                        {isZh ? "深度策略" : "Deep Dive Strategy"}
                      </strong>{" "}
                      (deep_dive) -{" "}
                      {isZh
                        ? "为关键词生成全面的 SEO 内容策略"
                        : "Generate comprehensive SEO content strategy for keywords"}
                    </span>
                  </li>
                </ul>
                <div className="bg-zinc-950 border border-zinc-800 p-4">
                  <p className="text-sm text-white font-mono mb-2">
                    <strong>{isZh ? "基础 URL:" : "Base URL:"}</strong>{" "}
                    <span className="text-primary">{baseUrl}/api/v1</span>
                  </p>
                  <p className="text-sm text-white font-mono mb-2">
                    <strong>{isZh ? "Content-Type:" : "Content-Type:"}</strong>{" "}
                    <span className="text-primary">application/json</span>
                  </p>
                  <p className="text-sm text-white font-mono">
                    <strong>{isZh ? "CORS:" : "CORS:"}</strong>{" "}
                    <span className="text-primary">
                      {isZh
                        ? "支持跨域请求"
                        : "Cross-origin requests supported"}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Authentication Section */}
            <section
              id="authentication"
              className="bg-zinc-900 border border-zinc-800"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "认证" : "Authentication"}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {isZh
                    ? "所有 API 请求都需要在 header 中提供认证信息。支持两种认证方式："
                    : "All API requests require authentication information in the header. Two authentication methods are supported:"}
                </p>
                <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
                  <h3 className="text-lg font-bold text-white font-mono mb-3">
                    {isZh ? "API Key（推荐）" : "API Key (Recommended)"}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {isZh
                      ? "使用 API Key 进行认证更安全，建议所有 API 调用都使用 API Key。你可以在控制台的 API Keys 页面创建和管理 API Key。"
                      : "Using API Key for authentication is more secure. It is recommended to use API Key for all API calls. You can create and manage API Keys in the API Keys page of the console."}
                  </p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-4">
                  <p className="text-sm text-zinc-400 font-mono">
                    <strong className="text-white">
                      {isZh ? "注意:" : "Note:"}
                    </strong>{" "}
                    {isZh
                      ? "如果没有提供有效的认证信息，API 会返回 401 错误。"
                      : "If valid authentication information is not provided, the API will return a 401 error."}
                  </p>
                </div>
              </div>
            </section>

            {/* Endpoints Section */}
            <section
              id="endpoints"
              className="bg-zinc-900 border border-zinc-800"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "主要 API 端点" : "Main API Endpoints"}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "端点" : "Endpoint"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "方法" : "Method"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "说明" : "Description"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">
                          /api/v1/seo-agent
                        </td>
                        <td className="py-2 text-zinc-400 font-mono">POST</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "SEO 分析主接口"
                            : "SEO Analysis Main Interface"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">
                          /api/v1/workflows
                        </td>
                        <td className="py-2 text-zinc-400 font-mono">GET</td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "获取工作流定义" : "Get Workflow Definitions"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">
                          /api/v1/workflow-configs
                        </td>
                        <td className="py-2 text-zinc-400 font-mono">
                          GET/POST
                        </td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "获取/创建工作流配置"
                            : "Get/Create Workflow Configurations"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">
                          /api/v1/workflow-configs/:id
                        </td>
                        <td className="py-2 text-zinc-400 font-mono">GET</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "获取特定工作流配置"
                            : "Get Specific Workflow Configuration"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">
                          /api/v1/workflow-configs/:id
                        </td>
                        <td className="py-2 text-zinc-400 font-mono">PUT</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "更新工作流配置"
                            : "Update Workflow Configuration"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">
                          /api/v1/workflow-configs/:id
                        </td>
                        <td className="py-2 text-zinc-400 font-mono">DELETE</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "删除工作流配置"
                            : "Delete Workflow Configuration"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Credits Section */}
            <section
              id="credits"
              className="bg-zinc-900 border border-zinc-800"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "Credits 消耗规则" : "Credits Consumption Rules"}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {isZh
                    ? "所有 SEO 分析操作都会消耗 Credits，消耗规则与官网一致。"
                    : "All SEO analysis operations consume Credits, with consumption rules consistent with the official website."}
                </p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "模式" : "Mode"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "基础消耗" : "Base Cost"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "计算方式" : "Calculation"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">
                          keyword_mining
                        </td>
                        <td className="py-2 text-zinc-400">20 Credits</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "每 10 个关键词 = 20 Credits（向上取整）"
                            : "Every 10 keywords = 20 Credits (rounded up)"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">
                          batch_translation
                        </td>
                        <td className="py-2 text-zinc-400">20 Credits</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "每 10 个关键词 = 20 Credits（向上取整）"
                            : "Every 10 keywords = 20 Credits (rounded up)"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">
                          deep_dive
                        </td>
                        <td className="py-2 text-zinc-400">30 Credits</td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "固定 30 Credits" : "Fixed 30 Credits"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-4">
                  <p className="text-sm text-zinc-400 font-mono mb-2">
                    <strong className="text-white">
                      {isZh ? "示例:" : "Examples:"}
                    </strong>
                  </p>
                  <ul className="text-sm text-zinc-400 font-mono space-y-1 ml-4">
                    <li>
                      {isZh
                        ? "关键词挖掘 5 个关键词 = 20 Credits (1-10 个都是 20)"
                        : "Keyword mining 5 keywords = 20 Credits (1-10 are all 20)"}
                    </li>
                    <li>
                      {isZh
                        ? "关键词挖掘 15 个关键词 = 40 Credits (11-20 个是 40)"
                        : "Keyword mining 15 keywords = 40 Credits (11-20 are 40)"}
                    </li>
                    <li>
                      {isZh
                        ? "批量翻译 25 个关键词 = 60 Credits (21-30 个是 60)"
                        : "Batch translation 25 keywords = 60 Credits (21-30 are 60)"}
                    </li>
                    <li>
                      {isZh
                        ? "深度策略 = 30 Credits (固定)"
                        : "Deep dive = 30 Credits (fixed)"}
                    </li>
                  </ul>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-4 mt-4">
                  <p className="text-sm text-zinc-400 font-mono">
                    <strong className="text-white">
                      {isZh ? "注意:" : "Note:"}
                    </strong>{" "}
                    {isZh
                      ? "API 会在执行前检查 Credits 余额，余额不足会返回 402 错误。操作成功后会自动扣除相应的 Credits。"
                      : "The API will check Credits balance before execution. Insufficient balance will return a 402 error. Credits will be automatically deducted after successful operation."}
                  </p>
                </div>
              </div>
            </section>

            {/* Modes Section */}
            <section id="modes" className="bg-zinc-900 border border-zinc-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "三种模式" : "Three Modes"}
                </h2>

                {/* Mode 1: Keyword Mining */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white font-mono mb-2">
                    {isZh
                      ? "模式 1: 关键词挖掘 (keyword_mining)"
                      : "Mode 1: Keyword Mining (keyword_mining)"}
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    {isZh
                      ? "基于种子关键词生成 SEO 关键词，并可选择性地分析排名概率。"
                      : "Generate SEO keywords based on seed keywords and optionally analyze ranking probability."}
                  </p>

                  {/* Request Parameters Table */}
                  <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
                    <h4 className="text-sm font-bold text-white font-mono mb-3">
                      {isZh ? "请求参数" : "Request Parameters"}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "参数" : "Parameter"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "类型" : "Type"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "必填" : "Required"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "默认值" : "Default"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "说明" : "Description"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              mode
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? '必须为 "keyword_mining"'
                                : 'Must be "keyword_mining"'}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              seedKeyword
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "种子关键词" : "Seed keyword"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              systemInstruction
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "AI 系统指令，用于指导关键词生成"
                                : "AI system instruction for guiding keyword generation"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              targetLanguage
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"en"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "目标市场语言代码"
                                : "Target market language code"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              existingKeywords
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string[]
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">[]</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "已生成的关键词列表（用于避免重复）"
                                : "List of existing keywords (to avoid duplicates)"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              roundIndex
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              number
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">1</td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "挖掘轮次" : "Mining round index"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              wordsPerRound
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              number
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">10</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "每轮生成的关键词数量 (5-20)"
                                : "Number of keywords per round (5-20)"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              miningStrategy
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"horizontal"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? '挖掘策略："horizontal" (横向) 或 "vertical" (纵向)'
                                : 'Mining strategy: "horizontal" or "vertical"'}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              userSuggestion
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">""</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "用户建议（用于指导下一轮生成）"
                                : "User suggestion (for guiding next round)"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              uiLanguage
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"en"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? 'UI 语言："en" 或 "zh"'
                                : 'UI language: "en" or "zh"'}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              analyzeRanking
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              boolean
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">true</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "是否分析排名概率"
                                : "Whether to analyze ranking probability"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Response Example */}
                  <div className="bg-zinc-950 border border-zinc-800 p-4">
                    <h4 className="text-sm font-bold text-white font-mono mb-3">
                      {isZh ? "响应示例" : "Response Example"}
                    </h4>
                    <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                      {`{
  "success": true,
  "mode": "keyword_mining",
  "data": {
    "keywords": [
      {
        "id": "kw-1234567890-0",
        "keyword": "커피숍 프랜차이즈",
        "translation": "咖啡店加盟",
        "intent": "Commercial",
        "volume": 3200,
        "probability": "HIGH",
        "topDomainType": "Niche Site",
        "reasoning": "竞争较弱，蓝海机会",
        "serankingData": {
          "volume": 3200,
          "difficulty": 25,
          "cpc": 1.2,
          "competition": 0.3
        }
      }
    ],
    "count": 10,
    "seedKeyword": "coffee shop",
    "targetLanguage": "ko",
    "roundIndex": 1
  }
}`}
                    </pre>
                  </div>
                </div>

                {/* Mode 2: Batch Translation */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white font-mono mb-2">
                    {isZh
                      ? "模式 2: 批量翻译分析 (batch_translation)"
                      : "Mode 2: Batch Translation Analysis (batch_translation)"}
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    {isZh
                      ? "批量翻译关键词到目标语言，并分析每个关键词的排名机会。"
                      : "Batch translate keywords to target language and analyze ranking opportunities for each keyword."}
                  </p>

                  {/* Request Parameters Table */}
                  <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
                    <h4 className="text-sm font-bold text-white font-mono mb-3">
                      {isZh ? "请求参数" : "Request Parameters"}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "参数" : "Parameter"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "类型" : "Type"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "必填" : "Required"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "默认值" : "Default"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "说明" : "Description"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              mode
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? '必须为 "batch_translation"'
                                : 'Must be "batch_translation"'}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              keywords
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string | string[]
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "关键词列表（逗号分隔字符串或数组）"
                                : "Keyword list (comma-separated string or array)"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              systemInstruction
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "AI 系统指令，用于分析排名机会"
                                : "AI system instruction for analyzing ranking opportunities"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              targetLanguage
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"en"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "目标市场语言代码"
                                : "Target market language code"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              uiLanguage
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"en"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? 'UI 语言："en" 或 "zh"'
                                : 'UI language: "en" or "zh"'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Response Example */}
                  <div className="bg-zinc-950 border border-zinc-800 p-4">
                    <h4 className="text-sm font-bold text-white font-mono mb-3">
                      {isZh ? "响应示例" : "Response Example"}
                    </h4>
                    <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                      {`{
  "success": true,
  "mode": "batch_translation",
  "data": {
    "keywords": [
      {
        "id": "bt-1234567890-0",
        "keyword": "커피숍",
        "translation": "coffee shop",
        "intent": "Informational",
        "volume": 4500,
        "probability": "HIGH",
        "topDomainType": "Niche Site",
        "reasoning": "竞争较弱，有机会排名",
        "serankingData": {
          "volume": 4500,
          "difficulty": 28,
          "cpc": 1.5
        }
      }
    ],
    "translationResults": [
      {
        "original": "coffee shop",
        "translated": "커피숍",
        "translationBack": "coffee shop"
      }
    ],
    "total": 4,
    "targetLanguage": "ko"
  }
}`}
                    </pre>
                  </div>
                </div>

                {/* Mode 3: Deep Dive */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white font-mono mb-2">
                    {isZh
                      ? "模式 3: 深度策略 (deep_dive)"
                      : "Mode 3: Deep Dive Strategy (deep_dive)"}
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    {isZh
                      ? "为指定关键词生成全面的 SEO 内容策略，包括页面标题、描述、内容结构、长尾关键词等。"
                      : "Generate comprehensive SEO content strategy for specified keywords, including page titles, descriptions, content structure, long-tail keywords, etc."}
                  </p>

                  {/* Request Parameters Table */}
                  <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
                    <h4 className="text-sm font-bold text-white font-mono mb-3">
                      {isZh ? "请求参数" : "Request Parameters"}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "参数" : "Parameter"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "类型" : "Type"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "必填" : "Required"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "默认值" : "Default"}
                            </th>
                            <th className="text-left py-2 text-white font-mono">
                              {isZh ? "说明" : "Description"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              mode
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? '必须为 "deep_dive"'
                                : 'Must be "deep_dive"'}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              keyword
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              object | string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "是" : "Yes"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "关键词对象或字符串"
                                : "Keyword object or string"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              targetLanguage
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"en"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "目标市场语言代码"
                                : "Target market language code"}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              uiLanguage
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">"en"</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? 'UI 语言："en" 或 "zh"'
                                : 'UI language: "en" or "zh"'}
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-800">
                            <td className="py-2 text-primary font-mono">
                              strategyPrompt
                            </td>
                            <td className="py-2 text-zinc-400 font-mono">
                              string
                            </td>
                            <td className="py-2 text-zinc-400">
                              {isZh ? "否" : "No"}
                            </td>
                            <td className="py-2 text-zinc-400">-</td>
                            <td className="py-2 text-zinc-400">
                              {isZh
                                ? "自定义策略生成提示词"
                                : "Custom strategy generation prompt"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Keyword Object Format */}
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <h5 className="text-xs font-bold text-white font-mono mb-2">
                        {isZh
                          ? "Keyword 对象格式（如果提供对象）:"
                          : "Keyword Object Format (if providing object):"}
                      </h5>
                      <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                        {`{
  "id": "kw-123",
  "keyword": "coffee shop",
  "translation": "咖啡店",
  "intent": "Commercial",
  "volume": 1000
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Response Example */}
                  <div className="bg-zinc-950 border border-zinc-800 p-4">
                    <h4 className="text-sm font-bold text-white font-mono mb-3">
                      {isZh ? "响应示例" : "Response Example"}
                    </h4>
                    <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                      {`{
  "success": true,
  "mode": "deep_dive",
  "data": {
    "report": {
      "targetKeyword": "커피숍",
      "pageTitleH1": "최고의 커피숍 가이드 2024",
      "pageTitleH1_trans": "最佳咖啡店指南 2024",
      "metaDescription": "커피숍 선택 가이드: 위치, 메뉴, 가격 비교...",
      "metaDescription_trans": "咖啡店选择指南：位置、菜单、价格比较...",
      "urlSlug": "coffee-shop-guide",
      "contentStructure": [
        {
          "header": "커피숍 선택 기준",
          "header_trans": "咖啡店选择标准",
          "description": "위치, 가격, 메뉴 다양성 등을 고려하세요.",
          "description_trans": "考虑位置、价格、菜单多样性等因素。"
        }
      ],
      "longTailKeywords": ["커피숍 프랜차이즈", "커피숍 창업 비용"],
      "longTailKeywords_trans": ["咖啡店加盟", "咖啡店创业成本"],
      "recommendedWordCount": 2000
    },
    "coreKeywords": [
      {
        "id": "cd-1234567890-0",
        "keyword": "커피숍 프랜차이즈",
        "translation": "커피숍 프랜차이즈",
        "volume": 3200,
        "probability": "HIGH",
        "topDomainType": "Niche Site"
      }
    ],
    "keyword": "커피숍",
    "targetLanguage": "ko"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Workflows Section */}
            <section
              id="workflows"
              className="bg-zinc-900 border border-zinc-800"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh
                    ? "工作流配置管理"
                    : "Workflow Configuration Management"}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {isZh
                    ? "工作流配置允许您自定义 AI 代理的提示词，并保存这些配置以便在不同请求中复用。每个工作流都有多个可配置的节点（Agent），您可以自定义每个节点的提示词。"
                    : "Workflow configurations allow you to customize AI agent prompts and save these configurations for reuse across different requests. Each workflow has multiple configurable nodes (Agents), and you can customize the prompt for each node."}
                </p>
                <div className="bg-zinc-950 border border-zinc-800 p-4 mb-4">
                  <p className="text-sm text-zinc-400 font-mono mb-2">
                    <strong className="text-white">
                      {isZh ? "重要提示:" : "Important:"}
                    </strong>{" "}
                    {isZh
                      ? "每个 API 模式对应不同的工作流，必须使用正确的工作流 ID 创建配置："
                      : "Each API mode corresponds to a different workflow, and you must use the correct workflow ID to create configurations:"}
                  </p>
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-1 text-white font-mono">
                            {isZh ? "API 模式" : "API Mode"}
                          </th>
                          <th className="text-left py-1 text-white font-mono">
                            {isZh ? "工作流 ID" : "Workflow ID"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-1 text-zinc-400 font-mono">
                            keyword_mining
                          </td>
                          <td className="py-1 text-primary font-mono">
                            mining
                          </td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-1 text-zinc-400 font-mono">
                            batch_translation
                          </td>
                          <td className="py-1 text-primary font-mono">batch</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-1 text-zinc-400 font-mono">
                            deep_dive
                          </td>
                          <td className="py-1 text-primary font-mono">
                            deepDive
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-4">
                  <h4 className="text-sm font-bold text-white font-mono mb-2">
                    {isZh ? "端点:" : "Endpoints:"}
                  </h4>
                  <ul className="text-sm text-zinc-400 font-mono space-y-1">
                    <li>
                      <code className="text-primary">
                        GET /api/v1/workflows
                      </code>{" "}
                      - {isZh ? "获取工作流定义" : "Get workflow definitions"}
                    </li>
                    <li>
                      <code className="text-primary">
                        POST /api/v1/workflow-configs
                      </code>{" "}
                      -{" "}
                      {isZh
                        ? "创建工作流配置"
                        : "Create workflow configuration"}
                    </li>
                    <li>
                      <code className="text-primary">
                        GET /api/v1/workflow-configs
                      </code>{" "}
                      -{" "}
                      {isZh
                        ? "获取工作流配置列表"
                        : "Get workflow configuration list"}
                    </li>
                    <li>
                      <code className="text-primary">
                        GET /api/v1/workflow-configs/:id
                      </code>{" "}
                      -{" "}
                      {isZh
                        ? "获取特定工作流配置"
                        : "Get specific workflow configuration"}
                    </li>
                    <li>
                      <code className="text-primary">
                        PUT /api/v1/workflow-configs/:id
                      </code>{" "}
                      -{" "}
                      {isZh
                        ? "更新工作流配置"
                        : "Update workflow configuration"}
                    </li>
                    <li>
                      <code className="text-primary">
                        DELETE /api/v1/workflow-configs/:id
                      </code>{" "}
                      -{" "}
                      {isZh
                        ? "删除工作流配置"
                        : "Delete workflow configuration"}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Errors Section */}
            <section id="errors" className="bg-zinc-900 border border-zinc-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "错误码" : "Error Codes"}
                </h2>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "HTTP 状态码" : "HTTP Status Code"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "错误类型" : "Error Type"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "说明" : "Description"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">401</td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "Unauthorized" : "Unauthorized"}
                        </td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "缺少或无效的认证 token"
                            : "Missing or invalid authentication token"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">402</td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "Payment Required" : "Payment Required"}
                        </td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "Credits 余额不足"
                            : "Insufficient Credits balance"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">400</td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "Bad Request" : "Bad Request"}
                        </td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "请求参数错误或缺失"
                            : "Request parameter error or missing"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">405</td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "Method Not Allowed" : "Method Not Allowed"}
                        </td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "请求方法不支持（仅支持 POST）"
                            : "Request method not supported (POST only)"}
                        </td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-zinc-400 font-mono">500</td>
                        <td className="py-2 text-zinc-400">
                          {isZh
                            ? "Internal Server Error"
                            : "Internal Server Error"}
                        </td>
                        <td className="py-2 text-zinc-400">
                          {isZh ? "服务器内部错误" : "Internal server error"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Languages Section */}
            <section
              id="languages"
              className="bg-zinc-900 border border-zinc-800"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "支持的语言代码" : "Supported Language Codes"}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "代码" : "Code"}
                        </th>
                        <th className="text-left py-2 text-white font-mono">
                          {isZh ? "语言" : "Language"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">en</td>
                        <td className="py-2 text-zinc-400">English</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">zh</td>
                        <td className="py-2 text-zinc-400">Chinese</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">ko</td>
                        <td className="py-2 text-zinc-400">Korean</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">ja</td>
                        <td className="py-2 text-zinc-400">Japanese</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">ru</td>
                        <td className="py-2 text-zinc-400">Russian</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">fr</td>
                        <td className="py-2 text-zinc-400">French</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">pt</td>
                        <td className="py-2 text-zinc-400">Portuguese</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">id</td>
                        <td className="py-2 text-zinc-400">Indonesian</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">es</td>
                        <td className="py-2 text-zinc-400">Spanish</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="py-2 text-primary font-mono">ar</td>
                        <td className="py-2 text-zinc-400">Arabic</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* API Testing Section */}
            <section id="test" className="bg-zinc-900 border border-zinc-800">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight mb-4">
                  {isZh ? "在线测试 API" : "Online API Testing"}
                </h2>
                <p className="text-zinc-400 mb-6">
                  {isZh
                    ? "在下方直接测试 API 接口，输入参数并查看返回结果。"
                    : "Test the API interface directly below, enter parameters and view return results."}
                </p>

                {/* 在线测试区域 */}
                <div className="bg-zinc-950 border border-zinc-800 p-6">
                  {/* 请求方法和URL */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold font-mono mb-2 text-white">
                      {isZh ? "请求方法 & URL" : "Request Method & URL"}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedEndpoint}
                        onChange={(e) => setSelectedEndpoint(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 text-white font-mono px-3 py-3 focus:outline-none focus:border-primary"
                      >
                        {Object.values(apiEndpoints).map((endpoint) => (
                          <option key={endpoint.value} value={endpoint.value}>
                            {endpoint.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={copyUrl}
                        className="px-4 py-3 bg-zinc-950 border border-zinc-800 text-white font-mono text-sm hover:bg-zinc-900 hover:border-primary transition-colors"
                      >
                        {isZh ? "复制" : "Copy"}
                      </button>
                      <button
                        onClick={sendRequest}
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-black font-mono font-bold hover:bg-primary/80 transition-colors disabled:opacity-50"
                      >
                        {loading
                          ? isZh
                            ? "发送中..."
                            : "Sending..."
                          : isZh
                          ? "发送"
                          : "Send"}
                      </button>
                    </div>
                  </div>

                  {/* Headers */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold font-mono text-white">
                        Headers
                      </label>
                      <button
                        onClick={() => toggleSection("headers")}
                        className="text-zinc-500 hover:text-white"
                      >
                        {sections.headers ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronUp size={16} />
                        )}
                      </button>
                    </div>
                    {sections.headers && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="authEnabled"
                            checked={authEnabled}
                            onChange={(e) => setAuthEnabled(e.target.checked)}
                            className="w-4 h-4 text-primary bg-zinc-950 border-zinc-800 focus:ring-primary"
                          />
                          <label className="text-zinc-400 font-mono text-sm">
                            Authorization
                          </label>
                          <select className="bg-zinc-950 border border-zinc-800 text-white font-mono px-2 py-1 text-sm">
                            <option value="Bearer">Bearer</option>
                          </select>
                          {apiKeys.length > 0 && (
                            <select
                              value={selectedApiKeyId}
                              onChange={(e) =>
                                setSelectedApiKeyId(e.target.value)
                              }
                              className="bg-zinc-950 border border-zinc-800 text-white font-mono px-3 py-1 text-sm focus:outline-none focus:border-primary"
                            >
                              {apiKeys.map((key) => (
                                <option key={key.id} value={key.id}>
                                  {key.keyPrefix}... (
                                  {key.name || (isZh ? "未命名" : "Unnamed")})
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            type="text"
                            value={authToken}
                            onChange={(e) => setAuthToken(e.target.value)}
                            placeholder={
                              isZh
                                ? "输入完整的 API Key (nm_live_...)"
                                : "Enter complete API Key (nm_live_...)"
                            }
                            className="flex-1 bg-zinc-950 border border-zinc-800 text-white font-mono px-3 py-1 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold font-mono text-white">
                        {isZh ? "Body" : "Body"}
                      </label>
                      <button
                        onClick={() => toggleSection("body")}
                        className="text-zinc-500 hover:text-white"
                      >
                        {sections.body ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronUp size={16} />
                        )}
                      </button>
                    </div>
                    {sections.body && (
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        rows={12}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono p-4 text-sm focus:outline-none focus:border-primary"
                        placeholder='{"mode": "keyword_mining", ...}'
                      />
                    )}
                  </div>

                  {/* Response */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold font-mono text-white">
                        {isZh ? "返回结果" : "Response"}
                      </label>
                      <button
                        onClick={() => toggleSection("response")}
                        className="text-zinc-500 hover:text-white"
                      >
                        {sections.response ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronUp size={16} />
                        )}
                      </button>
                    </div>
                    {sections.response && (
                      <div className="min-h-[200px]">
                        {!response ? (
                          <div className="flex flex-col items-center justify-center h-[200px] text-zinc-500">
                            <p className="font-mono text-sm">
                              {isZh
                                ? '点击"发送"按钮获取返回结果'
                                : 'Click the "Send" button to get return results'}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="mb-2">
                              <span
                                className={`px-2 py-1 font-mono text-xs ${
                                  response.status >= 200 &&
                                  response.status < 300
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }`}
                              >
                                {response.status || "Error"}{" "}
                                {response.statusText || ""}
                              </span>
                              {response.duration && (
                                <span className="text-zinc-500 font-mono text-xs ml-2">
                                  {response.duration}ms
                                </span>
                              )}
                            </div>
                            <pre className="bg-zinc-950 border border-zinc-800 p-4 text-white font-mono text-sm overflow-auto max-h-[500px]">
                              {JSON.stringify(
                                response.error || response.data,
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
