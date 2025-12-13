import React, { useState, createContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ToolSelector from './components/ToolSelector';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import { Language, Translations } from './types';
import { CONTENT } from './constants';
import { AuthProvider } from './contexts/AuthContext';

export const LanguageContext = createContext<{
  lang: Language;
  t: Translations;
  setLang: (l: Language) => void;
}>({
  lang: 'cn',
  t: CONTENT['cn'],
  setLang: () => {},
});

function App() {
  const [lang, setLang] = useState<Language>('cn');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const t = CONTENT[lang];

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'privacy' || hash === 'terms') {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      default:
        return (
          <>
            <Hero />
            <Features />
            <ToolSelector />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <LanguageContext.Provider value={{ lang, t, setLang }}>
        <div className="min-h-screen bg-background text-zinc-300 font-sans selection:bg-primary selection:text-black flex flex-col">
          <Navbar />
          <main className="flex-grow flex flex-col">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </LanguageContext.Provider>
    </AuthProvider>
  );
}

export default App;
