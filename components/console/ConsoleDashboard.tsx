import React, { useState, useEffect, useContext } from "react";
import { Zap, Key, Activity } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { LanguageContext } from "../../App";
import TerminalWidget from "../ui/TerminalWidget";

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
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
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
      const cachedData = localStorage.getItem("dashboard_cache");
      const cacheTime = localStorage.getItem("dashboard_preload_time");
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // 如果有缓存且在5分钟内，立即使用缓存
      if (cachedData && cacheTime && now - parseInt(cacheTime) < fiveMinutes) {
        console.log("⚡ Using preloaded dashboard cache");
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
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchFreshData = async (token: string) => {
    try {
      const response = await fetch("/api/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        setSubscription(data.subscription);
        setRecentActivity(data.recentActivity || []);
        setModeStats(data.modeStats || {});
        setSevenDayStats(data.sevenDayStats || []);

        // 更新缓存
        localStorage.setItem("dashboard_cache", JSON.stringify(data));
        localStorage.setItem("dashboard_preload_time", Date.now().toString());
      }
    } catch (error) {
      console.error("Failed to fetch fresh dashboard data:", error);
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

    if (lang === "cn") {
      if (diffMins < 1) return "刚刚";
      if (diffMins < 60) return `${diffMins} 分钟前`;
      if (diffHours < 24) return `${diffHours} 小时前`;
      if (diffDays === 1) return "昨天";
      if (diffDays < 7) return `${diffDays} 天前`;
      return date.toLocaleDateString("zh-CN");
    } else {
      if (diffMins < 1) return "just now";
      if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "yesterday";
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString("en-US");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Section: Credits Overview - toUI Style */}
      {credits && (
        <TerminalWidget
          title={lang === "cn" ? "积分概览" : "Credits Overview"}
          subtitle={
            subscription
              ? `${lang === "cn" ? "当前套餐" : "Current Plan"}: ${
                  lang === "cn" && subscription.planNameCn
                    ? subscription.planNameCn
                    : subscription.planName
                }`
              : ""
          }
          icon={<Zap className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: lang === "cn" ? "剩余积分" : "Remaining",
                value: credits.remaining.toLocaleString(),
                color: "text-emerald-500",
                isRemaining: true,
              },
              {
                label: lang === "cn" ? "总积分" : "Total",
                value: credits.total.toLocaleString(),
                color: "text-text-primary",
              },
              {
                label: lang === "cn" ? "已使用" : "Used",
                value: credits.used.toLocaleString(),
                color: "text-text-secondary",
              },
              {
                label: lang === "cn" ? "成功率" : "Success Rate",
                value: "100%",
                color: "text-text-primary",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-surface border border-border p-5 rounded-sm group hover:border-emerald-500/20 transition-all"
              >
                <p className="text-[10px] font-mono text-text-tertiary mb-1 uppercase tracking-tighter">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-bold tracking-tighter ${stat.color} font-mono`}
                  >
                    {stat.value}
                  </span>
                  {stat.isRemaining && (
                    <span className="text-[10px] text-emerald-900 font-mono">
                      CREDITS_AVAIL
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TerminalWidget>
      )}

      {/* Middle Section: Visualization & Status - toUI Style */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 7-Day Spending Chart */}
        <TerminalWidget
          title={lang === "cn" ? "最近7天花费" : "Last 7 Days Spending"}
          subtitle={
            lang === "cn"
              ? "按模式分类的每日 Credits 消耗"
              : "Daily credits consumption by mode"
          }
          className="xl:col-span-2"
          icon={<Activity className="w-5 h-5" />}
        >
          {sevenDayStats.length > 0 ? (
            <>
              {/* Chart */}
              <div className="h-64 flex items-end justify-between gap-2 mb-6">
                {sevenDayStats.map((day, i) => {
                  const maxCredits = Math.max(
                    ...sevenDayStats.map((d) => d.total),
                    1
                  );
                  const totalHeight = (day.total / maxCredits) * 100;
                  const keywordHeight = (day.keyword_mining / maxCredits) * 100;
                  const translationHeight =
                    (day.batch_translation / maxCredits) * 100;
                  const deepHeight = (day.deep_mining / maxCredits) * 100;

                  const dateObj = new Date(day.date);
                  const dayLabel = `${
                    dateObj.getMonth() + 1
                  }/${dateObj.getDate()}`;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      {/* Stacked Bar */}
                      <div
                        className="w-full relative group cursor-pointer"
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        {day.total > 0 ? (
                          <div
                            className="w-full flex flex-col justify-end"
                            style={{ height: `${totalHeight}%` }}
                          >
                            {day.deep_mining > 0 && (
                              <div
                                className="w-full bg-purple-500/60 border border-purple-500 hover:bg-purple-500/80 transition-all"
                                style={{
                                  height: `${
                                    (deepHeight / totalHeight) * 100
                                  }%`,
                                }}
                                title={`Deep Mining: ${day.deep_mining}`}
                              />
                            )}
                            {day.batch_translation > 0 && (
                              <div
                                className="w-full bg-emerald-500/60 border border-emerald-500 hover:bg-emerald-500/80 transition-all"
                                style={{
                                  height: `${
                                    (translationHeight / totalHeight) * 100
                                  }%`,
                                }}
                                title={`Translation: ${day.batch_translation}`}
                              />
                            )}
                            {day.keyword_mining > 0 && (
                              <div
                                className="w-full bg-blue-500/60 border border-blue-500 hover:bg-blue-500/80 transition-all"
                                style={{
                                  height: `${
                                    (keywordHeight / totalHeight) * 100
                                  }%`,
                                }}
                                title={`Keyword Mining: ${day.keyword_mining}`}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-1 bg-border border border-border" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-border px-3 py-2 text-xs font-mono whitespace-nowrap z-10 pointer-events-none rounded-sm">
                          <div className="font-bold text-text-primary mb-1">
                            {day.total} Credits
                          </div>
                          {day.keyword_mining > 0 && (
                            <div className="text-blue-400">
                              Keyword: {day.keyword_mining}
                            </div>
                          )}
                          {day.batch_translation > 0 && (
                            <div className="text-emerald-400">
                              Translation: {day.batch_translation}
                            </div>
                          )}
                          {day.deep_mining > 0 && (
                            <div className="text-purple-400">
                              Deep: {day.deep_mining}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date Label */}
                      <div className="text-[10px] text-text-tertiary font-mono">
                        {dayLabel}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 border border-blue-500"></div>
                  <span className="text-xs text-text-secondary font-mono">
                    {lang === "cn" ? "关键词挖掘" : "Keyword Mining"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 border border-emerald-500"></div>
                  <span className="text-xs text-text-secondary font-mono">
                    {lang === "cn" ? "批量翻译" : "Translation"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 border border-purple-500"></div>
                  <span className="text-xs text-text-secondary font-mono">
                    {lang === "cn" ? "深度挖掘" : "Deep Mining"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-tertiary font-mono text-sm">
              {lang === "cn" ? "暂无数据" : "No data"}
            </div>
          )}
        </TerminalWidget>

        {/* Beginner Guide */}
        <TerminalWidget
          title={lang === "cn" ? "新手帮助" : "Beginner Guide"}
          subtitle={
            lang === "cn"
              ? "快速了解系统功能和使用方法"
              : "Quick guide to system features and usage"
          }
          icon={
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          }
        >
          <div className="space-y-3 font-mono text-[10px] overflow-hidden max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              <div className="border-l border-border pl-3 py-2">
                <div className="text-emerald-500 mb-2 font-bold">
                  {lang === "cn" ? "挖掘模式" : "Mining Modes"}
                </div>
                <div className="text-text-secondary leading-relaxed">
                  {lang === "cn"
                    ? "点击挖掘模式可看不同模式的作用和消耗"
                    : "Click Mining Modes to view the functions and costs of different modes"}
                </div>
              </div>
              <div className="border-l border-border pl-3 py-2">
                <div className="text-emerald-500 mb-2 font-bold">
                  {lang === "cn" ? "搜索引擎 Agent" : "Search Engine Agents"}
                </div>
                <div className="text-text-secondary leading-relaxed">
                  {lang === "cn"
                    ? "点击agent可以进入不同搜索引擎的挖掘agent，目前只有google AGENT功能齐全。后续将更新yandex agent及bing agent，且将能够根据seo策略一键建站"
                    : "Click Agents to access mining agents for different search engines. Currently only Google Agent is fully functional. Yandex Agent and Bing Agent will be updated soon, and you will be able to build sites with one click based on SEO strategies"}
                </div>
              </div>
            </div>
          </div>
        </TerminalWidget>
      </div>
    </div>
  );
};

export default ConsoleDashboard;
