import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, Translations } from '../types';
import { CONTENT } from '../constants';

interface LanguageContextType {
  lang: Language;
  t: Translations;
  setLang: (l: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初始化语言：优先从 localStorage 获取，其次根据浏览器语言判断
  const [lang, setLangState] = useState<Language>(() => {
    // 1. 检查 localStorage
    const savedLang = localStorage.getItem('user_language') as Language;
    if (savedLang === 'cn' || savedLang === 'en') {
      return savedLang;
    }

    // 2. 检查浏览器语言
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      return 'cn';
    }

    // 3. 默认英文 (对于国际化 SEO 更友好)
    return 'en';
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('user_language', l);
  };

  const t = CONTENT[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

