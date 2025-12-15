import React from 'react';
import {
  Activity,
  TrendingUp,
  Zap,
  Clock,
  BarChart3,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

const ConsoleDashboard: React.FC = () => {
  // Mock data
  const stats = [
    {
      label: 'API Calls',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: 'Credits Used',
      value: '8,420',
      change: '+8.3%',
      trend: 'up',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      label: 'Avg Response',
      value: '234ms',
      change: '-15.2%',
      trend: 'down',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: 'Success Rate',
      value: '99.8%',
      change: '+0.3%',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const recentActivity = [
    {
      action: 'Google SEO Agent - Keyword Mining',
      timestamp: '2 minutes ago',
      credits: -50,
      status: 'success',
    },
    {
      action: 'Yandex SEO Agent - SERP Analysis',
      timestamp: '15 minutes ago',
      credits: -30,
      status: 'success',
    },
    {
      action: 'API Key Generated',
      timestamp: '1 hour ago',
      credits: 0,
      status: 'info',
    },
    {
      action: 'Bing SEO Agent - Competition Check',
      timestamp: '2 hours ago',
      credits: -40,
      status: 'success',
    },
    {
      action: 'Credits Purchased - 1000 Credits',
      timestamp: 'Yesterday',
      credits: +1000,
      status: 'success',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="text-zinc-400 text-sm">
          Overview of your account activity and performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-primary/10 border border-primary/30 rounded text-primary">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-mono font-bold flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-primary' : 'text-blue-400'
                }`}
              >
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Usage Overview
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Last 30 days</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs font-mono text-zinc-400 hover:text-white border border-border hover:border-primary/50 rounded transition-all uppercase tracking-wider">
                7D
              </button>
              <button className="px-3 py-1 text-xs font-mono text-white bg-primary/10 border border-primary/30 rounded uppercase tracking-wider">
                30D
              </button>
              <button className="px-3 py-1 text-xs font-mono text-zinc-400 hover:text-white border border-border hover:border-primary/50 rounded transition-all uppercase tracking-wider">
                90D
              </button>
            </div>
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95, 70].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/20 border border-primary/30 rounded-sm hover:bg-primary/30 transition-all relative group cursor-pointer"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-white whitespace-nowrap">
                  {Math.floor(height * 15)} calls
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <BarChart3 className="w-4 h-4" />
              Daily API calls
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30 border border-primary rounded-sm"></div>
                <span className="text-xs text-zinc-400 font-mono">API Calls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4 font-mono uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black rounded-sm text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>New API Key</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="w-full px-4 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white rounded-sm text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>Buy Credits</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="w-full px-4 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white rounded-sm text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>Upgrade Plan</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button className="w-full px-4 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white rounded-sm text-sm font-mono uppercase tracking-wider transition-all flex items-center justify-between group">
              <span>View Docs</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Recent Activity
          </h2>
          <button className="text-xs font-mono text-primary hover:text-primary/80 uppercase tracking-wider transition-colors">
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-surface/30 px-4 -mx-4 rounded-sm transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-primary'
                      : activity.status === 'info'
                      ? 'bg-blue-400'
                      : 'bg-zinc-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{activity.action}</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
              {activity.credits !== 0 && (
                <span
                  className={`text-sm font-mono font-bold ${
                    activity.credits > 0 ? 'text-primary' : 'text-zinc-400'
                  }`}
                >
                  {activity.credits > 0 ? '+' : ''}
                  {activity.credits}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsoleDashboard;
