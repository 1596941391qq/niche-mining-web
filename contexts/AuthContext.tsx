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

  // 刷新会话信息
  const refreshSession = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
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
      } else {
        clearToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      clearToken();
      setUser(null);
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
      // 🔧 开发模式：本地环境自动登录
      const isDevelopment = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isDevelopment) {
        // 设置开发模式假用户
        const devUser: User = {
          id: 'dev_user_123',
          email: 'dev@localhost',
          name: '开发测试用户',
          picture: null,
          lastLoginAt: new Date(),
        };

        // 🔑 生成假的 JWT token 用于开发测试（特别是跨项目认证测试）
        // 注意：这个 token 只在本地开发环境有效，不会泄露到生产环境
        const fakeToken = 'dev_fake_jwt_token_for_local_testing_only';
        saveToken(fakeToken);

        console.log('🔧 Development Mode: Auto-login enabled with fake token');
        setUser(devUser);
        setLoading(false);
        return;
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

