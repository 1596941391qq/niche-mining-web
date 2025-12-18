import React, { useContext } from 'react';
import { Pickaxe } from 'lucide-react';
import { LanguageContext } from '../App';

const Footer: React.FC = () => {
  const { t } = useContext(LanguageContext);
  
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Pickaxe className="w-5 h-5 text-primary" />
              <span className="font-bold text-white tracking-tight">NICHE MINING</span>
            </div>
            <p className="text-zinc-500 max-w-sm">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">{t.footer.product}</h4>
            <ul className="space-y-3 text-zinc-500">
              <li><a href="#" className="hover:text-primary transition-colors">Google Agent</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Yandex Agent</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bing Agent</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">{t.footer.legal}</h4>
            <ul className="space-y-3 text-zinc-500">
              <li><a href="#privacy" className="hover:text-primary transition-colors">{t.footer.privacyLink}</a></li>
              <li><a href="#terms" className="hover:text-primary transition-colors">{t.footer.termsLink}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-600 font-mono text-xs">
          <div className="flex flex-col gap-1">
            <p>{t.footer.rights}</p>
            <p className="text-zinc-500">
              {t.footer.company || 'Soulcraft Limited'} | <a href={`mailto:${t.footer.email || 'soulcraftlimited@galatea.bar'}`} className="hover:text-primary transition-colors">{t.footer.email || 'soulcraftlimited@galatea.bar'}</a>
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
             <span>{t.footer.system}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
