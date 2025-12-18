import React, { useState, useEffect, useContext } from 'react';
import { Zap, TrendingUp, Languages, Search, ArrowRight, Database, Sparkles, FileText } from 'lucide-react';
import { LanguageContext } from '../../App';
import { useAuth } from '../../contexts/AuthContext';

interface MiningMode {
  modeId: string;
  nameEn: string;
  nameCn: string;
  descriptionEn: string;
  descriptionCn: string;
  workflowEn: string;
  workflowCn: string;
  creditsPerUse: number;
  aiModel: string;
  dataSource: string;
  stats: {
    usageCount: number;
    totalCredits: number;
  };
}

const MiningModes: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const { getToken } = useAuth();
  const [modes, setModes] = useState<MiningMode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModes();
  }, []);

  const fetchModes = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // **优先使用预加载的缓存数据**
      const cachedData = localStorage.getItem('mining_modes_cache');
      const cacheTime = localStorage.getItem('mining_modes_preload_time');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // 如果有缓存且在5分钟内，立即使用缓存
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < fiveMinutes) {
        console.log('⚡ Using preloaded mining modes cache');
        const data = JSON.parse(cachedData);
        setModes(data.modes || []);
        setLoading(false);
        // 仍然在后台刷新数据
        fetchFreshModes(token);
        return;
      }

      // 缓存过期或不存在，直接请求
      await fetchFreshModes(token);
    } catch (error) {
      console.error('Failed to fetch mining modes:', error);
      setLoading(false);
    }
  };

  const fetchFreshModes = async (token: string) => {
    try {
      const response = await fetch('/api/stats/mining-modes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setModes(data.modes || []);

        // 更新缓存
        localStorage.setItem('mining_modes_cache', JSON.stringify(data));
        localStorage.setItem('mining_modes_preload_time', Date.now().toString());
      }
    } catch (error) {
      console.error('Failed to fetch fresh mining modes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (modeId: string) => {
    switch (modeId) {
      case 'keyword_mining':
        return <Search className="w-6 h-6" />;
      case 'batch_translation':
        return <Languages className="w-6 h-6" />;
      case 'deep_mining':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getModeColor = (modeId: string) => {
    switch (modeId) {
      case 'keyword_mining':
        return 'border-blue-500 text-blue-500';
      case 'batch_translation':
        return 'border-green-500 text-green-500';
      case 'deep_mining':
        return 'border-purple-500 text-purple-500';
      default:
        return 'border-primary text-primary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-zinc-400 font-mono">
        {lang === 'cn' ? '加载中...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-2 border-primary pl-3">
        <h2 className="text-2xl font-bold text-white mb-1 font-mono uppercase tracking-tight">
          {lang === 'cn' ? '挖掘模式' : 'Mining Modes'}
        </h2>
        <p className="text-zinc-400 text-xs font-mono">
          {lang === 'cn' ? '了解每种模式的功能和消耗' : 'Learn about each mode and its cost'}
        </p>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 gap-6">
        {modes.map((mode) => (
          <div
            key={mode.modeId}
            className="bg-surface border border-border hover:border-primary/50 transition-all relative"
          >
            {/* Corner Markers */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${getModeColor(mode.modeId)}`}></div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${getModeColor(mode.modeId)}`}></div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`p-4 border ${getModeColor(mode.modeId)}`}>
                    {getModeIcon(mode.modeId)}
                  </div>

                  <div>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wide">
                      {lang === 'cn' ? mode.nameCn : mode.nameEn}
                    </h3>
                    {/* Description */}
                    <p className="text-sm text-zinc-400">
                      {lang === 'cn' ? mode.descriptionCn : mode.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Credits Badge */}
                <div className="text-right">
                  <div className={`text-3xl font-bold font-mono ${getModeColor(mode.modeId).replace('border-', 'text-')}`}>
                    {mode.creditsPerUse}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                    {lang === 'cn' ? 'Credits/次' : 'Credits/Use'}
                  </div>
                </div>
              </div>

              {/* Workflow - Visual */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary"></div>
                  {lang === 'cn' ? '工作流程' : 'Workflow'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(lang === 'cn' ? mode.workflowCn : mode.workflowEn)
                    .split('→')
                    .map((step, index, array) => {
                      const stepText = step.replace(/^\d+\.\s*/, '').trim();

                      // 根据步骤内容选择图标
                      let StepIcon = FileText;
                      if (stepText.toLowerCase().includes('input') || stepText.toLowerCase().includes('输入') || stepText.toLowerCase().includes('upload') || stepText.toLowerCase().includes('上传')) StepIcon = Search;
                      if (stepText.toLowerCase().includes('api') || stepText.toLowerCase().includes('ranking') || stepText.toLowerCase().includes('crawl') || stepText.toLowerCase().includes('select')) StepIcon = Database;
                      if (stepText.toLowerCase().includes('gemini') || stepText.toLowerCase().includes('analyz') || stepText.toLowerCase().includes('分析') || stepText.toLowerCase().includes('translat') || stepText.toLowerCase().includes('翻译')) StepIcon = Sparkles;
                      if (stepText.toLowerCase().includes('generate') || stepText.toLowerCase().includes('export') || stepText.toLowerCase().includes('生成') || stepText.toLowerCase().includes('导出') || stepText.toLowerCase().includes('extract')) StepIcon = FileText;

                      return (
                        <div key={index} className="relative">
                          <div className="bg-black/30 border border-border hover:border-primary/50 transition-all p-4 h-full">
                            <div className="flex flex-col items-center text-center gap-3">
                              {/* Step Number */}
                              <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
                                <span className="text-primary font-bold text-sm font-mono">{index + 1}</span>
                              </div>

                              {/* Icon */}
                              <div className={`w-10 h-10 border flex items-center justify-center ${getModeColor(mode.modeId)}`}>
                                <StepIcon className="w-5 h-5" />
                              </div>

                              {/* Text */}
                              <p className="text-xs text-zinc-300 leading-relaxed">
                                {stepText}
                              </p>
                            </div>
                          </div>

                          {/* Arrow connector */}
                          {index < array.length - 1 && (
                            <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                              <ArrowRight className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Bottom Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                {/* Tech Details */}
                <div className="bg-surface border border-border p-3">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">
                    {lang === 'cn' ? 'AI 模型' : 'AI Model'}
                  </div>
                  <div className="text-sm font-mono text-primary">
                    {mode.aiModel}
                  </div>
                </div>
                <div className="bg-surface border border-border p-3">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">
                    {lang === 'cn' ? '数据来源' : 'Data Source'}
                  </div>
                  <div className="text-sm font-mono text-primary">
                    {mode.dataSource}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-surface border border-border p-3">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">
                    {lang === 'cn' ? '使用次数' : 'Usage'}
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {mode.stats.usageCount}
                  </div>
                </div>
                <div className="bg-surface border border-border p-3">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">
                    {lang === 'cn' ? '总消耗' : 'Total Cost'}
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {mode.stats.totalCredits}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiningModes;
