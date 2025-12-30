import React, { useContext, useState, useEffect } from 'react';
import { Search, Activity, Terminal, ShieldAlert, Cpu, ChevronRight } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [termLine, setTermLine] = useState(0);
  
  // Simulated terminal logs
  const logs = [
    '> Initializing crawler protocol...',
    '> Target: Low competition / High Intent',
    '> Scanning SERP: Depth 10...',
    '> DETECTED: "Weak Forum" in Pos #3',
    '> STATUS: Opportunity Verified.',
    '> PREPARING REPORT...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTermLine((prev) => (prev + 1) % logs.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-36 pb-24 lg:pt-52 lg:pb-40 overflow-hidden bg-grid-pattern grid-bg">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Copy */}
          <div className="text-left relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-primary/30 bg-primary/10 rounded-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <span className="text-xs font-mono text-primary tracking-[0.2em] uppercase font-bold">{t.hero.badge}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1] text-white whitespace-pre-line drop-shadow-lg">
              {t.hero.title}
            </h1>

            <p className="text-lg text-zinc-400 mb-12 max-w-xl leading-relaxed border-l-2 border-primary/50 pl-6">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#agents" className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-[#34d399] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                {t.hero.ctaPrimary}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-zinc-300 font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-zinc-800 transition-all hover:border-zinc-500">
                {t.hero.ctaSecondary}
              </button>
            </div>

            <div className="mt-16 flex items-center gap-8 text-xs font-mono text-zinc-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary"></div>
                {t.hero.stats_efficiency}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-600"></div>
                {t.hero.stats_depth}
              </div>
            </div>
          </div>

          {/* Right Column: Visual (Terminal/Scanner) */}
          <div className="relative group perspective-1000">
             {/* Decorative framing */}
            <div className="absolute -inset-4 border border-zinc-800 opacity-50 rounded-sm"></div>
            <div className="absolute -inset-1 border border-primary/20 opacity-40 translate-x-2 translate-y-2 rounded-sm"></div>
            
            <div className="relative bg-[#0c0c0e] border border-border rounded-sm shadow-2xl overflow-hidden group-hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] transition-shadow duration-500">
              
              {/* Terminal Header */}
              <div className="bg-zinc-900/80 border-b border-zinc-800 p-3 flex justify-between items-center">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-900/50 border border-red-800"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-900/50 border border-yellow-800"></div>
                    <div className="w-3 h-3 rounded-full bg-green-900/50 border border-green-800"></div>
                 </div>
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Target_Acquisition.sh</span>
              </div>

              <div className="bg-black/90 p-6 font-mono text-sm min-h-[400px] flex flex-col relative">
                
                {/* Background Grid inside terminal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* Content */}
                <div className="flex-1 space-y-4 text-primary/80 relative z-10">
                   {logs.map((log, i) => (
                     <div key={i} className={`transition-all duration-300 flex gap-3 ${i === termLine ? 'text-primary' : 'text-zinc-600'}`}>
                       <span className="text-zinc-700 select-none">{String(i + 1).padStart(2, '0')}</span>
                       <span>{log}</span>
                     </div>
                   ))}
                   
                   {termLine > 2 && (
                    <div className="mt-8 p-4 border border-primary/30 bg-primary/5 relative overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/20 p-2 rounded-sm border border-primary/20">
                            <Cpu className="w-8 h-8 shrink-0 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-xs uppercase tracking-widest mb-1 text-primary">High Value Opportunity</div>
                            <div className="text-white font-bold text-lg tracking-tight">"best ceramic coatings for diy"</div>
                            <div className="text-xs text-emerald-200/50 mt-2 font-mono flex gap-2">
                                <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">Vol: 2.4k</span>
                                <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">KD: 12</span>
                            </div>
                          </div>
                       </div>
                    </div>
                   )}
                </div>

                {/* Input Line */}
                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2 text-zinc-400 relative z-10">
                  <span className="text-primary font-bold">{`root@miner:~#`}</span>
                  <span className="text-zinc-500">awaiting_instructions</span>
                  <span className="w-2 h-4 bg-primary animate-blink"></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;