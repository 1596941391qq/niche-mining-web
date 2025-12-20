import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  lastLoginAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 从 localStorage 获取 token
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  };

  // 保存 token 到 localStorage
  const saveToken = (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  };

  // 清除 token
  const clearToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  };

  // **预加载 Dashboard 数据（在后台静默加载）**
  const preloadDashboardData = async (token: string) => {
    try {
      // 检查是否最近已经预加载过（5分钟内）
      const lastPreload = localStorage.getItem('dashboard_preload_time');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (lastPreload && (now - parseInt(lastPreload)) < fiveMinutes) {
        console.log('✅ Dashboard data already preloaded recently');
        return;
      }

      console.log('🚀 Preloading dashboard and mining modes data...');

      // **并发预加载 Dashboard 和 Mining Modes 数据**
      const [dashboardResponse, miningModesResponse] = await Promise.all([
        fetch('/api/user/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/stats/mining-modes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      // 缓存 Dashboard 数据
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        localStorage.setItem('dashboard_cache', JSON.stringify(data));
        localStorage.setItem('dashboard_preload_time', now.toString());
        console.log('✅ Dashboard data preloaded');
      }

      // 缓存 Mining Modes 数据
      if (miningModesResponse.ok) {
        const data = await miningModesResponse.json();
        localStorage.setItem('mining_modes_cache', JSON.stringify(data));
        localStorage.setItem('mining_modes_preload_time', now.toString());
        console.log('✅ Mining modes data preloaded');
      }
    } catch (error) {
      console.error('Preload failed (non-critical):', error);
      // 预加载失败不影响用户体验
    }
  };

  // 刷新会话信息
  const refreshSession = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // **缓存优化：检查是否在5分钟内已经刷新过会话**
      const lastRefresh = localStorage.getItem('session_last_refresh');
      const cachedUser = localStorage.getItem('cached_user');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (lastRefresh && cachedUser && (now - parseInt(lastRefresh)) < fiveMinutes) {
        console.log('✅ Using cached user session');
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        // 缓存用户信息
        localStorage.setItem('cached_user', JSON.stringify(data.user));
        localStorage.setItem('session_last_refresh', now.toString());

        // **预加载优化：登录成功后立即预加载 Dashboard 数据**
        preloadDashboardData(token);
      } else {
        clearToken();
        setUser(null);
        localStorage.removeItem('cached_user');
        localStorage.removeItem('session_last_refresh');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      clearToken();
      setUser(null);
      localStorage.removeItem('cached_user');
      localStorage.removeItem('session_last_refresh');
    } finally {
      setLoading(false);
    }
  };

  // 登录 - 重定向到 Google OAuth
  const login = () => {
    window.location.href = '/api/auth/google/login';
  };

  // 登出
  const logout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearToken();
      setUser(null);
    }
  };

  // 初始化：检查 URL 中的 token 和刷新会话
  useEffect(() => {
    const initAuth = async () => {
      // 🔧 开发模式：本地环境自动登录真实用户
      const isDevelopment = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isDevelopment) {
        // 检查是否已有token
        const existingToken = getToken();

        if (!existingToken || existingToken === 'dev_fake_jwt_token_for_local_testing_only') {
          // 检查是否已经初始化过（缓存）
          const devUserInitialized = localStorage.getItem('dev_user_initialized');
          const lastInitTime = localStorage.getItem('dev_user_init_time');
          const now = Date.now();
          const oneHour = 60 * 60 * 1000;

          // 如果1小时内已经初始化过，跳过（临时禁用缓存用于调试）
          // if (devUserInitialized === 'true' && lastInitTime && (now - parseInt(lastInitTime)) < oneHour) {
          //   console.log('🔧 Dev user already initialized recently, skipping...');
          //   await refreshSession();
          //   return;
          // }

          console.log('🔧 Development Mode: Initializing real dev user...');

          try {
            // 调用API初始化开发用户并获取真实token
            const response = await fetch('/api/test/init-dev-user');

            if (response.ok) {
              const data = await response.json();

              // 保存真实的JWT token
              saveToken(data.token);

              // 标记已初始化
              localStorage.setItem('dev_user_initialized', 'true');
              localStorage.setItem('dev_user_init_time', now.toString());

              console.log('✅ Dev user initialized:', data.user);
              console.log('✅ Real JWT token generated and saved');

              // 使用真实token刷新会话
              await refreshSession();
              return;
            } else {
              console.error('Failed to initialize dev user');
            }
          } catch (error) {
            console.error('Dev user init error:', error);
          }
        } else {
          // 已有真实token，直接刷新会话
          await refreshSession();
          return;
        }
      }

      // 检查 URL 中是否有错误（来自 OAuth）
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');

      // 检查是否是预览部署的 OAuth 错误
      if (error === 'oauth_disabled_in_preview') {
        console.warn('OAuth is disabled in preview deployments. Please test on production or local development.');
        // 清除 URL 参数
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      }

      // 检查 URL 中是否有 token（来自 OAuth 回调）
      const token = urlParams.get('token');

      if (token) {
        // 保存 token
        saveToken(token);

        // 清除 URL 中的 token
        window.history.replaceState({}, document.title, window.location.pathname);

        // 刷新会话
        await refreshSession();
      } else {
        // 如果没有 token，尝试刷新现有会话
        await refreshSession();
      }
    };

    initAuth();

    // 定期刷新会话（每 30 分钟）
    const interval = setInterval(() => {
      refreshSession();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    authenticated: !!user,
    login,
    logout,
    refreshSession,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

