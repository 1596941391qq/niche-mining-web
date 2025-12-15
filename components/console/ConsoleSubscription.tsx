import React from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Users,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

const ConsoleSubscription: React.FC = () => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      current: true,
      features: [
        '100 API calls/month',
        '1 API key',
        'Basic support',
        'Community access',
      ],
      limits: [
        '100 calls/month',
        '1 key max',
        'Email support only',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$49',
      period: 'month',
      popular: true,
      current: false,
      features: [
        '10,000 API calls/month',
        '5 API keys',
        'Priority support',
        'Advanced analytics',
        'Custom webhooks',
        'Team collaboration (3 members)',
      ],
      limits: [
        '10K calls/month',
        '5 keys max',
        '3 team members',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: 'month',
      current: false,
      features: [
        'Unlimited API calls',
        'Unlimited API keys',
        'Dedicated support',
        'Advanced analytics',
        'Custom webhooks',
        'Unlimited team members',
        'SLA guarantee (99.9%)',
        'Custom integrations',
        'On-premise deployment',
      ],
      limits: [
        'Unlimited calls',
        'Unlimited keys',
        'Unlimited team',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          Subscription
        </h1>
        <p className="text-zinc-400 text-sm">
          Upgrade your plan for more features and higher limits
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-primary/20 via-surface/50 to-surface/50 backdrop-blur-sm border border-primary/30 rounded-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded text-xs font-mono text-primary uppercase tracking-wider mb-3">
              <Crown className="w-3 h-3" />
              Current Plan
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Free Plan</h2>
            <p className="text-zinc-400">Perfect for getting started</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">$0</p>
            <p className="text-zinc-500 text-sm font-mono">/month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface/50 border border-border rounded p-4">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
              API Calls This Month
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">78</p>
              <span className="text-zinc-500 text-sm">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div className="bg-surface/50 border border-border rounded p-4">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
              API Keys
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">1</p>
              <span className="text-zinc-500 text-sm">/ 1</span>
            </div>
            <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="bg-surface/50 border border-border rounded p-4">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
              Next Billing
            </p>
            <p className="text-2xl font-bold text-white">--</p>
            <p className="text-xs text-zinc-500 mt-2">No billing scheduled</p>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-surface/50 backdrop-blur-sm border rounded-sm p-6 transition-all ${
                plan.current
                  ? 'border-primary/50 opacity-50'
                  : plan.popular
                  ? 'border-primary/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary border border-primary/30 rounded text-xs font-mono text-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Recommended
                  </div>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 right-6">
                  <div className="px-3 py-1 bg-surface border border-border rounded text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Current Plan
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm font-mono">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 min-h-[240px]">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.current}
                className={`w-full py-3 rounded-sm text-sm font-mono uppercase tracking-wider transition-all ${
                  plan.current
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white'
                }`}
              >
                {plan.current ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
        <h2 className="text-lg font-bold text-white mb-6 font-mono uppercase tracking-wider">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className="text-center py-3 px-4 text-sm font-mono text-zinc-400 uppercase tracking-wider"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">API Calls</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">100/mo</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">10K/mo</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">Unlimited</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">API Keys</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">1</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">5</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">Unlimited</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">Team Members</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">1</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">3</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">Unlimited</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">Support</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">Email</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">Priority</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">Dedicated</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-white">SLA</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">--</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">--</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">99.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
        <h2 className="text-lg font-bold text-white mb-6 font-mono uppercase tracking-wider">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-bold mb-2">Can I change my plan anytime?</h3>
            <p className="text-sm text-zinc-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">What happens if I exceed my API call limit?</h3>
            <p className="text-sm text-zinc-400">
              Your API calls will be throttled. You'll need to upgrade your plan or wait until the next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Do you offer refunds?</h3>
            <p className="text-sm text-zinc-400">
              We offer a 14-day money-back guarantee for all paid plans. Contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleSubscription;
