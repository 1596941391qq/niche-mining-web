import React, { useContext, useState } from "react";
import {
  Target,
  Workflow,
  Sparkles,
  Bot,
  Wrench,
  CheckCircle2,
  Search,
  Cpu,
  Box,
  Activity,
  ArrowRight,
  Factory,
  Zap,
  ShieldCheck,
  Microscope,
  LineChart,
  Globe,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const HowItWorks: React.FC = () => {
  const { t, lang } = useLanguage();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const stepIcons = [Microscope, Factory, Zap, LineChart];

  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-28 bg-background relative overflow-hidden"
    >
      {/* Industrial Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-grid-zinc-900/[0.1] bg-[size:40px_40px]"></div>

      {/* Decorative vertical lines */}
      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-zinc-800/50 hidden lg:block"></div>
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800/50 hidden lg:block"></div>
      <div className="absolute left-3/4 top-0 bottom-0 w-px bg-zinc-800/50 hidden lg:block"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/20 bg-primary/5 rounded-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-[0.3em] font-bold">
              {t.howItWorks.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 lg:mb-8 tracking-tighter uppercase font-mono italic">
            {t.howItWorks.workflow.title}
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-mono uppercase tracking-widest mb-10 lg:mb-12">
            {t.howItWorks.workflow.description}
          </p>

          {/* Dual Mission Layer - Retrieval vs Synthesis */}
          {t.howItWorks.dualMission && (
            <div className="grid lg:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto text-left">
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="w-24 h-24 text-primary" />
                </div>
                <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                  L1: Retrieval Layer (SEO)
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                  {t.howItWorks.dualMission.retrieval.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {t.howItWorks.dualMission.retrieval.desc}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Long-tail
                    Coverage
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Domain
                    Authority
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-24 h-24 text-accent-orange" />
                </div>
                <div className="inline-block px-3 py-1 bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-[10px] font-bold uppercase tracking-widest mb-6">
                  L2: Synthesis Layer (AIO)
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                  {t.howItWorks.dualMission.synthesis.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {t.howItWorks.dualMission.synthesis.desc}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent-orange" /> AI
                    Citation Rate
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent-orange" /> GEO
                    Optimization
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Creation Chain */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
            {t.howItWorks.factors &&
              t.howItWorks.factors.items.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm hover:bg-zinc-900 transition-all"
                >
                  <div className="text-primary font-mono text-[10px] uppercase tracking-widest mb-3">
                    Ranking Dim // 0{idx + 1}
                  </div>
                  <h4 className="text-white font-bold mb-2 font-mono uppercase">
                    {factor.category}
                  </h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    {factor.details}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* The Pipeline Visualization */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 relative">
            {/* Horizontal progress bar background */}
            <div className="absolute top-[80px] left-0 right-0 h-1 bg-zinc-900 hidden lg:block"></div>

            {t.howItWorks.workflow.steps.map((step, index) => {
              const StepIcon = stepIcons[index] || Workflow;
              const isHovered = activeStep === index;

              return (
                <div
                  key={step.id}
                  className="relative flex-1 group"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Step Connector - Desktop */}
                  {index < t.howItWorks.workflow.steps.length - 1 && (
                    <div className="absolute top-[80px] left-1/2 w-full h-1 bg-primary/20 hidden lg:block overflow-hidden">
                      <div
                        className={`h-full bg-primary transition-all duration-1000 ${
                          isHovered ? "translate-x-0" : "-translate-x-full"
                        }`}
                      ></div>
                    </div>
                  )}

                  {/* Node Circle */}
                  <div
                    className={`relative z-20 w-16 h-16 mx-auto lg:mb-12 rounded-sm border-2 flex items-center justify-center transition-all duration-500 ${
                      isHovered
                        ? "bg-primary border-primary rotate-45 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                        : "bg-zinc-950 border-zinc-800"
                    }`}
                  >
                    <StepIcon
                      className={`w-8 h-8 transition-all duration-500 ${
                        isHovered
                          ? "text-black -rotate-45 scale-110"
                          : "text-zinc-700"
                      }`}
                    />
                  </div>

                  {/* Card Content */}
                  <div
                    className={`mt-8 lg:mt-0 p-6 sm:p-8 border transition-all duration-500 bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden ${
                      isHovered
                        ? "border-primary/50 bg-zinc-900/60 -translate-y-2"
                        : "border-zinc-800"
                    }`}
                  >
                    {/* Background number */}
                    <div className="absolute -right-4 -bottom-8 text-8xl font-bold text-zinc-800/10 font-mono select-none">
                      0{index + 1}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 font-mono uppercase tracking-wider">
                      {step.title}
                    </h3>

                    <p className="text-zinc-500 text-sm mb-6 leading-relaxed min-h-[40px]">
                      <span className="text-primary font-mono text-[10px] mr-2">
                        CAPABILITY:
                      </span>
                      {index === 0 &&
                        (lang === "cn"
                          ? "发现竞争对手还没察觉的蓝海词，锁定容易排名的精准流量。"
                          : "Discover hidden low-competition keywords for an easy traffic boost.")}
                      {index === 1 &&
                        (lang === "cn"
                          ? "全自动生成专家级原创内容，完美符合谷歌收录标准，告别 AI 洗稿降权。"
                          : "Auto-generate expert-level original content that Google loves, avoiding AI penalties.")}
                      {index === 2 &&
                        (lang === "cn"
                          ? "一键全自动同步上站，自动打造高权重博客矩阵。"
                          : "One-click auto-posting to WordPress and more. Build a high-authority blog matrix instantly.")}
                      {index === 3 &&
                        (lang === "cn"
                          ? "实时查看每一篇文章带来的真实收益，让增长看得见摸得着。"
                          : "Track real revenue from every single post in real-time.")}
                    </p>

                    <div
                      className={`p-4 border-l-2 transition-all duration-500 ${
                        isHovered
                          ? "bg-primary/10 border-primary"
                          : "bg-zinc-800/30 border-zinc-700"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2 ${
                          isHovered ? "text-primary" : "text-zinc-600"
                        }`}
                      >
                        {index === 2 ? "Unique Visual SEO Asset" : "OUTPUT"}
                      </p>
                      <p
                        className={`text-sm transition-colors duration-500 ${
                          isHovered ? "text-white" : "text-zinc-400"
                        }`}
                      >
                        {step.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
