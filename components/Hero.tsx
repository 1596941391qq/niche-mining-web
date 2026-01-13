import React, { useContext, useState, useEffect } from "react";
import {
  Search,
  Activity,
  Terminal,
  ShieldAlert,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [termLine, setTermLine] = useState(0);

  // Simulated terminal logs
  const logs = [
    "AUDIT: Analyzing SERP for intent gaps... FOUND [12]",
    "ENGINEERING: Injecting Information Gain markers... OK",
    "EEAT: Validating citation structures... VERIFIED",
    "INDEX: Mapping entities to Knowledge Graph... ACTIVE",
    "GROWTH: Linking pixel data to ROI stream... ON",
    "SYSTEM: Industrial HCU compliance active.",
    "STATUS: Production line at 100% capacity.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTermLine((prev) => (prev + 1) % logs.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [logs.length]);

  return (
    <div className="relative pt-24 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-grid-pattern grid-bg">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Copy */}
          <div className="text-left relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-orange-500/30 bg-orange-500/10 rounded-sm backdrop-blur-sm relative group overflow-hidden">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]"></span>
              <span className="text-xs font-mono text-orange-500 tracking-wider font-bold">
                [ 🎁 {t.hero.badge} ]
              </span>
              <div className="absolute inset-0 bg-orange-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-white whitespace-pre-line drop-shadow-lg">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg 2xl:text-xl text-zinc-400 mb-8 2xl:mb-12 max-w-xl 2xl:max-w-2xl leading-relaxed border-l-2 border-primary/50 pl-6 italic">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#console"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-[#34d399] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
              >
                {t.hero.ctaPrimary}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8 text-xs font-mono text-zinc-500 uppercase tracking-wider">
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
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Production_Queue_Monitor.v2
                </span>
              </div>

              <div className="bg-black/90 p-4 sm:p-6 2xl:p-10 font-mono text-xs sm:text-sm 2xl:text-base min-h-[350px] sm:min-h-[400px] 2xl:min-h-[500px] flex flex-col relative">
                {/* Background Grid inside terminal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* Content */}
                <div className="flex-1 space-y-4 text-primary/80 relative z-10">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`transition-all duration-300 flex gap-3 ${
                        i === termLine ? "text-primary" : "text-zinc-600"
                      }`}
                    >
                      <span className="text-zinc-700 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
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
                          <div className="font-bold text-xs uppercase tracking-widest mb-1 text-primary">
                            SERP INTENT GAP DETECTED
                          </div>
                          <div className="text-white font-bold text-lg tracking-tight">
                            "best ceramic coatings for diy"
                          </div>
                          <div className="text-xs text-emerald-200/50 mt-2 font-mono flex gap-2">
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                              Market Vacuum: YES
                            </span>
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                              Top 10 Content Gap: 85%
                            </span>
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
