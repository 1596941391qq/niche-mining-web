
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TerminalWidget from './components/TerminalWidget';
import ActivityChart from './components/ActivityChart';
import DesignSystem from './components/DesignSystem';
import { NavItem, CreditStats } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<NavItem>(NavItem.DASHBOARD);
  
  const stats: CreditStats = {
    remaining: 10000,
    total: 10000,
    used: 0,
    successRate: 100,
    packageType: '专业版'
  };

  const renderContent = () => {
    if (activeItem === NavItem.SETTINGS) {
      return <DesignSystem />;
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Top Section: Credits Overview */}
        <TerminalWidget 
          title="积分概览" 
          subtitle={`当前套餐: ${stats.packageType}`}
          icon={<Icons.Key />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: '剩余积分', value: stats.remaining.toLocaleString(), color: 'text-emerald-500' },
              { label: '总积分', value: stats.total.toLocaleString(), color: 'text-white' },
              { label: '已使用', value: stats.used.toLocaleString(), color: 'text-gray-400' },
              { label: '成功率', value: `${stats.successRate}%`, color: 'text-white' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#050505] border border-[#1a1a1a] p-5 rounded-sm group hover:border-[#10B981]/20 transition-all">
                <p className="text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-tighter">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold tracking-tighter ${stat.color} font-mono`}>
                    {stat.value}
                  </span>
                  {idx === 0 && <span className="text-[10px] text-emerald-900 font-mono">CREDITS_AVAIL</span>}
                </div>
              </div>
            ))}
          </div>
        </TerminalWidget>

        {/* Middle Section: Visualization & Status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <TerminalWidget 
            title="最近7天花费" 
            subtitle="按模式分类的每日 Credits 消耗" 
            className="xl:col-span-2"
            icon={<Icons.Mining />}
          >
            <ActivityChart />
          </TerminalWidget>

          <TerminalWidget title="系统日志" subtitle="实时挖掘状态反馈" icon={<div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>}>
            <div className="space-y-3 font-mono text-[10px] overflow-hidden">
              {[
                { time: '14:22:05', msg: '初始化 crawler 协议...', status: 'OK' },
                { time: '14:22:08', msg: '目标: 低竞争 / 高意向 关键词', status: 'WAIT' },
                { time: '14:22:12', msg: '正在扫描 SERP: 深度 10...', status: 'ACTIVE' },
                { time: '14:23:45', msg: '检测到: "Weak Forum" 排名位置 #3', status: 'FOUND' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-gray-500 border-l border-[#1a1a1a] pl-3 py-1 hover:text-emerald-500 transition-colors">
                  <span className="text-gray-700">{log.time}</span>
                  <span className="flex-1 truncate">&gt; {log.msg}</span>
                  <span className={log.status === 'FOUND' ? 'text-emerald-500 font-bold' : ''}>[{log.status}]</span>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-sm bg-emerald-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white uppercase">高价值挖掘机会</p>
                    <p className="text-[9px] text-emerald-500">DETECTED_OPPORTUNITY_04</p>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">"best ceramic coatings for diy"</h4>
              </div>
            </div>
          </TerminalWidget>
        </div>

        {/* Bottom Section: Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '关键词挖掘', desc: '全自动循环挖掘“蓝海词”。', color: 'border-emerald-500/30' },
            { title: 'AI 内容生成', desc: '基于竞争对手分析生成高质量文章。', color: 'border-blue-500/30' },
            { title: '代理网络', desc: '全球 50+ 节点高匿名爬取数据。', color: 'border-purple-500/30' },
          ].map((mode, i) => (
            <div key={i} className={`p-6 bg-[#0a0a0a] border ${mode.color} rounded-sm relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}>
              <h3 className="text-lg font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-xs text-gray-500 mb-6">{mode.desc}</p>
              <div className="flex items-center text-[10px] font-mono text-emerald-500 uppercase tracking-widest gap-2">
                <span>启动任务</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40"></div>
      <div className="scanline"></div>

      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <main className="flex-1 relative z-10 flex flex-col">
        <header className="h-16 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {activeItem === NavItem.SETTINGS ? '设计规范' : '仪表板'}
                <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                  {activeItem === NavItem.SETTINGS ? 'SPEC_GUIDE_V1' : 'DASHBOARD_V2'}
                </span>
              </h2>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                {activeItem === NavItem.SETTINGS ? '工程还原与组件标准参考' : '账户活动和性能概览'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-mono text-emerald-500">SYSTEM_ONLINE // STABLE</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full">
          {renderContent()}
        </div>

        <footer className="mt-auto border-t border-[#1a1a1a] bg-[#050505] px-8 py-3 flex items-center gap-4 text-[10px] font-mono text-gray-600">
           <span className="text-emerald-500">root@miner:~#</span>
           <span className="animate-pulse">_</span>
           <div className="flex-1"></div>
           <div className="flex gap-4">
             <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500"></span> LATENCY: 24ms</span>
             <span className="flex items-center gap-1 text-emerald-500">SECURE_PROTOCOL: ACTIVE</span>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
