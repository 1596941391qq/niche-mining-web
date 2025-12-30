import React, { createContext, useState, useContext } from 'react';
import { Language, Translations } from '../types';
import { CONTENT } from '../constants';

interface LanguageContextType {
  lang: Language;
  t: Translations;
  setLang: (l: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('cn');
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

