import React, { useContext, useState } from "react";
import {
  Search,
  Globe,
  Compass,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Target,
} from "lucide-react";
import { LanguageContext } from "../../App";
import { useAuth } from "../../contexts/AuthContext";

const ConsoleAgents: React.FC = () => {
  const { t, lang } = useContext(LanguageContext);
  const { getToken } = useAuth();
  const [loadingAgent, setLoadingAgent] = useState<string | null>(null);

  // 🔧 开发模式检测
  const isDevelopment =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const handleLaunchAgent = async (
    agentId: string,
    agentUrl: string,
    available: boolean = true
  ) => {
    // 如果 agent 不可用，显示提示信息
    if (!available) {
      alert(lang === "cn" ? "暂未更新" : "Coming soon");
      return;
    }

    // 防止重复点击
    if (loadingAgent) {
      return;
    }

    try {
      // 设置 loading 状态
      setLoadingAgent(agentId);

      // 1. 获取当前用户的 JWT token
      const token = getToken();
      if (!token) {
        alert(lang === "cn" ? "请先登录" : "Please login first");
        setLoadingAgent(null);
        return;
      }

      // 2. 调用 API 生成 Transfer Token
      const response = await fetch("/api/auth/create-transfer-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create transfer token");
      }

      const { transferToken } = await response.json();

      // 3. 在新标签页打开子项目，传递 Transfer Token
      const url = `${agentUrl}?tt=${transferToken}`;
      window.open(url, "_blank");

      // 成功后延迟重置 loading（给用户视觉反馈）
      setTimeout(() => {
        setLoadingAgent(null);
      }, 1000);
    } catch (error) {
      console.error("Launch agent error:", error);
      alert(
        lang === "cn"
          ? "启动失败，请稍后重试"
          : "Launch failed, please try again later"
      );
      setLoadingAgent(null);
    }
  };

  const agents = [
    {
      id: "google",
      name: lang === "cn" ? "Google 挖掘机" : "Google Miner",
      desc:
        lang === "cn"
          ? "全球意图定位。专为高流量、高竞争的全球市场设计。"
          : "Global intent targeting. Optimized for high-volume markets.",
      icon: <Search className="w-8 h-8" />,
      features:
        lang === "cn"
          ? ["NLP 意图匹配", "零点击搜索分析", "US/UK/AU 数据库"]
          : [
              "NLP Intent Matching",
              "Zero-Click Analysis",
              "US/UK/AU Databases",
            ],
      url: isDevelopment
        ? "http://localhost:3002"
        : "https://google-seo-agen-ts-lans.vercel.app",
      color: "primary",
      available: true,
      stats: {
        label: lang === "cn" ? "已挖掘关键词" : "Keywords Mined",
        value: "12,543",
      },
    },
    {
      id: "yandex",
      name: lang === "cn" ? "Yandex 专员" : "Yandex Unit",
      desc:
        lang === "cn"
          ? "CIS 俄语区专家。精通西里尔语义核心与 Yandex 算法。"
          : "CIS region specialist. Navigates Cyrillic semantics.",
      icon: <Globe className="w-8 h-8" />,
      features:
        lang === "cn"
          ? ["ICS 权重分析", "区域地理定位", "俄语语义核心映射"]
          : ["ICS Score Check", "Regional Geo-Filter", "Cyrillic Core Mapping"],
      url: isDevelopment
        ? "http://localhost:3001"
        : "https://yandex-seo-agents.vercel.app",
      color: "red",
      available: false,
      stats: {
        label: lang === "cn" ? "已挖掘关键词" : "Keywords Mined",
        value: "8,234",
      },
    },
    {
      id: "bing",
      name: lang === "cn" ? "Bing 探测器" : "Bing Probe",
      desc:
        lang === "cn"
          ? "高净值人群锁定。针对被忽视的桌面端高转化用户群。"
          : "High-value demographic targeting. Lower CPA, higher conversion.",
      icon: <Compass className="w-8 h-8" />,
      features:
        lang === "cn"
          ? ["桌面端用户聚焦", "低竞争蓝海扫描", "高消费人群画像"]
          : [
              "Desktop User Focus",
              "Low-Competition Scan",
              "Affluent Demographic",
            ],
      url: isDevelopment
        ? "http://localhost:3003"
        : "https://bing-seo-agen-ts-lans.vercel.app",
      color: "blue",
      available: false,
      stats: {
        label: lang === "cn" ? "已挖掘关键词" : "Keywords Mined",
        value: "6,721",
      },
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; border: string; text: string; hover: string }
    > = {
      primary: {
        bg: "bg-primary/10",
        border: "border-primary/30",
        text: "text-primary",
        hover: "hover:border-primary/50",
      },
      red: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        hover: "hover:border-red-500/50",
      },
      blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        hover: "hover:border-blue-500/50",
      },
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-2 border-primary pl-3">
        <h1 className="text-2xl font-bold text-white mb-1 font-mono uppercase tracking-tight">
          {lang === "cn" ? "SEO Agents" : "SEO Agents"}
        </h1>
        <p className="text-zinc-400 text-xs font-mono">
          {lang === "cn"
            ? "启动专属 Agent 进行关键词挖掘和竞争分析"
            : "Launch specialized agents for keyword mining and competition analysis"}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              {lang === "cn" ? "总计" : "Total"}
            </span>
          </div>
          <p className="text-2xl font-bold text-white data-value">27,498</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
            {lang === "cn" ? "已挖掘关键词" : "Keywords Mined"}
          </p>
        </div>
        <div className="bg-surface border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-4 h-4 text-accent-green" />
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              {lang === "cn" ? "成功率" : "Success"}
            </span>
          </div>
          <p className="text-2xl font-bold text-white data-value">94.2%</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
            {lang === "cn" ? "蓝海机会识别" : "Blue Ocean Identification"}
          </p>
        </div>
        <div className="bg-surface border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              {lang === "cn" ? "活跃" : "Active"}
            </span>
          </div>
          <p className="text-2xl font-bold text-white data-value">3</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
            {lang === "cn" ? "可用 Agents" : "Available Agents"}
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const colorClasses = getColorClasses(agent.color);
          return (
            <div
              key={agent.id}
              className={`bg-surface border p-4 transition-all ${colorClasses.border} ${colorClasses.hover}`}
            >
              {/* Icon */}
              <div
                className={`p-2 ${colorClasses.bg} border ${colorClasses.border} mb-3 inline-flex ${colorClasses.text}`}
              >
                <span className="w-6 h-6 block">{agent.icon}</span>
              </div>

              {/* Name & Description */}
              <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-wider">
                {agent.name}
              </h3>
              <p className="text-xs text-zinc-400 mb-3">{agent.desc}</p>

              {/* Features */}
              <ul className="space-y-1.5 mb-4">
                {agent.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-[10px] text-zinc-300 font-mono"
                  >
                    <div
                      className={`w-1 h-1 ${
                        agent.color === "primary"
                          ? "bg-primary"
                          : agent.color === "red"
                          ? "bg-red-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div
                className={`p-2 ${colorClasses.bg} border ${colorClasses.border} mb-3`}
              >
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  {agent.stats.label}
                </p>
                <p
                  className={`text-xl font-bold data-value ${colorClasses.text}`}
                >
                  {agent.stats.value}
                </p>
              </div>

              {/* Launch Button */}
              <button
                onClick={() =>
                  handleLaunchAgent(agent.id, agent.url, agent.available)
                }
                disabled={!agent.available || loadingAgent === agent.id}
                className={`w-full py-2 ${colorClasses.bg} border ${
                  !agent.available
                    ? "border-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                    : loadingAgent === agent.id
                    ? `${colorClasses.border} ${colorClasses.text}/70 cursor-wait`
                    : `${colorClasses.border} ${colorClasses.text} hover:bg-opacity-20 cursor-pointer`
                } text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 group`}
              >
                <span>
                  {loadingAgent === agent.id
                    ? lang === "cn"
                      ? "启动中..."
                      : "Launching..."
                    : agent.available
                    ? lang === "cn"
                      ? "启动 Agent"
                      : "Launch Agent"
                    : lang === "cn"
                    ? "暂未更新"
                    : "Coming Soon"}
                </span>
                {loadingAgent === agent.id ? (
                  // Loading Spinner
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : agent.available ? (
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                ) : null}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-primary/5 border border-primary/20 p-6 relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>

        <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          {lang === "cn" ? "使用说明" : "How to Use"}
        </h2>
        <ul className="space-y-2 text-sm text-zinc-300 font-mono">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">1.</span>
            <span>
              {lang === "cn"
                ? "选择合适的 Agent：根据您的目标市场选择 Google、Yandex 或 Bing Agent。"
                : "Select the right Agent: Choose Google, Yandex, or Bing based on your target market."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">2.</span>
            <span>
              {lang === "cn"
                ? '点击"启动 Agent"将跳转到对应的挖掘平台。'
                : 'Click "Launch Agent" to navigate to the mining platform.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">3.</span>
            <span>
              {lang === "cn"
                ? "您的登录状态会自动同步，无需重复登录。"
                : "Your login status will be synced automatically, no need to login again."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">4.</span>
            <span>
              {lang === "cn"
                ? "输入种子关键词，Agent 将自动执行递归挖掘和 SERP 分析。"
                : "Enter seed keywords, and the Agent will execute recursive mining and SERP analysis."}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConsoleAgents;
