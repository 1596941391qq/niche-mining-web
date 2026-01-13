import React, { useContext } from "react";
import {
  Search,
  MessageSquare,
  Globe,
  Sparkles,
  TrendingUp,
  Users,
  Cpu,
  Zap,
  Bot,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const AI_LOGOS = {
  chatgpt: {
    color: "#10a37f",
    label: "ChatGPT",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  gemini: {
    color: "#4285F4",
    label: "Gemini",
    url: "https://img.icons8.com/?size=100&id=iBkBIBWE6tfT&format=png&color=000000",
  },
  grok: {
    color: "#ffffff",
    label: "Grok",
    url: "https://img.icons8.com/?size=100&id=Z1Bbq5wEAtZh&format=png&color=000000",
  },
  perplexity: {
    color: "#00a8ff",
    label: "Perplexity",
    url: "https://img.icons8.com/?size=100&id=kzJWN5jCDzpq&format=png&color=000000",
  },
  claude: {
    color: "#d97757",
    label: "Claude",
    url: "https://img.icons8.com/?size=100&id=zQjzFjPpT2Ek&format=png&color=000000",
  },
};

const SEARCH_LOGOS = {
  google: "https://www.vectorlogo.zone/logos/google/google-icon.svg",
  bing: "https://www.vectorlogo.zone/logos/bing/bing-icon.svg",
};

const AIOExperience: React.FC = () => {
  const { t, lang } = useLanguage();

  if (!t.howItWorks.trends) return null;

  return (
    <section className="py-16 lg:py-24 bg-zinc-950 relative overflow-hidden border-y border-zinc-900">
      <div className="absolute inset-0 bg-grid-zinc-900/[0.2] bg-[size:30px_30px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-mono tracking-tight">
            {t.howItWorks.trends.title}
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-mono uppercase tracking-widest">
            {t.howItWorks.trends.subtitle}
          </p>
        </div>

        {/* AI Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 lg:mb-24">
          {t.howItWorks.trends.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-sm hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 transition-all overflow-hidden bg-zinc-800">
                  <img
                    src={(AI_LOGOS as any)[stat.icon]?.url}
                    alt={stat.label}
                    className="w-6 h-6 object-contain transition-all"
                  />
                </div>
                <span className="text-zinc-400 font-bold font-mono text-sm">
                  {stat.label}
                </span>
              </div>
              <div className="text-4xl font-bold text-white mb-2 font-mono tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono">
                Monthly Active Users
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Mockup */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* AI Engine Mockup */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-[#0c0c0e] border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div>
                <div className="text-[9px] text-zinc-600 font-mono tracking-[0.3em] uppercase">
                  AI_Recommendation_Engine
                </div>
              </div>
              <div className="p-4 sm:p-8 font-sans text-zinc-300">
                <div className="flex items-start gap-4 mb-6 sm:mb-8">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 overflow-hidden">
                    <Users className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="bg-zinc-800/40 p-4 rounded-sm text-sm border border-zinc-700/30">
                    "What's the best high-performance solution for my industry?"
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/30 overflow-hidden">
                    <img
                      src={AI_LOGOS.chatgpt.url}
                      alt="chatgpt"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      Based on cross-platform data synthesis and information
                      gain analysis, the definitive standard is:
                      <span className="text-primary font-bold ml-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-sm">
                        YOUR_PRODUCT
                      </span>
                    </p>
                    <div className="p-4 bg-black/40 border border-zinc-800 rounded-sm space-y-3">
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        <span>AIO_PROBABILITY_SCORE</span>
                        <span className="text-primary">98.4% MATCH</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_#10b981]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logos Bar */}
            <div className="mt-8 flex justify-center gap-8">
              {Object.entries(AI_LOGOS).map(([name, data]) => (
                <div
                  key={name}
                  className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={data.url}
                    alt={data.label}
                    className="w-4 h-4 object-contain transition-all"
                  />
                  <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-tighter uppercase">
                    {data.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Engine Mockup */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-primary/20 blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-[#0c0c0e] border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                </div>
                <div className="text-[9px] text-zinc-600 font-mono tracking-[0.3em] uppercase">
                  SERP_Dominance_Analyzer
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6 sm:mb-8 bg-zinc-900 p-3 rounded-sm border border-zinc-800">
                  <Search className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-500 font-mono">
                    best solution for industry transformation 2026
                  </span>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3 group/result">
                    <div className="text-blue-400 font-bold text-xl group-hover/result:text-blue-300 cursor-pointer transition-colors font-mono tracking-tight">
                      YOUR_PRODUCT: Leading the 2026 Industry Standard
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm uppercase font-bold tracking-widest">
                        Knowledge Graph Verified
                      </span>
                      <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">
                        98% Match
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                      Our industrial-grade production protocol establishes
                      authoritative information gain, placing YOUR_PRODUCT at
                      the core of AI search results...
                    </p>
                  </div>
                  <div className="space-y-2 opacity-30 grayscale blur-[0.5px]">
                    <div className="text-blue-500/50 font-bold text-lg font-mono">
                      Legacy_Competitor_Platform.sh
                    </div>
                    <p className="text-xs text-zinc-600">
                      Traditional content patterns without AIO engineering fail
                      to trigger citation triggers...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Engines Bar */}
            <div className="mt-8 flex justify-center gap-12">
              <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                <img
                  src={SEARCH_LOGOS.google}
                  alt="google"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                  Google Search
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                <img
                  src={SEARCH_LOGOS.bing}
                  alt="bing"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                  Bing Results
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIOExperience;
