import React, { useContext, useState, useEffect } from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  ArrowUpRight,
  TrendingUp,
  X,
  Mail
} from 'lucide-react';
import { LanguageContext } from '../../App';
import { useAuth } from '../../contexts/AuthContext';

interface CreditsData {
  total: number;
  used: number;
  remaining: number;
  bonus: number;
}

interface SubscriptionData {
  plan: string;
  planName: string;
  planNameCn?: string;
  status: string;
  creditsMonthly: number;
}

const ConsoleSubscription: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const { getToken } = useAuth();
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null); // 追踪正在支付的套餐

  useEffect(() => {
    // 重置支付加载状态（用户返回时）
    setPaymentLoading(null);
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan_id: string) => {
    if (paymentLoading) return; // 防止重复点击

    try {
      setPaymentLoading(plan_id);

      const token = getToken();
      if (!token) {
        alert(lang === 'cn' ? '请先登录' : 'Please login first');
        setPaymentLoading(null);
        return;
      }

      // 调用创建支付订单 API
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_id })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout');
      }

      const data = await response.json();

      if (data.success && data.checkout_url) {
        // 跳转到支付页面（在当前页跳转，不要打开新窗口）
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert(lang === 'cn' ? '创建支付订单失败，请稍后再试' : 'Failed to create payment order');
      setPaymentLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: lang === 'cn' ? '免费版' : 'Free',
      price: '$0',
      period: lang === 'cn' ? '永久' : 'forever',
      credits: 200,
      keywords: 100,
      current: subscription?.plan === 'free',
      features: lang === 'cn'
        ? [
            '每月 200 Credits',
            '可研究约 100 个关键词',
            '1 个 API 密钥',
            '基础支持',
            '社区访问',
          ]
        : [
            '200 Credits/month',
            'Research ~100 keywords',
            '1 API key',
            'Basic support',
            'Community access',
          ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$30',
      period: lang === 'cn' ? '每月' : 'month',
      credits: 2000,
      keywords: 1000,
      popular: true,
      current: subscription?.plan === 'pro',
      features: lang === 'cn'
        ? [
            '每月 2,000 Credits',
            '可挖掘约 1,000 个关键词',
            '3 个 API 密钥',
            '优先支持',
            '高级分析',
            '团队协作（3成员）',
          ]
        : [
            '2,000 Credits/month',
            'Mine ~1,000 keywords',
            '3 API keys',
            'Priority support',
            'Advanced analytics',
            'Team collaboration (3 members)',
          ],
    },
    {
      id: 'professional',
      name: lang === 'cn' ? '专业版' : 'Professional',
      price: '$150',
      period: lang === 'cn' ? '每月' : 'month',
      credits: 10000,
      keywords: 5000,
      current: subscription?.plan === 'professional',
      features: lang === 'cn'
        ? [
            '每月 10,000 Credits',
            '可挖掘约 5,000 个关键词',
            '10 个 API 密钥',
            '专属支持',
            '高级分析',
            '自定义 Webhooks',
            '团队协作（10成员）',
            'SLA 保障',
          ]
        : [
            '10,000 Credits/month',
            'Mine ~5,000 keywords',
            '10 API keys',
            'Dedicated support',
            'Advanced analytics',
            'Custom webhooks',
            'Team collaboration (10 members)',
            'SLA guarantee',
          ],
    },
    {
      id: 'business',
      name: lang === 'cn' ? '企业定制版' : 'Business',
      price: lang === 'cn' ? '联系销售' : 'Contact Sales',
      period: '',
      credits: 0,
      keywords: 0,
      contactSales: true,
      current: subscription?.plan === 'business',
      features: lang === 'cn'
        ? [
            '定制 Credits 配额',
            '无限关键词挖掘',
            '无限 API 密钥',
            '专属客户经理',
            '定制化解决方案',
            '私有化部署',
            'SLA 保障（99.9%）',
            '7x24 技术支持',
          ]
        : [
            'Custom credits quota',
            'Unlimited keyword mining',
            'Unlimited API keys',
            'Dedicated account manager',
            'Custom solutions',
            'On-premise deployment',
            'SLA guarantee (99.9%)',
            '24/7 technical support',
          ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-accent-orange pl-4">
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          {lang === 'cn' ? '订阅套餐' : 'Subscription'}
        </h1>
        <p className="text-zinc-400 text-sm font-mono">
          {lang === 'cn'
            ? '升级套餐以获取更多 Credits 和高级功能'
            : 'Upgrade your plan for more credits and advanced features'}
        </p>
      </div>

      {/* Current Plan with Credits */}
      <div className="bg-gradient-to-br from-primary/20 via-surface/50 to-surface/50 border border-primary/30 p-8 relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-orange"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-orange"></div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-zinc-400 text-sm font-mono">
                {lang === 'cn' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 text-xs font-mono text-primary uppercase tracking-wider mb-3">
                  <Crown className="w-3 h-3" />
                  {lang === 'cn' ? '当前套餐' : 'Current Plan'}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 font-mono">
                  {subscription ? (lang === 'cn' ? subscription.planNameCn || subscription.planName : subscription.planName) : (lang === 'cn' ? '免费版' : 'Free Plan')}
                </h2>
                <p className="text-zinc-400 font-mono">
                  {lang === 'cn' ? '适合入门使用' : 'Perfect for getting started'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white data-value">
                  {subscription?.plan === 'free' ? '$0' : subscription?.plan === 'pro' ? '$30' : subscription?.plan === 'professional' ? '$150' : '--'}
                </p>
                <p className="text-zinc-500 text-sm font-mono">
                  /{lang === 'cn' ? '月' : 'month'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface/50 border border-border p-4">
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  {lang === 'cn' ? '本月已用 Credits' : 'Credits Used This Month'}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white data-value">
                    {credits?.used?.toLocaleString() || 0}
                  </p>
                  <span className="text-zinc-500 text-sm data-value">
                    / {credits?.total?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: credits && credits.total > 0
                        ? `${Math.min(100, (credits.used / credits.total) * 100)}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-surface/50 border border-border p-4">
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  {lang === 'cn' ? '剩余 Credits' : 'Remaining Credits'}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-primary data-value">
                    {credits?.remaining?.toLocaleString() || 0}
                  </p>
                  <span className="text-zinc-500 text-sm">credits</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  {lang === 'cn' ? '下月 1 日重置' : 'Resets on 1st'}
                </p>
              </div>
              <div className="bg-surface/50 border border-border p-4">
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  {lang === 'cn' ? 'API 密钥' : 'API Keys'}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white data-value">1</p>
                  <span className="text-zinc-500 text-sm data-value">/ 1</span>
                </div>
                <div className="mt-2 h-1.5 bg-border overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
          {lang === 'cn' ? '可用套餐' : 'Available Plans'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-surface border p-6 transition-all ${
                plan.current
                  ? 'border-primary/50 opacity-50'
                  : plan.popular
                  ? 'border-primary/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : plan.contactSales
                  ? 'border-accent-orange/50 shadow-[0_0_30px_rgba(255,107,53,0.2)]'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {/* Corner Markers */}
              {(plan.popular || plan.contactSales) && (
                <>
                  <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${plan.contactSales ? 'border-accent-orange' : 'border-accent-orange'}`}></div>
                  <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${plan.contactSales ? 'border-accent-orange' : 'border-accent-orange'}`}></div>
                  <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${plan.contactSales ? 'border-accent-orange' : 'border-accent-orange'}`}></div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${plan.contactSales ? 'border-accent-orange' : 'border-accent-orange'}`}></div>
                </>
              )}

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary border border-primary/30 text-xs font-mono text-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    {lang === 'cn' ? '推荐' : 'Recommended'}
                  </div>
                </div>
              )}

              {plan.contactSales && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent-orange border border-accent-orange/30 text-xs font-mono text-black uppercase tracking-wider">
                    <Mail className="w-3 h-3" />
                    {lang === 'cn' ? '企业定制' : 'Enterprise'}
                  </div>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 right-6">
                  <div className="px-3 py-1 bg-surface border border-border text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {lang === 'cn' ? '当前套餐' : 'Current Plan'}
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className={`text-4xl font-bold ${plan.contactSales ? 'text-accent-orange' : 'text-white'} data-value`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-zinc-500 text-sm font-mono">/{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Credits Display */}
              {!plan.contactSales && (
                <div className="text-center mb-6 py-4 bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold text-white data-value">
                      {plan.credits.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
                    Credits / {lang === 'cn' ? '月' : 'mo'}
                  </p>
                  <p className="text-xs text-primary font-mono">
                    ≈ {plan.keywords.toLocaleString()} {lang === 'cn' ? '个关键词' : 'keywords'}
                  </p>
                </div>
              )}

              {plan.contactSales && (
                <div className="text-center mb-6 py-4 bg-accent-orange/5 border border-accent-orange/20">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="w-8 h-8 text-accent-orange" />
                    <p className="text-sm text-white font-mono uppercase tracking-wider">
                      {lang === 'cn' ? '联系销售团队' : 'Contact Sales Team'}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-zinc-400">
                        {lang === 'cn' ? '官方' : 'Official'}:
                      </p>
                      <a
                        href="mailto:soulcraftlimited@galatea.bar"
                        className="text-xs text-accent-orange hover:underline block"
                      >
                        soulcraftlimited@galatea.bar
                      </a>
                      <p className="text-xs text-zinc-400 mt-2">
                        {lang === 'cn' ? '客服' : 'Support'}:
                      </p>
                      <a
                        href="mailto:x1596941391@gmail.com"
                        className="text-xs text-accent-orange hover:underline block"
                      >
                        x1596941391@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <ul className="space-y-3 mb-6 min-h-[200px]">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.current || paymentLoading === plan.id}
                onClick={() => {
                  if (plan.contactSales) {
                    window.location.href = 'mailto:soulcraftlimited@galatea.bar';
                  } else if (!plan.current && plan.id !== 'free') {
                    handleUpgrade(plan.id);
                  }
                }}
                className={`w-full py-3 text-sm font-mono uppercase tracking-wider transition-all ${
                  plan.current || paymentLoading === plan.id
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : plan.contactSales
                    ? 'bg-accent-orange text-black hover:bg-accent-orange/90'
                    : plan.popular
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white'
                }`}
              >
                {plan.current
                  ? lang === 'cn'
                    ? '当前套餐'
                    : 'Current Plan'
                  : paymentLoading === plan.id
                  ? lang === 'cn'
                    ? '跳转中...'
                    : 'Redirecting...'
                  : plan.contactSales
                  ? lang === 'cn'
                    ? '联系销售'
                    : 'Contact Sales'
                  : lang === 'cn'
                  ? '立即升级'
                  : 'Upgrade Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface border border-border p-6">
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
                  {lang === 'cn' ? 'Credits/月' : 'Credits/mo'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">200</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">2K</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">10K</td>
                <td className="py-4 px-4 text-center text-sm text-accent-orange font-bold">
                  {lang === 'cn' ? '定制' : 'Custom'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? '关键词数' : 'Keywords'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">~100</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">~1K</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">~5K</td>
                <td className="py-4 px-4 text-center text-sm text-accent-orange font-bold">
                  {lang === 'cn' ? '无限' : 'Unlimited'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? 'API 密钥' : 'API Keys'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">1</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">3</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">10</td>
                <td className="py-4 px-4 text-center text-sm text-accent-orange font-bold">
                  {lang === 'cn' ? '无限' : 'Unlimited'}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-4 px-4 text-sm text-white">
                  {lang === 'cn' ? '团队成员' : 'Team Members'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">1</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">3</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">10</td>
                <td className="py-4 px-4 text-center text-sm text-accent-orange font-bold">
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
                <td className="py-4 px-4 text-center text-sm text-zinc-300">
                  {lang === 'cn' ? '专属' : 'Dedicated'}
                </td>
                <td className="py-4 px-4 text-center text-sm text-accent-orange font-bold">
                  7x24
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-white">SLA</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">--</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">--</td>
                <td className="py-4 px-4 text-center text-sm text-zinc-300">99%</td>
                <td className="py-4 px-4 text-center text-sm text-accent-orange font-bold">99.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-surface border border-border p-6">
        <h2 className="text-lg font-bold text-white mb-6 font-mono uppercase tracking-wider">
          {lang === 'cn' ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-bold mb-2 font-mono">
              {lang === 'cn' ? '我可以随时更改套餐吗？' : 'Can I change my plan anytime?'}
            </h3>
            <p className="text-sm text-zinc-400 font-mono">
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
