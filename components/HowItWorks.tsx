import React, { useContext, useState } from 'react';
import { Target, Workflow, Sparkles, Bot, Wrench, CheckCircle2, Search, Globe, Zap, ArrowRight } from 'lucide-react';
import { LanguageContext } from '../App';

const HowItWorks: React.FC = () => {
  const { t, lang } = useContext(LanguageContext);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const stepIcons = [Search, Globe, Zap];

  return (
    <section id="how-it-works" className="py-24 bg-background relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(39,39,42,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.4)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Core Value Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/20 bg-primary/5 rounded-sm">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">{t.howItWorks.badge}</span>
          </div>
          
          <div className="bg-surface border border-border p-8 md:p-12 tech-border">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-mono">
                  {t.howItWorks.coreValue.title}
                </h2>
                <h3 className="text-xl text-primary mb-4 font-semibold">
                  {t.howItWorks.coreValue.subtitle}
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {t.howItWorks.coreValue.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
              {t.howItWorks.workflow.title}
            </h2>
            <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
              {t.howItWorks.workflow.description}
            </p>
          </div>

          {/* Workflow Visualization */}
          <div className="relative mb-20">
            {/* Flow Chart Container */}
            <div className="relative pb-8 pt-16">
              <div className="flex flex-col md:flex-row items-stretch md:items-stretch justify-center gap-4 md:gap-4 px-4 w-full">
                {t.howItWorks.workflow.steps.map((step, index) => {
                  const StepIcon = stepIcons[index] || Workflow;
                  const isActive = activeStep === index;
                  const isHovered = activeStep !== null && activeStep === index;
                  
                  return (
                    <React.Fragment key={step.id}>
                      {/* Step Card */}
                      <div
                        className="relative group"
                        onMouseEnter={() => setActiveStep(index)}
                        onMouseLeave={() => setActiveStep(null)}
                      >
                        <div className={`
                          relative bg-surface border tech-border p-6 md:p-6 w-full md:w-80 md:h-full md:flex flex-col
                          transition-all duration-300 cursor-pointer z-10
                          ${isHovered ? 'border-primary md:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] z-20' : 'border-border'}
                        `}>
                          {/* Step Number Badge */}
                          <div className="absolute -top-4 -left-4 w-12 h-12 bg-zinc-900 border-2 border-primary rounded-full flex items-center justify-center z-30 shadow-lg">
                            <span className="text-xl font-bold text-primary font-mono">{step.id}</span>
                          </div>
                          
                          {/* Icon */}
                          <div className={`
                            w-16 h-16 mb-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0
                            transition-all duration-300
                            ${isHovered 
                              ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                              : 'bg-zinc-900 border-zinc-700'
                            }
                          `}>
                            <StepIcon className={`
                              w-8 h-8 transition-all duration-300
                              ${isHovered ? 'text-primary scale-110' : 'text-zinc-400'}
                            `} />
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-bold text-white mb-4 font-mono line-clamp-2 min-h-[3.5rem]">
                            {step.title.split('(')[0].trim()}
                          </h3>
                          
                          {/* Agents & Tools Count */}
                          <div className="flex gap-4 mb-4 text-xs flex-shrink-0">
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Bot className="w-4 h-4 flex-shrink-0" />
                              <span>{step.agents.length} AI 代理</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Wrench className="w-4 h-4 flex-shrink-0" />
                              <span>{step.tools.length} 工具</span>
                            </div>
                          </div>
                          
                          {/* Value Badge - 使用flex-grow确保底部对齐 */}
                          <div className="mt-auto">
                            {step.value && (
                              <div className="p-3 bg-primary/10 border-l-2 border-primary">
                                <p className="text-primary text-xs font-medium line-clamp-3">
                                  {step.value}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Hover Glow Effect */}
                          {isHovered && (
                            <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-sm"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Connector Arrow - Desktop */}
                      {index < t.howItWorks.workflow.steps.length - 1 && (
                        <>
                          <div className="hidden md:flex items-center justify-center relative w-12 flex-shrink-0">
                            {/* Animated Arrow Line */}
                            <div className="relative w-full h-0.5 bg-zinc-800 overflow-hidden">
                              <div className={`
                                absolute inset-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0
                                transition-all duration-500
                                ${isHovered || activeStep === index + 1 ? 'opacity-100 animate-pulse' : 'opacity-0'}
                              `}></div>
                            </div>
                            
                            {/* Arrow Head */}
                            <ArrowRight className={`
                              w-4 h-4 transition-all duration-300 flex-shrink-0
                              ${isHovered || activeStep === index + 1 ? 'text-primary' : 'text-zinc-700'}
                            `} />
                            
                            {/* Flow Animation Dots */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`
                                    absolute w-1.5 h-1.5 bg-primary rounded-full
                                    transition-all duration-300
                                    ${isHovered || activeStep === index + 1 
                                      ? 'opacity-100' 
                                      : 'opacity-0'
                                    }
                                  `}
                                  style={{
                                    left: `${i * 6 + 8}px`,
                                    animationDelay: `${i * 0.2}s`,
                                    animation: isHovered || activeStep === index + 1 
                                      ? 'flow 1.5s ease-in-out infinite' 
                                      : 'none'
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Connector Arrow - Mobile */}
                          <div className="md:hidden flex flex-col items-center justify-center my-6">
                            <ArrowRight className="w-6 h-6 text-zinc-700 rotate-90" />
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            
            {/* Detailed Info Panel (appears on hover) */}
            {activeStep !== null && (
              <div className="mt-16 max-w-4xl mx-auto animate-in z-30 relative">
                <div className="bg-surface border border-primary/30 tech-border p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary font-mono">
                        {t.howItWorks.workflow.steps[activeStep].id}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-mono">
                      {t.howItWorks.workflow.steps[activeStep].title}
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* AI Agents */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-5 h-5 text-primary" />
                        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono">AI 代理</h4>
                      </div>
                      {t.howItWorks.workflow.steps[activeStep].agents.map((agent, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/50 border border-zinc-800 p-3 hover:border-zinc-700 transition-all"
                        >
                          <p className="text-white font-semibold text-sm mb-1">{agent.name}</p>
                          <p className="text-zinc-400 text-xs leading-relaxed">{agent.desc}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Tools */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Wrench className="w-5 h-5 text-primary" />
                        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono">工具</h4>
                      </div>
                      {t.howItWorks.workflow.steps[activeStep].tools.map((tool, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/50 border border-zinc-800 p-3 hover:border-zinc-700 transition-all"
                        >
                          <p className="text-white font-semibold text-sm mb-1">{tool.name}</p>
                          <p className="text-zinc-400 text-xs leading-relaxed">{tool.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hint Text */}
            <div className="text-center mt-12 mb-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <p className="text-primary text-sm font-mono font-semibold tracking-wide">
                  {lang === 'cn' ? '悬停卡片查看详细信息' : 'Hover over cards to see details'}
                </p>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Customizable Workflow Section */}
        {t.howItWorks.workflow.customizable && (
          <div className="max-w-6xl mx-auto mt-20">
            <div className="bg-surface border border-border tech-border p-8 md:p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                  <Workflow className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 font-mono">
                    {t.howItWorks.workflow.customizable.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    {t.howItWorks.workflow.customizable.description}
                  </p>
                  {t.howItWorks.workflow.customizable.features && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {t.howItWorks.workflow.customizable.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/50 border border-zinc-800 p-4 hover:border-zinc-700 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-zinc-300 text-sm">{feature}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;

