import React, { useState, useEffect, useContext } from 'react';
import {
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageContext } from '../../App';

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


interface ActivityItem {
  action: string;
  timestamp: string;
  credits: number;
  status: string;
  type: string;
}

interface ModeStats {
  [key: string]: {
    usageCount: number;
    totalCredits: number;
  };
}

interface SevenDayStats {
  date: string;
  total: number;
  keyword_mining: number;
  batch_translation: number;
  deep_mining: number;
}

const ConsoleDashboard: React.FC = () => {
  const { getToken } = useAuth();
  const { lang } = useContext(LanguageContext);
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [modeStats, setModeStats] = useState<ModeStats>({});
  const [sevenDayStats, setSevenDayStats] = useState<SevenDayStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // **优先使用预加载的缓存数据**
      const cachedData = localStorage.getItem('dashboard_cache');
      const cacheTime = localStorage.getItem('dashboard_preload_time');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // 如果有缓存且在5分钟内，立即使用缓存
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < fiveMinutes) {
        console.log('⚡ Using preloaded dashboard cache');
        const data = JSON.parse(cachedData);
        setCredits(data.credits);
        setSubscription(data.subscription);
        setRecentActivity(data.recentActivity || []);
        setModeStats(data.modeStats || {});
        setSevenDayStats(data.sevenDayStats || []);
        setLoading(false);
        // 仍然在后台刷新数据
        fetchFreshData(token);
        return;
      }

      // 缓存过期或不存在，直接请求
      await fetchFreshData(token);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchFreshData = async (token: string) => {
    try {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        setSubscription(data.subscription);
        setRecentActivity(data.recentActivity || []);
        setModeStats(data.modeStats || {});
        setSevenDayStats(data.sevenDayStats || []);

        // 更新缓存
        localStorage.setItem('dashboard_cache', JSON.stringify(data));
        localStorage.setItem('dashboard_preload_time', Date.now().toString());
      }
    } catch (error) {
      console.error('Failed to fetch fresh dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [getToken]);

  // 格式化时间戳
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (lang === 'cn') {
      if (diffMins < 1) return '刚刚';
      if (diffMins < 60) return `${diffMins} 分钟前`;
      if (diffHours < 24) return `${diffHours} 小时前`;
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays} 天前`;
      return date.toLocaleDateString('zh-CN');
    } else {
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString('en-US');
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-2 border-primary pl-3">
        <h1 className="text-2xl font-bold text-white mb-1 font-mono uppercase tracking-tight">
          {lang === 'cn' ? '仪表板' : 'Dashboard'}
        </h1>
        <p className="text-zinc-400 text-xs font-mono">
          {lang === 'cn' ? '账户活动和性能概览' : 'Overview of your account activity and performance'}
        </p>
      </div>

      {/* Credits Overview Card */}
      {credits && (
        <div className="bg-primary/5 border border-primary/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                {lang === 'cn' ? '积分概览' : 'Credits Overview'}
              </h2>
              {subscription && (
                <p className="text-xs text-zinc-400 mt-1">
                  {lang === 'cn' ? '当前套餐' : 'Current Plan'}: <span className="text-primary">{lang === 'cn' && subscription.planNameCn ? subscription.planNameCn : subscription.planName}</span>
                </p>
              )}
            </div>
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface border border-border p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
                {lang === 'cn' ? '剩余积分' : 'Remaining'}
              </p>
              <p className="text-2xl font-bold text-primary data-value">{credits.remaining.toLocaleString()}</p>
            </div>
            <div className="bg-surface border border-border p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
                {lang === 'cn' ? '总积分' : 'Total'}
              </p>
              <p className="text-2xl font-bold text-white data-value">{credits.total.toLocaleString()}</p>
            </div>
            <div className="bg-surface border border-border p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
                {lang === 'cn' ? '已使用' : 'Used'}
              </p>
              <p className="text-2xl font-bold text-white data-value">{credits.used.toLocaleString()}</p>
            </div>
            <div className="bg-surface border border-border p-4">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
                {lang === 'cn' ? '成功率' : 'Success Rate'}
              </p>
              <p className="text-2xl font-bold text-white data-value">
                100%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Stats Cards */}
      {Object.keys(modeStats).length > 0 && (
        <div className="bg-surface border border-border p-6">
          <h2 className="text-lg font-bold text-white mb-4 font-mono uppercase tracking-wider border-b border-border pb-3">
            {lang === 'cn' ? '模式统计' : 'Mode Statistics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(modeStats).map(([modeId, stats]) => {
              const modeNames: Record<string, { en: string; cn: string }> = {
                keyword_mining: { en: 'Keyword Mining', cn: '关键词挖掘' },
                batch_translation: { en: 'Batch Translation', cn: '批量翻译' },
                deep_mining: { en: 'Deep Mining', cn: '深度挖掘' }
              };
              const modeName = modeNames[modeId] || { en: modeId, cn: modeId };

              return (
                <div key={modeId} className="bg-primary/5 border border-primary/20 p-4">
                  <div className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
                    {lang === 'cn' ? modeName.cn : modeName.en}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">
                        {lang === 'cn' ? '使用次数' : 'Uses'}
                      </div>
                      <div className="text-xl font-bold text-white font-mono">
                        {stats.usageCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">
                        {lang === 'cn' ? 'Credits' : 'Credits'}
                      </div>
                      <div className="text-xl font-bold text-white font-mono">
                        {stats.totalCredits}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-Day Spending Chart */}
      {sevenDayStats.length > 0 && (
        <div className="bg-surface border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                {lang === 'cn' ? '最近7天花费' : 'Last 7 Days Spending'}
              </h2>
              <p className="text-xs text-zinc-500 mt-1 font-mono">
                {lang === 'cn' ? '按模式分类的每日Credits消耗' : 'Daily credits consumption by mode'}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 flex items-end justify-between gap-2">
            {sevenDayStats.map((day, i) => {
              const maxCredits = Math.max(...sevenDayStats.map(d => d.total), 1);
              const totalHeight = (day.total / maxCredits) * 100;
              const keywordHeight = (day.keyword_mining / maxCredits) * 100;
              const translationHeight = (day.batch_translation / maxCredits) * 100;
              const deepHeight = (day.deep_mining / maxCredits) * 100;

              const dateObj = new Date(day.date);
              const dayLabel = lang === 'cn'
                ? `${dateObj.getMonth() + 1}/${dateObj.getDate()}`
                : `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  {/* Stacked Bar */}
                  <div className="w-full relative group cursor-pointer" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    {day.total > 0 ? (
                      <div className="w-full flex flex-col justify-end" style={{ height: `${totalHeight}%` }}>
                        {day.deep_mining > 0 && (
                          <div
                            className="w-full bg-purple-500/60 border border-purple-500 hover:bg-purple-500/80 transition-all"
                            style={{ height: `${(deepHeight / totalHeight) * 100}%` }}
                            title={`Deep Mining: ${day.deep_mining}`}
                          />
                        )}
                        {day.batch_translation > 0 && (
                          <div
                            className="w-full bg-green-500/60 border border-green-500 hover:bg-green-500/80 transition-all"
                            style={{ height: `${(translationHeight / totalHeight) * 100}%` }}
                            title={`Translation: ${day.batch_translation}`}
                          />
                        )}
                        {day.keyword_mining > 0 && (
                          <div
                            className="w-full bg-blue-500/60 border border-blue-500 hover:bg-blue-500/80 transition-all"
                            style={{ height: `${(keywordHeight / totalHeight) * 100}%` }}
                            title={`Keyword Mining: ${day.keyword_mining}`}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-zinc-800 border border-zinc-700" />
                    )}

                    {/* Tooltip */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-primary px-3 py-2 text-xs font-mono whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-bold text-white mb-1">{day.total} Credits</div>
                      {day.keyword_mining > 0 && <div className="text-blue-400">Keyword: {day.keyword_mining}</div>}
                      {day.batch_translation > 0 && <div className="text-green-400">Translation: {day.batch_translation}</div>}
                      {day.deep_mining > 0 && <div className="text-purple-400">Deep: {day.deep_mining}</div>}
                    </div>
                  </div>

                  {/* Date Label */}
                  <div className="text-[10px] text-zinc-500 font-mono">{dayLabel}</div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 border border-blue-500"></div>
              <span className="text-xs text-zinc-400 font-mono">
                {lang === 'cn' ? '关键词挖掘' : 'Keyword Mining'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 border border-green-500"></div>
              <span className="text-xs text-zinc-400 font-mono">
                {lang === 'cn' ? '批量翻译' : 'Translation'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 border border-purple-500"></div>
              <span className="text-xs text-zinc-400 font-mono">
                {lang === 'cn' ? '深度挖掘' : 'Deep Mining'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Quick Actions - Now Full Width */}
        <div className="bg-surface border border-border p-6">
          <h2 className="text-lg font-bold text-white mb-4 font-mono uppercase tracking-wider border-b border-border pb-3">
            {lang === 'cn' ? '快捷操作' : 'Quick Actions'}
          </h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>{lang === 'cn' ? '新建 API 密钥' : 'New API Key'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="w-full px-4 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary hover:text-white text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>{lang === 'cn' ? '购买积分' : 'Buy Credits'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="w-full px-4 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary hover:text-white text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>{lang === 'cn' ? '升级套餐' : 'Upgrade Plan'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="w-full px-4 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary hover:text-white text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>{lang === 'cn' ? '查看文档' : 'View Docs'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            {lang === 'cn' ? '最近活动' : 'Recent Activity'}
          </h2>
          <button className="text-xs font-mono text-primary hover:text-primary/80 uppercase tracking-wider transition-colors">
            {lang === 'cn' ? '查看全部 →' : 'View All →'}
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 font-mono text-sm">
              {lang === 'cn' ? '暂无活动记录' : 'No activity yet'}
            </div>
          ) : (
            recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-surface/30 px-4 -mx-4 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-2 h-2 status-indicator ${
                    activity.status === 'success'
                      ? 'status-active'
                      : activity.status === 'info'
                      ? 'bg-primary'
                      : 'bg-zinc-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium font-mono">{activity.action}</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
              {activity.credits !== 0 && (
                <span
                  className={`text-sm font-mono font-bold data-value ${
                    activity.credits > 0 ? 'text-accent-green' : 'text-zinc-400'
                  }`}
                >
                  {activity.credits > 0 ? '+' : ''}
                  {activity.credits}
                </span>
              )}
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleDashboard;
