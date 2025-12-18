import React, { useContext } from 'react';
import { ExternalLink, ArrowRight, Cpu, Radio, Crosshair } from 'lucide-react';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';

// --- Custom SVG Droid Illustrations ---

const GoogleMinerGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
        <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.05 }} />
      </linearGradient>
    </defs>
    
    {/* Base Platform / Treads */}
    <path d="M40 140 L100 170 L160 140 L100 110 Z" fill="#18181b" stroke="#10b981" strokeWidth="2" />
    <path d="M40 140 L40 155 L100 185 L160 155 L160 140" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
    
    {/* Main Body Block */}
    <path d="M60 120 L120 150 L120 90 L60 60 Z" fill="url(#grad1)" stroke="#10b981" strokeWidth="2" />
    <path d="M120 150 L140 140 L140 80 L120 90" fill="#27272a" stroke="#10b981" strokeWidth="2" />
    <path d="M60 60 L120 90 L140 80 L80 50 Z" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />

    {/* Server Rack Details */}
    <line x1="120" y1="100" x2="60" y2="70" stroke="#10b981" strokeWidth="1" />
    <line x1="120" y1="110" x2="60" y2="80" stroke="#10b981" strokeWidth="1" />
    <line x1="120" y1="120" x2="60" y2="90" stroke="#10b981" strokeWidth="1" />
    <line x1="120" y1="130" x2="60" y2="100" stroke="#10b981" strokeWidth="1" />

    {/* Antenna/Sensor */}
    <line x1="80" y1="50" x2="80" y2="20" stroke="#10b981" strokeWidth="2" />
    <circle cx="80" cy="20" r="4" fill="#10b981" className="animate-pulse" />
  </svg>
);

const YandexRadarGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
    <defs>
      <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
        <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.0 }} />
      </radialGradient>
    </defs>

    {/* Base Stand */}
    <ellipse cx="100" cy="160" rx="40" ry="20" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2"/>
    <path d="M100 160 L100 120" stroke="#10b981" strokeWidth="4" />
    
    {/* Dish Structure */}
    <path d="M50 80 Q100 140 150 80" fill="url(#grad2)" stroke="#10b981" strokeWidth="2" />
    <ellipse cx="100" cy="80" rx="50" ry="15" fill="none" stroke="#10b981" strokeWidth="2" />
    
    {/* Concentric Circles (Signal) */}
    <ellipse cx="100" cy="80" rx="30" ry="8" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.6" />
    <ellipse cx="100" cy="80" rx="10" ry="3" fill="#10b981" />

    {/* Antenna Spike */}
    <line x1="100" y1="80" x2="100" y2="40" stroke="#10b981" strokeWidth="2" />
    <path d="M100 40 L80 20 M100 40 L120 20" stroke="#10b981" strokeWidth="2" />
    
    {/* Scanning Waves */}
    <path d="M70 30 Q100 10 130 30" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse" opacity="0.5" />
  </svg>
);

const BingDroneGraphic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
    {/* Floating Shadow */}
    <ellipse cx="100" cy="170" rx="30" ry="10" fill="#10b981" opacity="0.1" className="animate-pulse" />

    {/* Central Core */}
    <path d="M100 140 L130 120 L130 80 L100 60 L70 80 L70 120 Z" fill="#18181b" stroke="#10b981" strokeWidth="2" />
    <path d="M70 80 L100 100 L130 80" fill="none" stroke="#10b981" strokeWidth="1" />
    <path d="M100 100 L100 140" fill="none" stroke="#10b981" strokeWidth="1" />

    {/* Eye / Lens */}
    <circle cx="100" cy="95" r="8" fill="#10b981" />
    <circle cx="100" cy="95" r="12" fill="none" stroke="#10b981" strokeWidth="1" className="animate-spin-slow" />

    {/* Wings/Rotors */}
    <path d="M70 90 L40 80 L40 100 L70 110" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1" />
    <path d="M130 90 L160 80 L160 100 L130 110" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1" />

    {/* Data Streams */}
    <line x1="100" y1="140" x2="100" y2="160" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

