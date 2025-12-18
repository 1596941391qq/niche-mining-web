import React, { useContext } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { LanguageContext } from '../App';

const Privacy: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '';
            window.history.replaceState(null, '', window.location.pathname);
            window.scrollTo(0, 0);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors mb-8 text-sm font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.privacy.back}
        </a>

        <div className="bg-surface/50 backdrop-blur-sm border border-border p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <div className="w-12 h-12 bg-primary/20 rounded-sm flex items-center justify-center border border-primary/30">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t.privacy.title}</h1>
              <p className="text-zinc-400 text-sm font-mono">Last Updated: {t.privacy.lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            {t.privacy.sections.map((section, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-6">
                <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                <div className="text-zinc-300 leading-relaxed space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-white mb-4">{t.privacy.contact.title}</h2>
              <p className="text-zinc-300 mb-2">{t.privacy.contact.content}</p>
              <div className="space-y-2">
                <p className="text-zinc-300 font-mono">{t.privacy.contact.company || 'Soulcraft Limited'}</p>
                <a 
                  href={`mailto:${t.privacy.contact.email}`}
                  className="text-primary hover:text-[#34d399] transition-colors font-mono"
                >
                  {t.privacy.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

