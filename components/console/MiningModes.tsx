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

interface MiningModesProps {
  switchToAgents: () => void;
}

const MiningModes: React.FC<MiningModesProps> = ({ switchToAgents }) => {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Modes Grid - toUI Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modes.map((mode) => {
          const borderColor = mode.modeId === 'keyword_mining' ? 'border-blue-500/30' :
                             mode.modeId === 'batch_translation' ? 'border-emerald-500/30' :
                             'border-purple-500/30';

          return (
            <div
              key={mode.modeId}
              className={`p-6 bg-[#0a0a0a] border ${borderColor} rounded-sm relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}
            >
              <h3 className="text-lg font-bold text-white mb-2">{lang === 'cn' ? mode.nameCn : mode.nameEn}</h3>
              <p className="text-xs text-gray-500 mb-6">{lang === 'cn' ? mode.descriptionCn : mode.descriptionEn}</p>

              {/* Credits Badge */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-2xl font-bold font-mono ${
                    mode.modeId === 'keyword_mining' ? 'text-blue-500' :
                    mode.modeId === 'batch_translation' ? 'text-emerald-500' :
                    'text-purple-500'
                  }`}>
                    {mode.creditsPerUse}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">CREDITS/USE</span>
                </div>
                {(mode.modeId === 'keyword_mining' || mode.modeId === 'batch_translation') && (
                  <p className="text-[10px] text-gray-500 font-mono">
                    {lang === 'cn' 
                      ? `${mode.creditsPerUse} credit 一轮 = 挖 10 个 keyword` 
                      : `${mode.creditsPerUse} credits per round = mine 10 keywords`}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-[#050505] border border-[#1a1a1a] rounded-sm">
                <div>
                  <div className="text-[10px] text-gray-600 font-mono uppercase">Uses</div>
                  <div className="text-lg font-bold text-white font-mono">{mode.stats.usageCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-600 font-mono uppercase">Total</div>
                  <div className="text-lg font-bold text-white font-mono">{mode.stats.totalCredits}</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={switchToAgents}
                className="flex items-center text-[10px] font-mono text-emerald-500 uppercase tracking-widest gap-2 hover:text-emerald-400 transition-colors"
              >
                <span>{lang === 'cn' ? '启动任务' : 'Launch Task'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiningModes;

