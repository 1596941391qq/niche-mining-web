import React, { useContext, useState } from "react";
import { ExternalLink, ArrowRight, Cpu, Radio, Crosshair, UserCheck, Search, Layout, Image as ImageIcon, Zap, Shield, BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./auth/LoginModal";

const ToolSelector: React.FC = () => {
  const { t, lang } = useLanguage();
  const { authenticated, getToken, login } = useAuth();
  const [loadingTool, setLoadingTool] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const getAgentUrl = (id: string) => {
    switch (id) {
      case "google":
        return "https://google-seo-agen-ts-lans.vercel.app/";
      case "yandex":
        return "https://yandex-seo-agents.vercel.app/";
      case "bing":
        return "https://bing-seo-agen-ts-lans.vercel.app/";
      default:
        return "https://google-seo-agen-ts-lans.vercel.app/";
    }
  };

  const agents = [
    {
      id: 'google',
      name: t.tools.items[0].name,
      role: lang === 'cn' ? '战略大脑' : 'Strategic Brain',
      desc: t.tools.items[0].desc,
      icon: Search,
      color: 'emerald',
      features: t.tools.items[0].features,
      avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=strategist&backgroundColor=059669"
    },
    {
      id: 'yandex',
      name: t.tools.items[1].name,
      role: lang === 'cn' ? '工程主管' : 'Engineering Lead',
      desc: t.tools.items[1].desc,
      icon: Layout,
      color: 'blue',
      features: t.tools.items[1].features,
      avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=architect&backgroundColor=2563eb"
    },
    {
      id: 'bing',
      name: t.tools.items[2].name,
      role: lang === 'cn' ? '质量主管' : 'Quality Lead',
      desc: t.tools.items[2].desc,
      icon: Shield,
      color: 'orange',
      features: t.tools.items[2].features,
      avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=qa&backgroundColor=f97316"
    }
  ];

  const handleToolClick = async (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    if (!authenticated) {
      setLoginModalOpen(true);
      return;
    }
    if (loadingTool) return;

    try {
      setLoadingTool(toolId);
      const token = getToken();
      if (!token) {
        alert("Please login first");
        setLoadingTool(null);
        return;
      }

      const response = await fetch("/api/auth/create-transfer-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create transfer token");
      const { transferToken } = await response.json();
      const baseUrl = getAgentUrl(toolId);
      window.open(`${baseUrl}?tt=${transferToken}`, "_blank", "noopener,noreferrer");
      
      setTimeout(() => setLoadingTool(null), 1000);
    } catch (error) {
      console.error("Launch agent error:", error);
      alert("Failed to launch agent. Please try again.");
      setLoadingTool(null);
    }
  };

  return (
    <section id="agents" className="py-16 lg:py-24 relative bg-background overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(39,39,42,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.2)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 lg:mb-8 border border-primary/30 bg-primary/10 rounded-sm">
            <Zap className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest font-bold">
              {t.tools.badge}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 lg:mb-8 tracking-tight font-mono uppercase">
            {t.tools.heading}
          </h2>
          <p className="text-zinc-400 text-lg lg:text-xl leading-relaxed border-l-4 border-primary/30 pl-8 text-left max-w-2xl mx-auto italic">
            {t.tools.subheading}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {agents.map((agent, index) => (
            <div 
              key={agent.id}
              className="group relative bg-zinc-900/40 border border-zinc-800 rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]"
            >
              {/* Card Header with Avatar */}
              <div className="relative h-48 bg-zinc-950 flex items-center justify-center border-b border-zinc-800 group-hover:bg-zinc-900 transition-colors">
                <div className="absolute inset-0 bg-grid-zinc-800/20 bg-[size:20px_20px]"></div>
                <div className="relative w-32 h-32 rounded-full border-2 border-zinc-800 p-1 bg-zinc-900 group-hover:border-primary/30 transition-colors">
                  <img 
                    src={agent.avatar} 
                    alt={agent.name}
                    className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-primary shadow-xl group-hover:border-primary group-hover:scale-110 transition-all">
                    <agent.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <div className="mb-6">
                  <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-bold">
                    {agent.role}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-primary transition-colors font-mono">
                    {agent.name}
                  </h3>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 min-h-[60px]">
                  {agent.desc}
                </p>

                <div className="space-y-3 mb-10">
                  {agent.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3 text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 pointer-events-none skew-x-[-45deg] translate-x-8 translate-y-[-8px]"></div>
            </div>
          ))}
        </div>

        {/* Unified Agent Badge */}
        <div className="mt-16 lg:mt-24 p-8 lg:p-12 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-sm text-center max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex -space-x-4">
              {agents.map((agent) => (
                <div key={agent.id} className="w-12 h-12 rounded-full border-2 border-zinc-950 overflow-hidden bg-zinc-900">
                  <img src={agent.avatar} alt="avatar" className="w-full h-full grayscale opacity-70" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg font-mono">
                {lang === 'cn' ? '所有专家模块已集成至全能 Agent' : 'All expert modules integrated into the Almighty Agent'}
              </p>
              <p className="text-zinc-500 text-sm font-mono mt-1 uppercase tracking-widest">
                Autopilot mode enabled // Zero human intervention required
              </p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onGoogleLogin={() => {
          setLoginModalOpen(false);
          login();
        }}
      />
    </section>
  );
};

export default ToolSelector;
