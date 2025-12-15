import React, { useState } from 'react';
import {
  LayoutDashboard,
  Coins,
  Key,
  Crown,
  Users,
  Settings,
  ChevronRight,
  X,
  Menu
} from 'lucide-react';
import ConsoleDashboard from './console/ConsoleDashboard';
import ConsoleCredits from './console/ConsoleCredits';
import ConsoleAPI from './console/ConsoleAPI';
import ConsoleSubscription from './console/ConsoleSubscription';
import ConsoleTeam from './console/ConsoleTeam';
import ConsoleSettings from './console/ConsoleSettings';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'dashboard' | 'credits' | 'api' | 'subscription' | 'team' | 'settings';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const Console: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'credits', label: 'Credits', icon: <Coins className="w-5 h-5" />, badge: '1,000' },
    { id: 'api', label: 'API Keys', icon: <Key className="w-5 h-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <Crown className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ConsoleDashboard />;
      case 'credits':
        return <ConsoleCredits />;
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
    <div className="min-h-screen bg-background pt-24">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 border-r border-border bg-surface/30 backdrop-blur-sm fixed left-0 top-24 bottom-0 overflow-y-auto">
          <div className="p-6">
            {/* User Info */}
            <div className="mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-primary/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{user?.name || 'User'}</p>
                  <p className="text-zinc-500 text-xs truncate font-mono">{user?.email}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs font-mono text-primary uppercase tracking-wider">
                <Crown className="w-3 h-3" />
                Free Plan
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-sm text-sm font-mono uppercase tracking-wider transition-all group ${
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-zinc-400 hover:text-white hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                  {activeTab === item.id && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <aside
              className="absolute left-0 top-0 bottom-0 w-80 bg-background border-r border-border overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">Console</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* User Info */}
                <div className="mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || 'User'}
                        className="w-12 h-12 rounded-full border-2 border-primary/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {user?.name?.[0] || user?.email?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{user?.name || 'User'}</p>
                      <p className="text-zinc-500 text-xs truncate font-mono">{user?.email}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs font-mono text-primary uppercase tracking-wider">
                    <Crown className="w-3 h-3" />
                    Free Plan
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-sm text-sm font-mono uppercase tracking-wider transition-all ${
                        activeTab === item.id
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'text-zinc-400 hover:text-white hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-24 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                {navItems.find(item => item.id === activeTab)?.label}
              </h1>
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Console;
