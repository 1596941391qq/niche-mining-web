import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Comparison: React.FC = () => {
  const { t } = useLanguage();

  if (!t.howItWorks.invincible) return null;

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.02)_0%,transparent_70%)]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-mono tracking-tight uppercase">
            {t.howItWorks.invincible.title}
          </h2>
          <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">
            Deterministic Dominance vs Manual Inefficiency
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {t.howItWorks.invincible.items.map((item, idx) => (
            <div
              key={idx}
              className={`relative p-1 rounded-sm group overflow-hidden ${
                idx === 1
                  ? "bg-gradient-to-br from-primary/40 via-primary/5 to-primary/40 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
                  : "bg-zinc-800/30"
              }`}
            >
              <div
                className={`relative h-full bg-zinc-950 p-6 sm:p-10 flex flex-col border ${
                  idx === 1 ? "border-primary/50" : "border-zinc-800"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                  <span
                    className={`font-mono text-xs uppercase tracking-[0.3em] font-bold ${
                      idx === 1 ? "text-primary" : "text-zinc-600"
                    }`}
                  >
                    {idx === 0
                      ? "TRADITIONAL MODEL"
                      : "NICHEDIGGER PROTOCOL"}
                  </span>
                  {idx === 1 && (
                    <div className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase animate-pulse">
                      Asymmetric Adv.
                    </div>
                  )}
                </div>

                <h3
                  className={`text-3xl font-bold mb-10 font-mono ${
                    idx === 1 ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Steps List */}
                <div className="space-y-6 flex-grow">
                  {item.desc.split(" -> ").map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-4 group/step"
                    >
                      <div
                        className={`mt-1.5 w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === 1
                            ? "bg-primary shadow-[0_0_10px_#10b981]"
                            : "bg-zinc-800"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-mono transition-colors duration-300 ${
                          idx === 1
                            ? "text-zinc-300 group-hover/step:text-primary"
                            : "text-zinc-600"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Stats for NicheDigger */}
                {idx === 1 && (
                  <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 font-mono uppercase mb-1">
                        Production Rate
                      </p>
                      <p className="text-xl font-bold text-primary font-mono">
                        10X FASTER
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 font-mono uppercase mb-1">
                        Success Probability
                      </p>
                      <p className="text-xl font-bold text-primary font-mono">
                        DETERMINISTIC
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Comparison;
