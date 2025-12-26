import React, { useContext } from "react";
import { Building2, ArrowLeft } from "lucide-react";
import { LanguageContext } from "../App";

const AboutUs: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
            window.history.replaceState(null, "", window.location.pathname);
            window.scrollTo(0, 0);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
          }}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors mb-8 text-sm font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.about.back}
        </a>

        <div className="bg-surface/50 backdrop-blur-sm border border-border p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <div className="w-12 h-12 bg-primary/20 rounded-sm flex items-center justify-center border border-primary/30">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {t.about.title}
              </h1>
              <p className="text-zinc-400 text-sm font-mono">
                {t.about.subtitle}
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Company Description */}
            <div className="border-l-2 border-primary/30 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t.about.companyInfo.title}
              </h2>
              <div className="text-zinc-300 leading-relaxed space-y-4">
                {t.about.companyInfo.content.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Company Details */}
            <div className="border-l-2 border-primary/30 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t.about.companyDetails.title}
              </h2>
              <div className="text-zinc-300 leading-relaxed space-y-4">
                <div className="bg-background/50 border border-border p-6 rounded-sm font-mono text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-zinc-400">
                        {t.about.companyDetails.companyName}:
                      </span>
                      <p className="text-white font-semibold mt-1">
                        {t.about.companyDetails.companyNameValue}
                      </p>
                      <p className="text-zinc-300 mt-1">
                        {t.about.companyDetails.chineseCompanyName}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <span className="text-zinc-400">
                        {t.about.companyDetails.businessRegNo}:
                      </span>
                      <p className="text-white mt-1">78413906</p>
                    </div>
                    <div>
                      <span className="text-zinc-400">
                        {t.about.companyDetails.incorporationDate}:
                      </span>
                      <p className="text-white mt-1">05-Jul-2025</p>
                    </div>
                    <div>
                      <span className="text-zinc-400">
                        {t.about.companyDetails.companyType}:
                      </span>
                      <p className="text-white mt-1">
                        Private company limited by shares
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-400">
                        {t.about.companyDetails.companyStatus}:
                      </span>
                      <p className="text-green-500 mt-1">Live</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-white mb-4">
                {t.about.contact.title}
              </h2>
              <p className="text-zinc-300 mb-2">{t.about.contact.content}</p>
              <div className="space-y-2">
                <p className="text-zinc-300 font-mono">
                  {t.about.contact.company || "Soulcraft Limited"}
                </p>
                <a
                  href={`mailto:${t.about.contact.email}`}
                  className="text-primary hover:text-[#34d399] transition-colors font-mono"
                >
                  {t.about.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
