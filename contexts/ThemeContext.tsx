import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  isHomePage?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, isHomePage = false }) => {
  // 控制台主题状态（存储在 localStorage）
  const [consoleTheme, setConsoleTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('console_theme') as Theme;
    return saved || 'dark';
  });

  // 根据当前页面决定实际应用的主题
  // 首页始终使用 dark，控制台使用 consoleTheme
  const effectiveTheme = isHomePage ? 'dark' : consoleTheme;

  useEffect(() => {
    // 更新 HTML 的 class
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const toggleTheme = () => {
    // 只在控制台页面允许切换主题
    if (!isHomePage) {
      setConsoleTheme(prev => {
        const newTheme = prev === 'dark' ? 'light' : 'dark';
        localStorage.setItem('console_theme', newTheme);
        return newTheme;
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
