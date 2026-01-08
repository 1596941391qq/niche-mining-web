import React, { useContext } from 'react';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Pricing: React.FC = () => {
  const { t, lang } = useLanguage();

  const plans = [
    {
      name: lang === 'cn' ? '初创者 (Starter)' : 'Starter',
      price: '$0',
      description: lang === 'cn' ? '注册即送，足够完成 2 篇全链路内容测试。' : 'Claim on registration, enough for 2 full-link content tests.',
      credits: '200',
      features: lang === 'cn' ? 
        ['200 免费生产点数', '全链路生产线访问', '基础 AI 代理支持', '工业白皮书访问'] : 
        ['200 Free Production Credits', 'Full-link Pipeline Access', 'Basic AI Agent Support', 'Technical Documentation'],
      cta: lang === 'cn' ? '立即开始' : 'Start Now',
      color: 'zinc',
      icon: Zap
    },
    {
      name: lang === 'cn' ? '统治者 (Domination)' : 'Domination',
      price: '$30',
      description: lang === 'cn' ? '适合个人站长，产出 20 篇高权重图文或挖掘 1000 个词。' : 'Perfect for solopreneurs, output 20 high-weight articles or mine 1000 keywords.',
      credits: '2,000',
      features: lang === 'cn' ? 
        ['2,000 生产点数', '优先队列生产', '高级 AIO/GEO 优化', '视觉指纹合成系统', '优先技术支持'] : 
        ['2,000 Production Credits', 'Priority Production Queue', 'Advanced AIO/GEO Optimization', 'Visual Fingerprint System', 'Priority Support'],
      cta: lang === 'cn' ? '开启统治' : 'Start Domination',
      color: 'orange',
      recommended: true,
      icon: Shield
    },
    {
      name: lang === 'cn' ? '专业版 (Professional)' : 'Professional',
      price: '$150',
      description: lang === 'cn' ? '内容帝国基石，产出 100 篇全链路内容。' : 'The foundation of your content empire, output 100 full-link contents.',
      credits: '10,000',
      features: lang === 'cn' ? 
        ['10,000 生产点数', '独占计算通道', '深度市场真空扫描', '无限资产级配图', '1对1 专家咨询'] : 
        ['10,000 Production Credits', 'Dedicated Compute Channel', 'Deep Market Vacuum Scanning', 'Unlimited Asset-grade Visuals', '1-on-1 Expert Consultation'],
      cta: lang === 'cn' ? '建立帝国' : 'Build Empire',
      color: 'emerald',
      icon: Crown
    }
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-zinc-900/[0.2] bg-[size:20px_20px]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 lg:mb-6 font-mono tracking-tight">
            {lang === 'cn' ? '投资方案 (The Investment Plans)' : 'The Investment Plans'}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-mono">
            {lang === 'cn' ? '停止无效支出，开始为确定性收益投资。' : 'Stop wasting budget, start investing in certainty.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative group flex flex-col p-8 bg-surface border transition-all duration-500 hover:translate-y-[-8px] ${
                plan.color === 'orange' ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]' : 
                plan.color === 'emerald' ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 
                'border-border hover:border-zinc-700'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-sm z-20">
                  Recommended
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-6 border ${
                  plan.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
                  plan.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                  'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-white font-mono">{plan.price}</span>
                  <span className="text-zinc-500 text-sm font-mono">/ {lang === 'cn' ? '一次性' : 'One-time'}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed min-h-[48px]">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                  <span className={`text-2xl font-bold font-mono ${
                    plan.color === 'orange' ? 'text-orange-500' :
                    plan.color === 'emerald' ? 'text-emerald-500' :
                    'text-zinc-300'
                  }`}>{plan.credits}</span>
                  <span className="text-xs text-zinc-500 uppercase font-mono tracking-tighter">
                    {lang === 'cn' ? '生产点数' : 'Production Credits'}
                  </span>
                </div>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                      plan.color === 'orange' ? 'text-orange-500' :
                      plan.color === 'emerald' ? 'text-emerald-500' :
                      'text-zinc-500'
                    }`} />
                    <span className="text-zinc-400">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 font-bold text-sm uppercase tracking-widest transition-all rounded-sm group-hover:shadow-lg ${
                plan.color === 'orange' ? 'bg-orange-500 text-black hover:bg-orange-400' :
                plan.color === 'emerald' ? 'bg-emerald-500 text-black hover:bg-emerald-400' :
                'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
              }`}>
                {plan.cta}
              </button>
              
              <p className="text-center mt-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                {plan.price === '$0' ? 'NO CREDIT CARD REQUIRED' : 'SECURE INDUSTRIAL PAYMENT'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
