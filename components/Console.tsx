import React, { useState, useContext, useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  Key,
  CreditCard,
  Users,
  Settings,
  Menu,
  X,
  Home,
  Globe,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import ConsoleDashboard from "./console/ConsoleDashboard";
import ConsoleAgents from "./console/ConsoleAgents";
import ConsoleAPI from "./console/ConsoleAPI";
import ConsoleSubscription from "./console/ConsoleSubscription";
import ConsoleTeam from "./console/ConsoleTeam";
import ConsoleSettings from "./console/ConsoleSettings";
import MiningModes from "./console/MiningModes";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { LanguageContext } from "../App";

type TabType =
  | "dashboard"
  | "agents"
  | "api"
  | "subscription"
  | "team"
  | "settings"
  | "modes";

const Console: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useContext(LanguageContext);
  const [devToolsVisible, setDevToolsVisible] = useState(false);

  // 显示开发工具条
  useEffect(() => {
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    if (isLocalhost && !loading && !user) {
      setDevToolsVisible(true);
    } else {
      setDevToolsVisible(false);
    }
  }, [user, loading]);

  const tabs = [
    {
      id: "dashboard" as TabType,
      name:
        t.console?.sidebar?.dashboard ||
        (lang === "cn" ? "仪表板" : "Dashboard"),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "modes" as TabType,
      name: lang === "cn" ? "挖掘模式" : "Mining Modes",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "agents" as TabType,
      name: t.console?.sidebar?.agents || "Agents",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "api" as TabType,
      name:
        t.console?.sidebar?.api || (lang === "cn" ? "API 密钥" : "API Keys"),
      icon: <Key className="w-5 h-5" />,
    },
    {
      id: "subscription" as TabType,
      name:
        t.console?.sidebar?.subscription ||
        (lang === "cn" ? "订阅" : "Subscription"),
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "team" as TabType,
      name: t.console?.sidebar?.team || (lang === "cn" ? "团队" : "Team"),
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "settings" as TabType,
      name:
        t.console?.sidebar?.settings || (lang === "cn" ? "设置" : "Settings"),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ConsoleDashboard />;
      case "modes":
        return <MiningModes switchToAgents={() => setActiveTab("agents")} />;
      case "agents":
        return <ConsoleAgents />;
      case "api":
        return <ConsoleAPI />;
      case "subscription":
        return <ConsoleSubscription />;
      case "team":
        return <ConsoleTeam />;
      case "settings":
        return <ConsoleSettings />;
      default:
        return <ConsoleDashboard />;
    }
  };

  const quickLoginDevUser = async () => {
    try {
      console.log('🔧 Quick Login Dev User clicked...');
      const response = await fetch('/api/test/init-dev-user');

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        console.log('✅ Manual dev user login successful:', data.user);
        window.location.reload(); // 刷新页面以应用新 token
      } else {
        const error = await response.json();
        console.error('❌ Manual login failed:', error);
        alert(`Login failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Manual login error:', error);
      alert('Network error. Please check console.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      {/* 网格背景 */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40"></div>
      {/* 扫描线动画 */}
      <div className="scanline"></div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#050505] border-r border-[#1a1a1a] h-screen sticky top-0 z-40">
        {/* Logo/Header - toUI Style */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-sm">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tighter text-white uppercase">
                Niche Digger
              </h1>
              <p className="text-[10px] text-emerald-500 font-mono tracking-tighter">
                BLUE OCEAN PROTOCOL
              </p>
            </div>
          </div>
        </div>

        {/* User Info - toUI Style */}
        <div className="px-4 py-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-sm relative overflow-hidden group">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-[#151515] border border-[#252525] flex items-center justify-center rounded-sm text-emerald-500">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || user.email}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {user?.name ||
                    user?.email ||
                    (lang === "cn" ? "本地开发测试用户" : "Local Dev User")}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-emerald-500 font-mono">
                    {lang === "cn" ? "专业版: 有效" : "Pro: Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - toUI Style */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group relative ${
                activeTab === tab.id
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {tab.icon}
              <span className="text-xs font-medium tracking-wide">
                {tab.name}
              </span>
              {activeTab === tab.id && (
                <div className="absolute left-0 w-1 h-2/3 bg-emerald-500 rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Utility Buttons - toUI Style */}
        <div className="px-4 py-2 border-t border-[#1a1a1a]">
          <div className="grid grid-cols-3 gap-2">
            <a
              href="#"
              className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#0a0a0a] border border-[#1a1a1a] text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
              title={lang === "cn" ? "返回首页" : "Home"}
            >
              <Home className="w-4 h-4" />
              <span className="text-[8px] font-mono mt-1 opacity-60 group-hover:opacity-100">
                HOME
              </span>
            </a>
            <button
              onClick={() => setLang(lang === "en" ? "cn" : "en")}
              className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#0a0a0a] border border-[#1a1a1a] text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
              title={lang === "cn" ? "中英切换" : "Language"}
            >
              <Globe className="w-4 h-4" />
              <span className="text-[8px] font-mono mt-1 opacity-60 group-hover:opacity-100">
                CN/EN
              </span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#0a0a0a] border border-[#1a1a1a] text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
              title={lang === "cn" ? "夜间模式" : "Theme"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="text-[8px] font-mono mt-1 opacity-60 group-hover:opacity-100">
                NIGHT
              </span>
            </button>
          </div>
        </div>

        {/* Footer Console Stats - toUI Style */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="text-[9px] font-mono text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>UPTIME</span>
              <span className="text-emerald-900">99.98%</span>
            </div>
            <div className="flex justify-between">
              <span>NODES</span>
              <span className="text-emerald-900">ACTIVE: 124</span>
            </div>
            <div className="flex justify-between">
              <span>VERSION</span>
              <span className="text-emerald-900">V2.8.5</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border z-50 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black">
              <span className="font-bold text-sm">NM</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Niche Digger</h2>
              <p className="text-xs text-zinc-500 font-mono">CONSOLE</p>
            </div>
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 px-3 py-2 bg-surface rounded-sm border border-border">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || user.email}
                className="w-10 h-10 rounded-full border border-primary/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold">
                  {user?.name?.[0] || user?.email?.[0]}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                {t.console?.userInfo?.currentPlan ||
                  (lang === "cn" ? "当前套餐" : "Current Plan")}
                :{" "}
                <span className="text-primary">
                  {lang === "cn" ? "免费版" : "Free"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider transition-all border ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-primary"
                  : "text-zinc-400 hover:text-white hover:bg-surface/50 border-border hover:border-primary/50"
              }`}
            >
              <span className="w-5 h-5">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Language Toggle, Theme Toggle & Back Home */}
        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={() => {
              toggleTheme();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 border border-border hover:border-primary/50 transition-all"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span>
              {theme === "dark"
                ? lang === "cn"
                  ? "白天模式"
                  : "Light Mode"
                : lang === "cn"
                ? "夜间模式"
                : "Dark Mode"}
            </span>
          </button>
          <button
            onClick={() => {
              setLang(lang === "en" ? "cn" : "en");
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 border border-border hover:border-primary/50 transition-all"
          >
            <Globe className="w-5 h-5" />
            <span>{lang === "en" ? "English" : "中文"}</span>
          </button>
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 border border-border hover:border-primary/50 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>
              {t.console?.sidebar?.backHome ||
                (lang === "cn" ? "返回首页" : "Home")}
            </span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        {/* Header - toUI Style (Desktop) */}
        <header className="hidden lg:flex h-16 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {lang === "cn" ? "仪表板" : "Dashboard"}
                <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                  DASHBOARD_V2
                </span>
              </h2>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                {lang === "cn"
                  ? "账户活动和性能概览"
                  : "Overview of your account activity and performance"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-mono text-emerald-500">
                SYSTEM_ONLINE // STABLE
              </span>
            </div>
          </div>
        </header>

        {/* Top Bar - Mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#050505] border-b border-[#1a1a1a] p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center text-black border border-primary">
                <span className="font-bold text-sm font-mono">NM</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm font-mono">
                  Niche Digger
                </h2>
                <p className="text-xs text-zinc-500 font-mono">CONSOLE</p>
              </div>
            </div>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Area with Grid Background */}
        <div className="p-8 max-w-[1600px] mx-auto w-full">
          {renderContent()}
        </div>

        {/* Development Tools Bar */}
        {devToolsVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-accent-orange/20 border-t-2 border-accent-orange/50 p-3 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 bg-accent-orange/30 text-accent-orange font-mono text-xs font-bold uppercase tracking-wider">
                  DEV MODE
                </div>
                <span className="text-sm text-zinc-300 font-mono">
                  Not logged in. Quick login for testing:
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={quickLoginDevUser}
                  className="px-4 py-2 bg-accent-orange text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-orange/90 transition-all"
                >
                  Login Dev User
                </button>
                <button
                  onClick={() => window.open('http://localhost:3000/api/test/init-dev-user', '_blank')}
                  className="px-3 py-1 bg-black text-zinc-400 hover:text-white font-mono text-xs border border-zinc-700 hover:border-zinc-500 transition-all"
                >
                  Inspect API
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer - toUI Style */}
        <footer className="mt-auto border-t border-[#1a1a1a] bg-[#050505] px-8 py-3 flex items-center gap-4 text-[10px] font-mono text-gray-600">
          <span className="text-emerald-500">root@miner:~#</span>
          <span className="animate-pulse">_</span>
          <div className="flex-1"></div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>{" "}
              LATENCY: 24ms
            </span>
            <span className="flex items-center gap-1 text-emerald-500">
              SECURE_PROTOCOL: ACTIVE
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Console;
