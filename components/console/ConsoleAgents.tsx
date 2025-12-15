import React, { useContext } from 'react';
import {
  Search,
  Globe,
  Compass,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import { LanguageContext } from '../../App';

const ConsoleAgents: React.FC = () => {
  const { t, lang } = useContext(LanguageContext);

  const agents = [
    {
      id: 'google',
      name: lang === 'cn' ? 'Google 挖掘机' : 'Google Miner',
      desc: lang === 'cn'
        ? '全球意图定位。专为高流量、高竞争的全球市场设计。'
        : 'Global intent targeting. Optimized for high-volume markets.',
      icon: <Search className="w-8 h-8" />,
      features: lang === 'cn'
        ? ['NLP 意图匹配', '零点击搜索分析', 'US/UK/AU 数据库']
        : ['NLP Intent Matching', 'Zero-Click Analysis', 'US/UK/AU Databases'],
      url: 'https://google-agent.vercel.app',
      color: 'primary',
      stats: {
        label: lang === 'cn' ? '已挖掘关键词' : 'Keywords Mined',
        value: '12,543'
      }
    },
    {
      id: 'yandex',
      name: lang === 'cn' ? 'Yandex 专员' : 'Yandex Unit',
      desc: lang === 'cn'
        ? 'CIS 俄语区专家。精通西里尔语义核心与 Yandex 算法。'
        : 'CIS region specialist. Navigates Cyrillic semantics.',
      icon: <Globe className="w-8 h-8" />,
      features: lang === 'cn'
        ? ['ICS 权重分析', '区域地理定位', '俄语语义核心映射']
        : ['ICS Score Check', 'Regional Geo-Filter', 'Cyrillic Core Mapping'],
      url: 'https://yandex-agent.vercel.app',
      color: 'red',
      stats: {
        label: lang === 'cn' ? '已挖掘关键词' : 'Keywords Mined',
        value: '8,234'
      }
    },
    {
      id: 'bing',
      name: lang === 'cn' ? 'Bing 探测器' : 'Bing Probe',
      desc: lang === 'cn'
        ? '高净值人群锁定。针对被忽视的桌面端高转化用户群。'
        : 'High-value demographic targeting. Lower CPA, higher conversion.',
      icon: <Compass className="w-8 h-8" />,
      features: lang === 'cn'
        ? ['桌面端用户聚焦', '低竞争蓝海扫描', '高消费人群画像']
        : ['Desktop User Focus', 'Low-Competition Scan', 'Affluent Demographic'],
      url: 'https://bing-agent.vercel.app',
      color: 'blue',
      stats: {
        label: lang === 'cn' ? '已挖掘关键词' : 'Keywords Mined',
        value: '6,721'
      }
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; hover: string }> = {
      primary: {
        bg: 'bg-primary/10',
        border: 'border-primary/30',
        text: 'text-primary',
        hover: 'hover:border-primary/50'
      },
      red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        hover: 'hover:border-red-500/50'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        hover: 'hover:border-blue-500/50'
      }
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          {lang === 'cn' ? 'SEO Agents' : 'SEO Agents'}
        </h1>
        <p className="text-zinc-400 text-sm">
          {lang === 'cn'
            ? '启动专属 Agent 进行关键词挖掘和竞争分析'
            : 'Launch specialized agents for keyword mining and competition analysis'}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              {lang === 'cn' ? '总计' : 'Total'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">27,498</p>
          <p className="text-xs text-zinc-500 mt-1">
            {lang === 'cn' ? '已挖掘关键词' : 'Keywords Mined'}
          </p>
        </div>
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              {lang === 'cn' ? '成功率' : 'Success'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">94.2%</p>
          <p className="text-xs text-zinc-500 mt-1">
            {lang === 'cn' ? '蓝海机会识别' : 'Blue Ocean Identification'}
          </p>
        </div>
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              {lang === 'cn' ? '活跃' : 'Active'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">3</p>
          <p className="text-xs text-zinc-500 mt-1">
            {lang === 'cn' ? '可用 Agents' : 'Available Agents'}
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const colorClasses = getColorClasses(agent.color);
          return (
            <div
              key={agent.id}
              className={`bg-surface/50 backdrop-blur-sm border rounded-sm p-6 transition-all ${colorClasses.border} ${colorClasses.hover}`}
            >
              {/* Icon */}
              <div className={`p-3 ${colorClasses.bg} border ${colorClasses.border} rounded mb-4 inline-flex ${colorClasses.text}`}>
                {agent.icon}
              </div>

              {/* Name & Description */}
              <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">
                {agent.name}
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                {agent.desc}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {agent.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.color === 'primary' ? 'bg-primary' : agent.color === 'red' ? 'bg-red-400' : 'bg-blue-400'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className={`p-3 ${colorClasses.bg} border ${colorClasses.border} rounded mb-4`}>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  {agent.stats.label}
                </p>
                <p className={`text-2xl font-bold ${colorClasses.text}`}>
                  {agent.stats.value}
                </p>
              </div>

              {/* Launch Button */}
              <a
                href={agent.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 ${colorClasses.bg} border ${colorClasses.border} ${colorClasses.text} hover:bg-opacity-20 rounded-sm text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 group`}
              >
                <span>{lang === 'cn' ? '启动 Agent' : 'Launch Agent'}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-sm p-6">
        <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          {lang === 'cn' ? '使用说明' : 'How to Use'}
        </h2>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">1.</span>
            <span>
              {lang === 'cn'
                ? '选择合适的 Agent：根据您的目标市场选择 Google、Yandex 或 Bing Agent。'
                : 'Select the right Agent: Choose Google, Yandex, or Bing based on your target market.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">2.</span>
            <span>
              {lang === 'cn'
                ? '点击"启动 Agent"将跳转到对应的挖掘平台。'
                : 'Click "Launch Agent" to navigate to the mining platform.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">3.</span>
            <span>
              {lang === 'cn'
                ? '您的登录状态会自动同步，无需重复登录。'
                : 'Your login status will be synced automatically, no need to login again.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">4.</span>
            <span>
              {lang === 'cn'
                ? '输入种子关键词，Agent 将自动执行递归挖掘和 SERP 分析。'
                : 'Enter seed keywords, and the Agent will execute recursive mining and SERP analysis.'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConsoleAgents;
