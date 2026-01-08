import React, { useState, useEffect, useContext, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { Copy, Send, ChevronDown, ChevronUp, Check, ExternalLink, Globe, Home, Sun, Moon } from "lucide-react";

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
  const { lang, setLang } = useContext(LanguageContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
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
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [sections, setSections] = useState<{ [key: string]: boolean }>({
    headers: true,
    body: true,
    response: true,
  });

  // 处理初始语言
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'cn' || langParam === 'en') {
      setLang(langParam);
    }
  }, []);

  // Scroll spy implementation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sectionIds = ['overview', 'authentication', 'endpoints', 'credits', 'modes', 'workflows', 'errors', 'languages', 'test'];
    
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // 获取API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!authenticated) return;

      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch("/api/v1/api-keys", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const keys = data.data?.apiKeys || [];
          const activeKeys = keys.filter((k: APIKey) => k.isActive);
          setApiKeys(activeKeys);

          if (keys.length > 0) {
            const firstKey = keys.find((k: APIKey) => k.isActive) || keys[0];
            setSelectedApiKeyId(firstKey.id);
            const savedKey = localStorage.getItem(`nichedigger_api_key_${firstKey.id}`);
            if (savedKey && savedKey.startsWith("nm_live_")) {
              setAuthToken(savedKey);
            } else {
              setAuthToken(firstKey.keyPrefix + "...");
            }
          }
        }
      } catch (error) {
        console.error("APIDocs: Error fetching API keys:", error);
      }
    };

    fetchApiKeys();
  }, [authenticated, getToken]);

  const apiEndpoints: { [key: string]: APIEndpoint } = {
    "seo-agent": {
      value: "seo-agent",
      method: "POST",
      url: `${baseUrl}/api/v1/seo-agent`,
      label: `POST /api/v1/seo-agent`,
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
      label: `GET /api/v1/workflows`,
    },
    "workflow-configs": {
      value: "workflow-configs",
      method: "GET",
      url: `${baseUrl}/api/v1/workflow-configs`,
      label: `GET /api/v1/workflow-configs`,
    }
  };

  useEffect(() => {
    const endpoint = apiEndpoints[selectedEndpoint];
    if (endpoint?.defaultBody) {
      setRequestBody(JSON.stringify(endpoint.defaultBody, null, 2));
    } else {
      setRequestBody("{}");
    }
  }, [selectedEndpoint]);

  const sendRequest = async () => {
    const endpoint = apiEndpoints[selectedEndpoint];
    if (!endpoint) return;

    setLoading(true);
    setResponse(null);

    try {
      const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
      };

      if (authEnabled) {
          const jwtToken = getToken();
          if (jwtToken) {
            headers["Authorization"] = `Bearer ${jwtToken}`;
        }
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers,
      };

      if (endpoint.method === "POST" || endpoint.method === "PUT") {
        options.body = requestBody;
        }

      const res = await fetch(endpoint.url, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 hover:bg-primary/10 rounded-sm transition-colors text-text-secondary hover:text-primary">
                <Home size={20} />
              </a>
            <div>
                <h1 className="text-2xl font-bold text-text-primary font-mono uppercase tracking-tight mb-1">
                  NicheDigger API
              </h1>
                <p className="text-sm text-text-tertiary font-mono">
                  {isZh ? "统一的 NicheDigger API 接口" : "Unified NicheDigger API Interface"}
              </p>
            </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === "en" ? "cn" : "en")}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-sm text-text-secondary hover:text-primary transition-all"
              >
                <Globe size={16} />
                <span className="text-xs font-mono font-bold">{lang === "en" ? "EN" : "CN"}</span>
              </button>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-sm text-text-secondary hover:text-primary transition-all"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold text-text-primary font-mono uppercase tracking-wider mb-4">
                {isZh ? "目录" : "Table of Contents"}
              </h3>
              <nav className="space-y-1">
                {[
                  { id: "overview", label: isZh ? "概述" : "Overview" },
                  { id: "authentication", label: isZh ? "认证" : "Authentication" },
                  { id: "endpoints", label: isZh ? "API 端点" : "API Endpoints" },
                  { id: "credits", label: isZh ? "Credits 消耗" : "Credits Consumption" },
                  { id: "modes", label: isZh ? "三种模式" : "Three Modes" },
                  { id: "workflows", label: isZh ? "工作流配置" : "Workflows" },
                  { id: "errors", label: isZh ? "错误码" : "Error Codes" },
                  { id: "languages", label: isZh ? "支持的语言" : "Languages" },
                  { id: "test", label: isZh ? "API 测试" : "API Testing" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block px-3 py-2 text-sm font-mono border-l-2 transition-all ${
                      activeSection === item.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-8 pb-32">
            <section id="overview" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                  {isZh ? "概述" : "Overview"}
                </h2>
              <p className="text-text-secondary mb-4">
                {isZh ? "SEO Agent API 提供高效的关键词挖掘和分析能力。" : "SEO Agent API provides efficient keyword mining and analysis."}
              </p>
              <div className="bg-background border border-border p-4 font-mono text-sm">
                <p><strong>Base URL:</strong> <span className="text-primary">{baseUrl}/api/v1</span></p>
                <p><strong>Content-Type:</strong> <span className="text-primary">application/json</span></p>
              </div>
            </section>

            <section id="authentication" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                  {isZh ? "认证" : "Authentication"}
                </h2>
              <div className="bg-background border border-border p-4 mb-4">
                <h3 className="text-lg font-bold mb-2">API Key</h3>
                <p className="text-text-secondary text-sm">
                  {isZh ? "在 Header 中包含 Authorization: Bearer YOUR_API_KEY" : "Include Authorization: Bearer YOUR_API_KEY in header"}
                  </p>
              </div>
            </section>

            <section id="endpoints" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                {isZh ? "API 端点" : "API Endpoints"}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">{isZh ? "端点" : "Endpoint"}</th>
                      <th className="text-left py-2">{isZh ? "方法" : "Method"}</th>
                      </tr>
                    </thead>
                    <tbody>
                    {Object.values(apiEndpoints).map((ep, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-3 text-primary font-mono">{ep.label.split(' ')[1]}</td>
                        <td className="py-3 text-text-secondary font-mono">{ep.method}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
              </div>
            </section>

            <section id="credits" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                {isZh ? "Credits 消耗" : "Credits Consumption"}
                </h2>
              <ul className="text-sm text-text-secondary space-y-2">
                <li>• 关键词挖掘: 20 Credits / 10 Keywords</li>
                <li>• 批量翻译: 20 Credits / 10 Keywords</li>
                <li>• 深度分析: 30 Credits</li>
                  </ul>
            </section>

            <section id="modes" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                  {isZh ? "三种模式" : "Three Modes"}
                </h2>
              <div className="space-y-4 text-sm text-text-secondary">
                <p>1. <strong>keyword_mining</strong>: {isZh ? "关键词挖掘" : "Keyword Mining"}</p>
                <p>2. <strong>batch_translation</strong>: {isZh ? "批量翻译" : "Batch Translation"}</p>
                <p>3. <strong>deep_dive</strong>: {isZh ? "深度分析" : "Deep Dive"}</p>
              </div>
            </section>

            <section id="workflows" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                {isZh ? "工作流" : "Workflows"}
                </h2>
              <p className="text-sm text-text-secondary">{isZh ? "支持自定义 AI 提示词配置。" : "Supports custom AI prompt configurations."}</p>
            </section>

            <section id="errors" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                  {isZh ? "错误码" : "Error Codes"}
                </h2>
              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div className="p-2 bg-background border border-border">401: Unauthorized</div>
                <div className="p-2 bg-background border border-border">402: Low Credits</div>
                <div className="p-2 bg-background border border-border">400: Bad Request</div>
                <div className="p-2 bg-background border border-border">500: Server Error</div>
              </div>
            </section>

            <section id="languages" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                {isZh ? "语言支持" : "Languages"}
                </h2>
              <div className="flex flex-wrap gap-2">
                {["en", "zh", "ko", "ja", "ru", "fr"].map(l => (
                  <span key={l} className="px-3 py-1 bg-background border border-border text-xs font-mono">{l}</span>
                ))}
              </div>
            </section>

            <section id="test" className="bg-surface border border-border scroll-mt-24 p-6">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase mb-4">
                {isZh ? "API 测试" : "API Testing"}
                </h2>
              <div className="bg-background border border-border p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-tertiary mb-2 uppercase">Endpoint</label>
                      <select
                        value={selectedEndpoint}
                        onChange={(e) => setSelectedEndpoint(e.target.value)}
                    className="w-full bg-surface border border-border text-text-primary font-mono p-2 focus:outline-none"
                      >
                    {Object.values(apiEndpoints).map((ep) => (
                      <option key={ep.value} value={ep.value}>{ep.label}</option>
                        ))}
                      </select>
                    </div>
                <div>
                  <label className="block text-xs font-mono text-text-tertiary mb-2 uppercase">Body</label>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                    rows={8}
                    className="w-full bg-surface border border-border text-text-primary font-mono p-3 text-sm focus:outline-none"
                      />
                  </div>
                      <button
                  onClick={sendRequest}
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Execute Request"}
                      </button>
                {response && (
                  <div className="mt-4">
                    <label className="block text-xs font-mono text-text-tertiary mb-2 uppercase">Response</label>
                    <pre className="bg-surface border border-border p-4 text-text-primary font-mono text-xs overflow-auto max-h-64">
                      {JSON.stringify(response, null, 2)}
                            </pre>
                          </div>
                        )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
