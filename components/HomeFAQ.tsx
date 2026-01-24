import React, { useContext } from 'react';
import { HelpCircle } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const HomeFAQ: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-zinc-900/[0.2] bg-[size:20px_20px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-sm flex items-center justify-center border border-primary/30">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-mono tracking-tight">
              {t.faq.title}
            </h2>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-mono">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {t.faq.questions.map((item, index) => (
            <div
              key={index}
              className="bg-surface/50 backdrop-blur-sm border border-border p-6 md:p-8 hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 border-l-2 border-primary/30 pl-4">
                {item.question}
              </h3>
              <p className="text-zinc-300 leading-relaxed pl-4">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
