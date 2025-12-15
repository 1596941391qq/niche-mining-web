import React, { useState, useContext } from 'react';
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
  Globe
} from 'lucide-react';
import ConsoleDashboard from './console/ConsoleDashboard';
import ConsoleAgents from './console/ConsoleAgents';
import ConsoleAPI from './console/ConsoleAPI';
import ConsoleSubscription from './console/ConsoleSubscription';
import ConsoleTeam from './console/ConsoleTeam';
import ConsoleSettings from './console/ConsoleSettings';
import { useAuth } from '../contexts/AuthContext';
import { LanguageContext } from '../App';

type TabType = 'dashboard' | 'agents' | 'api' | 'subscription' | 'team' | 'settings';

const Console: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { lang, setLang, t } = useContext(LanguageContext);

  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: t.console?.sidebar?.dashboard || (lang === 'cn' ? '仪表板' : 'Dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'agents' as TabType,
      name: t.console?.sidebar?.agents || 'Agents',
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: 'api' as TabType,
      name: t.console?.sidebar?.api || (lang === 'cn' ? 'API 密钥' : 'API Keys'),
      icon: <Key className="w-5 h-5" />,
    },
    {
      id: 'subscription' as TabType,
      name: t.console?.sidebar?.subscription || (lang === 'cn' ? '订阅' : 'Subscription'),
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 'team' as TabType,
      name: t.console?.sidebar?.team || (lang === 'cn' ? '团队' : 'Team'),
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'settings' as TabType,
      name: t.console?.sidebar?.settings || (lang === 'cn' ? '设置' : 'Settings'),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ConsoleDashboard />;
      case 'agents':
        return <ConsoleAgents />;
      case 'api':
        return <ConsoleAPI />;
      case 'subscription':
        return <ConsoleSubscription />;
      case 'team':
        return <ConsoleTeam />;
      case 'settings':
        return <ConsoleSettings />;
      default:
        return <ConsoleDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-surface/50 border-r border-border">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black">
              <span className="font-bold text-sm">NM</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">NICHE MINING</h2>
              <p className="text-xs text-zinc-500 font-mono">CONSOLE</p>
            </div>
          </a>
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
              <p className="text-xs text-zinc-500 font-mono truncate">
                {t.console?.userInfo?.currentPlan || (lang === 'cn' ? '当前套餐' : 'Current Plan')}:{' '}
                <span className="text-primary">{lang === 'cn' ? '免费版' : 'Free'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-zinc-400 hover:text-white hover:bg-surface/50'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Language Toggle & Back Home */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'cn' : 'en')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 transition-all"
          >
            <Globe className="w-5 h-5" />
            <span>{lang === 'en' ? 'English' : '中文'}</span>
          </button>
          <a
            href="#"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>{t.console?.sidebar?.backHome || (lang === 'cn' ? '返回首页' : 'Back to Home')}</span>
          </a>
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
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black">
              <span className="font-bold text-sm">NM</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">NICHE MINING</h2>
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
                {t.console?.userInfo?.currentPlan || (lang === 'cn' ? '当前套餐' : 'Current Plan')}:{' '}
                <span className="text-primary">{lang === 'cn' ? '免费版' : 'Free'}</span>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-zinc-400 hover:text-white hover:bg-surface/50'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Language Toggle & Back Home */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => {
              setLang(lang === 'en' ? 'cn' : 'en');
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 transition-all"
          >
            <Globe className="w-5 h-5" />
            <span>{lang === 'en' ? 'English' : '中文'}</span>
          </button>
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono text-zinc-400 hover:text-white hover:bg-surface/50 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>{t.console?.sidebar?.backHome || (lang === 'cn' ? '返回首页' : 'Back to Home')}</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black">
                <span className="font-bold text-sm">NM</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">NICHE MINING</h2>
                <p className="text-xs text-zinc-500 font-mono">CONSOLE</p>
              </div>
            </div>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Console;
