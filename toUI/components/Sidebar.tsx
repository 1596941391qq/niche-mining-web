
import React from 'react';
import { NavItem } from '../types';
import { Icons, COLORS } from '../constants';

interface SidebarProps {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
  const navItems = [
    { id: NavItem.DASHBOARD, label: '仪表板', icon: Icons.Dashboard },
    { id: NavItem.MINING_MODE, label: '挖掘模式', icon: Icons.Mining },
    { id: NavItem.AGENTS, label: 'AGENTS', icon: Icons.Agents },
    { id: NavItem.API_KEYS, label: 'API 密钥', icon: Icons.Key },
    { id: NavItem.SUBSCRIPTION, label: '订阅', icon: Icons.Subscription },
    { id: NavItem.TEAM, label: '团队', icon: Icons.Team },
    { id: NavItem.SETTINGS, label: '设计规范', icon: Icons.Settings },
  ];

  return (
    <aside className="w-64 bg-[#050505] border-r border-[#1a1a1a] flex flex-col h-screen sticky top-0 z-40">
      {/* Branding */}
      <div className="p-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-sm">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tighter text-white uppercase">Niche Mining</h1>
            <p className="text-[10px] text-emerald-500 font-mono tracking-tighter">BLUE OCEAN PROTOCOL</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-6">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-sm relative overflow-hidden group">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-[#151515] border border-[#252525] flex items-center justify-center rounded-sm text-emerald-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-white">本地开发测试用户</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-emerald-500 font-mono">专业版: 有效</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group relative ${
              activeItem === item.id 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon />
            <span className="text-xs font-medium tracking-wide">{item.label}</span>
            {activeItem === item.id && (
              <div className="absolute left-0 w-1 h-2/3 bg-emerald-500 rounded-r-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* NEW Utility Bottom Buttons (Left Corner) */}
      <div className="px-4 py-2 border-t border-[#1a1a1a]">
        <div className="grid grid-cols-3 gap-2">
           <button 
             onClick={() => setActiveItem(NavItem.DASHBOARD)}
             className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#0a0a0a] border border-[#1a1a1a] text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
             title="返回首页"
           >
             <Icons.Home />
             <span className="text-[8px] font-mono mt-1 opacity-60 group-hover:opacity-100">HOME</span>
           </button>
           <button 
             className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#0a0a0a] border border-[#1a1a1a] text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
             title="中英切换"
           >
             <Icons.Language />
             <span className="text-[8px] font-mono mt-1 opacity-60 group-hover:opacity-100">CN/EN</span>
           </button>
           <button 
             className="flex flex-col items-center justify-center p-2 rounded-sm bg-[#0a0a0a] border border-[#1a1a1a] text-gray-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
             title="夜间模式"
           >
             <Icons.Moon />
             <span className="text-[8px] font-mono mt-1 opacity-60 group-hover:opacity-100">NIGHT</span>
           </button>
        </div>
      </div>

      {/* Footer Console Stats */}
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
  );
};

export default Sidebar;
