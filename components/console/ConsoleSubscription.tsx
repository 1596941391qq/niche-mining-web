import React, { useContext } from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  ArrowUpRight,
  TrendingUp,
  X
} from 'lucide-react';
import { LanguageContext } from '../../App';

const ConsoleSubscription: React.FC = () => {
  const { lang } = useContext(LanguageContext);

  const plans = [
    {
      id: 'free',
      name: lang === 'cn' ? '免费版' : 'Free',
      price: '$0',
      period: lang === 'cn' ? '永久' : 'forever',
      credits: 2000,
      current: true,
      features: lang === 'cn'
        ? [
            '每月 2000 API Credits',
            '1 个 API 密钥',
            '基础支持',
            '社区访问',
          ]
        : [
            '2000 API Credits/month',
            '1 API key',
            'Basic support',
            'Community access',
          ],
      limits: lang === 'cn'
        ? ['2000 credits/月', '1个密钥', '仅邮件支持']
        : ['2000 credits/mo', '1 key max', 'Email support only'],
    },
    {
      id: 'pro',
      name: lang === 'cn' ? '专业版' : 'Professional',
      price: '$49',
      period: lang === 'cn' ? '每月' : 'month',
      credits: 50000,
      popular: true,
      current: false,
      features: lang === 'cn'
        ? [
            '每月 50,000 API Credits',
            '5 个 API 密钥',
            '优先支持',
            '高级分析',
            '自定义 Webhooks',
            '团队协作（3成员）',
          ]
        : [
            '50,000 API Credits/month',
            '5 API keys',
            'Priority support',
            'Advanced analytics',
            'Custom webhooks',
            'Team collaboration (3 members)',
          ],
      limits: lang === 'cn'
        ? ['50K credits/月', '5个密钥', '3个团队成员']
        : ['50K credits/mo', '5 keys max', '3 team members'],
    },
    {
      id: 'enterprise',
      name: lang === 'cn' ? '企业版' : 'Enterprise',
      price: '$199',
      period: lang === 'cn' ? '每月' : 'month',
      credits: 999999,
      current: false,
      features: lang === 'cn'
        ? [
            '无限 API Credits',
            '无限 API 密钥',
            '专属支持',
            '高级分析',
            '自定义 Webhooks',
            '无限团队成员',
            'SLA 保障（99.9%）',
            '自定义集成',
            '私有化部署',
          ]
        : [
            'Unlimited API Credits',
            'Unlimited API keys',
            'Dedicated support',
            'Advanced analytics',
            'Custom webhooks',
            'Unlimited team members',
            'SLA guarantee (99.9%)',
            'Custom integrations',
            'On-premise deployment',
          ],
      limits: lang === 'cn'
        ? ['无限 credits', '无限密钥', '无限团队']
        : ['Unlimited credits', 'Unlimited keys', 'Unlimited team'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          {lang === 'cn' ? '订阅套餐' : 'Subscription'}
        </h1>
        <p className="text-zinc-400 text-sm">
          {lang === 'cn'
            ? '升级套餐以获取更多 Credits 和高级功能'
            : 'Upgrade your plan for more credits and advanced features'}
        </p>
      </div>

      {/* Current Plan with Credits */}
      <div className="bg-gradient-to-br from-primary/20 via-surface/50 to-surface/50 backdrop-blur-sm border border-primary/30 rounded-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded text-xs font-mono text-primary uppercase tracking-wider mb-3">
              <Crown className="w-3 h-3" />
              {lang === 'cn' ? '当前套餐' : 'Current Plan'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {lang === 'cn' ? '免费版' : 'Free Plan'}
            </h2>
            <p className="text-zinc-400">
              {lang === 'cn' ? '适合入门使用' : 'Perfect for getting started'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">$0</p>
            <p className="text-zinc-500 text-sm font-mono">
              /{lang === 'cn' ? '月' : 'month'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface/50 border border-border rounded p-4">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
              {lang === 'cn' ? '本月已用 Credits' : 'Credits Used This Month'}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">420</p>
              <span className="text-zinc-500 text-sm">/ 2000</span>
            </div>
            <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '21%' }}></div>
            </div>
          </div>
          <div className="bg-surface/50 border border-border rounded p-4">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
              {lang === 'cn' ? '剩余 Credits' : 'Remaining Credits'}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-primary">1,580</p>
              <span className="text-zinc-500 text-sm">credits</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {lang === 'cn' ? '下月 1 日重置' : 'Resets on 1st'}
            </p>
          </div>
          <div className="bg-surface/50 border border-border rounded p-4">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
              {lang === 'cn' ? 'API 密钥' : 'API Keys'}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">1</p>
              <span className="text-zinc-500 text-sm">/ 1</span>
            </div>
            <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
          {lang === 'cn' ? '可用套餐' : 'Available Plans'}
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
                    {lang === 'cn' ? '推荐' : 'Recommended'}
                  </div>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 right-6">
                  <div className="px-3 py-1 bg-surface border border-border rounded text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {lang === 'cn' ? '当前套餐' : 'Current Plan'}
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

              {/* Credits Display */}
              <div className="text-center mb-6 py-4 bg-primary/5 border border-primary/20 rounded">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-white">
                    {plan.credits === 999999
                      ? '∞'
                      : plan.credits.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                  {lang === 'cn' ? 'API Credits / 月' : 'API Credits / mo'}
                </p>
              </div>

              <ul className="space-y-3 mb-6 min-h-[200px]">
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
                {plan.current
                  ? lang === 'cn'
                    ? '当前套餐'
                    : 'Current Plan'
                  : lang === 'cn'
                  ? '立即升级'
                  : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
        <h2 className="text-lg font-bold text-white mb-6 font-mono uppercase tracking-wider">
          {lang === 'cn' ? '功能对比' : 'Feature Comparison'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-mono text-zinc-400 uppercase tracking-wider">
                  {lang === 'cn' ? '功能' : 'Feature'}
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
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? 'API Credits' : 'API Credits'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">2K/mo</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">50K/mo</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">
                  {lang === 'cn' ? '无限' : 'Unlimited'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? 'API 密钥' : 'API Keys'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">1</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">5</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">
                  {lang === 'cn' ? '无限' : 'Unlimited'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? '团队成员' : 'Team Members'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">1</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">3</td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">
                  {lang === 'cn' ? '无限' : 'Unlimited'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? '技术支持' : 'Support'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">
                  {lang === 'cn' ? '邮件' : 'Email'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">
                  {lang === 'cn' ? '优先' : 'Priority'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-primary font-bold">
                  {lang === 'cn' ? '专属' : 'Dedicated'}
                </td>
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
          {lang === 'cn' ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-bold mb-2">
              {lang === 'cn' ? '我可以随时更改套餐吗？' : 'Can I change my plan anytime?'}
            </h3>
            <p className="text-sm text-zinc-400">
              {lang === 'cn'
                ? '是的，您可以随时升级或降级套餐。更改将在下一个计费周期生效。'
                : 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'}
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">
              {lang === 'cn'
                ? '如果超出了 API Credits 额度会怎样？'
                : 'What happens if I exceed my API credit limit?'}
            </h3>
            <p className="text-sm text-zinc-400">
              {lang === 'cn'
                ? '您的 API 调用将被限流。您需要升级套餐或等到下一个计费周期。'
                : 'Your API calls will be throttled. You\'ll need to upgrade your plan or wait until the next billing cycle.'}
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">
              {lang === 'cn' ? '你们提供退款吗？' : 'Do you offer refunds?'}
            </h3>
            <p className="text-sm text-zinc-400">
              {lang === 'cn'
                ? '我们为所有付费套餐提供 14 天退款保证。请联系客服寻求帮助。'
                : 'We offer a 14-day money-back guarantee for all paid plans. Contact support for assistance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleSubscription;
