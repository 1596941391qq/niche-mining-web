import React, { useContext } from 'react';
import { RefreshCcw, FileText, Target, Layers, Box } from 'lucide-react';
import { LanguageContext } from '../App';

const Features: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const icons = [RefreshCcw, Layers, Box, Target];

  return (
    <section id="how-it-works" className="py-24 bg-surface border-y border-border relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t.features.heading}
            </h2>
            <p className="text-zinc-400 text-lg">
              {t.features.subheading}
            </p>
            {t.features.description && (
              <p className="text-primary text-base mt-4 font-medium">
                {t.features.description}
              </p>
            )}
          </div>
          <div className="h-px bg-zinc-800 flex-1 md:mx-12 self-center hidden md:block"></div>
          <div className="text-primary font-mono text-sm whitespace-nowrap bg-primary/10 px-3 py-1 border border-primary/20 rounded">
            ALGORITHM: RECURSIVE_DEPTH_V2
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.features.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="tech-border bg-background p-8 hover:bg-zinc-900/80 transition-all group hover:-translate-y-1 duration-300"
              >
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                     <Icon className="w-6 h-6" />
                   </div>
                   <span className="text-5xl font-bold text-zinc-800 font-mono select-none group-hover:text-zinc-700 transition-colors">
                     0{index + 1}
                   </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors font-mono">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 pt-4 group-hover:border-zinc-700 transition-colors">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;