const ToolSelector: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const { authenticated, getToken, login } = useAuth();
  const [loadingTool, setLoadingTool] = useState<string | null>(null); // 追踪正在加载的工具

  const getGraphic = (id: string) => {
    switch(id) {
      case 'google': return <GoogleMinerGraphic />;
      case 'yandex': return <YandexRadarGraphic />;
      case 'bing': return <BingDroneGraphic />;
      default: return <GoogleMinerGraphic />;
    }
  };

  const getModelId = (id: string) => {
    switch(id) {
        case 'google': return 'MK-I HEAVY';
        case 'yandex': return 'SAT-V2 SCAN';
        case 'bing': return 'AERO-X PROBE';
        default: return 'UNK-00';
    }
  }

  const getAgentUrl = (id: string) => {
    switch(id) {
      case 'google': return 'https://google-seo-agen-ts-lans.vercel.app/';
      case 'yandex': return 'https://yandex-seo-agents.vercel.app/';
      case 'bing': return 'https://bing-seo-agen-ts-lans.vercel.app/';
      default: return '#';
    }
  }

  const handleToolClick = async (e: React.MouseEvent<HTMLAnchorElement>, toolId: string) => {
    e.preventDefault();

    // 检查登录状态
    if (!authenticated) {
      // 可以显示提示或直接跳转登录
      if (window.confirm('Please login first to access this tool. Do you want to login now?')) {
        login();
      }
      return;
    }

    // 防止重复点击
    if (loadingTool) {
      return;
    }

    try {
      // 设置 loading 状态
      setLoadingTool(toolId);

      // 1. 获取当前用户的 JWT token
      const token = getToken();
      if (!token) {
        alert('Please login first');
        setLoadingTool(null);
        return;
      }

      // 2. 调用 API 生成 Transfer Token
      const response = await fetch('/api/auth/create-transfer-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create transfer token');
      }

      const { transferToken } = await response.json();

      // 3. 在新标签页打开子项目，传递 Transfer Token
      const baseUrl = getAgentUrl(toolId);
      const urlWithToken = `${baseUrl}?tt=${transferToken}`;
      window.open(urlWithToken, '_blank', 'noopener,noreferrer');

      // 成功后延迟重置 loading（给用户视觉反馈）
      setTimeout(() => {
        setLoadingTool(null);
      }, 1000);

    } catch (error) {
      console.error('Launch agent error:', error);
      alert('Failed to launch agent. Please try again.');
      setLoadingTool(null);
    }
  }

  return (
    <section id="agents" className="py-24 relative bg-background">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(39,39,42,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.4)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/20 bg-primary/5 rounded-sm">
             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
             <span className="text-xs font-mono text-primary uppercase tracking-widest">{t.tools.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {t.tools.heading}
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {t.tools.subheading}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {t.tools.items.map((tool, index) => {
            return (
              <div
                key={tool.id}
                className="group relative flex flex-col bg-surface/50 backdrop-blur-sm border border-border transition-all duration-300 hover:border-primary hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] h-full overflow-hidden"
              >
                {/* Header Strip */}
                <div className="flex justify-between items-center p-4 border-b border-border bg-black/40">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        UNIT {String(index + 1).padStart(2, '0')} // {getModelId(tool.id)}
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* 3D Illustration Area */}
                <div className="h-64 w-full relative bg-zinc-900/50 flex items-center justify-center p-8 border-b border-border group-hover:bg-zinc-900/80 transition-colors">
                   {/* Tech overlay lines */}
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#10b981_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                   
                   {/* The SVG Graphic */}
                   <div className="w-48 h-48 transform group-hover:scale-110 transition-transform duration-500 ease-out">
                     {getGraphic(tool.id)}
                   </div>

                   {/* Corner Markers */}
                   <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-primary opacity-50"></div>
                   <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-primary opacity-50"></div>
                   <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-primary opacity-50"></div>
                   <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-primary opacity-50"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col relative bg-zinc-900/20">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors font-mono tracking-tighter">
                          {tool.name}
                        </h3>
                        <div className="w-full h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                    </div>

                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                        {tool.desc}
                    </p>

                    <div className="space-y-4 mb-8 flex-1">
                        {tool.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                                <Crosshair className="w-3 h-3 text-primary" />
                                <span>{feat}</span>
                            </div>
                        ))}
                    </div>

                    <a
                      href={getAgentUrl(tool.id)}
                      onClick={(e) => handleToolClick(e, tool.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-4 bg-transparent border ${
                        !authenticated
                          ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                          : loadingTool === tool.id
                          ? 'border-primary/50 text-primary/70 cursor-wait'
                          : 'border-zinc-600 text-zinc-300 hover:bg-primary hover:text-black hover:border-primary cursor-pointer'
                      } font-bold text-sm transition-all flex items-center justify-between px-6 uppercase tracking-wider group/btn`}
                    >
                        <span>
                          {loadingTool === tool.id
                            ? (t.tools.action === 'LAUNCH AGENT' ? 'LAUNCHING...' : '启动中...')
                            : t.tools.action
                          }
                        </span>
                        {loadingTool === tool.id ? (
                          // Loading Spinner
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <ExternalLink className={`w-4 h-4 transform ${authenticated ? 'group-hover/btn:translate-x-1' : ''} transition-transform`} />
                        )}
                    </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolSelector;