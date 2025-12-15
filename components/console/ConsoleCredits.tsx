import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Download,
  ArrowUpRight,
  Sparkles,
  Zap,
  Calendar
} from 'lucide-react';

const ConsoleCredits: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const creditPlans = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 1000,
      price: '$10',
      pricePerCredit: '$0.01',
      popular: false,
      features: [
        '1,000 API Credits',
        'All SEO Agents',
        'Email Support',
        '30 Days Validity',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      credits: 5000,
      price: '$45',
      pricePerCredit: '$0.009',
      popular: true,
      features: [
        '5,000 API Credits',
        'All SEO Agents',
        'Priority Support',
        '60 Days Validity',
        '10% Bonus Credits',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 20000,
      price: '$160',
      pricePerCredit: '$0.008',
      popular: false,
      features: [
        '20,000 API Credits',
        'All SEO Agents',
        'Dedicated Support',
        '90 Days Validity',
        '20% Bonus Credits',
        'Custom Integration',
      ],
    },
  ];

  const usageHistory = [
    { date: '2025-12-15', action: 'Google Agent - Keyword Research', credits: -50, balance: 950 },
    { date: '2025-12-14', action: 'Yandex Agent - SERP Analysis', credits: -30, balance: 1000 },
    { date: '2025-12-14', action: 'Credits Purchased (Starter)', credits: +1000, balance: 1030 },
    { date: '2025-12-13', action: 'Bing Agent - Competition Check', credits: -40, balance: 30 },
    { date: '2025-12-12', action: 'Google Agent - Backlink Analysis', credits: -45, balance: 70 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          Credits
        </h1>
        <p className="text-zinc-400 text-sm">
          Manage your API credits and purchase more
        </p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-br from-primary/20 via-surface/50 to-surface/50 backdrop-blur-sm border border-primary/30 rounded-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Available Credits
              </p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-bold text-white">1,000</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded text-xs font-mono text-primary uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3" />
                  Active
                </div>
              </div>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/30 rounded">
              <Coins className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-surface/50 border border-border rounded p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Used This Month
              </p>
              <p className="text-2xl font-bold text-white">420</p>
            </div>
            <div className="bg-surface/50 border border-border rounded p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Expires In
              </p>
              <p className="text-2xl font-bold text-white">28 Days</p>
            </div>
            <div className="bg-surface/50 border border-border rounded p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Total Purchased
              </p>
              <p className="text-2xl font-bold text-white">5,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Plans */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
          Purchase Credits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-surface/50 backdrop-blur-sm border rounded-sm p-6 transition-all hover:border-primary/50 ${
                plan.popular
                  ? 'border-primary/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'border-border'
              } ${selectedPlan === plan.id ? 'ring-2 ring-primary/50' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary border border-primary/30 rounded text-xs font-mono text-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm font-mono">/once</span>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  {plan.pricePerCredit} per credit
                </p>
              </div>

              <div className="text-center mb-6 py-4 bg-primary/5 border border-primary/20 rounded">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-white">
                    {plan.credits.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                  API Credits
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-sm text-sm font-mono uppercase tracking-wider transition-all ${
                  plan.popular
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white'
                }`}
              >
                Purchase Credits
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage History */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Usage History
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white rounded-sm text-xs font-mono uppercase tracking-wider transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-right py-3 px-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="text-right py-3 px-4 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400 font-mono">{item.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-white">{item.action}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-sm font-mono font-bold ${
                        item.credits > 0 ? 'text-primary' : 'text-zinc-400'
                      }`}
                    >
                      {item.credits > 0 ? '+' : ''}
                      {item.credits}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-white font-mono">{item.balance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsoleCredits;
