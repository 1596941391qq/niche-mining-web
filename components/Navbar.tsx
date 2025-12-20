import React, { useContext, useState, useEffect } from "react";
import { Pickaxe, Menu, X, Globe, LogIn, LogOut, User } from "lucide-react";
import { LanguageContext } from "../App";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { user, authenticated, login, logout, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 检测是否是预览部署
  const isPreviewDeployment =
    typeof window !== "undefined" &&
    window.location.hostname.includes("vercel.app") &&
    !window.location.hostname.startsWith("niche-mining-web.vercel.app");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    if (isPreviewDeployment) {
      alert(
        "OAuth login is disabled in preview deployments.\n\n" +
          "Reason: Google OAuth does not support dynamic preview URLs.\n\n" +
          "Please test login on:\n" +
          "• Production: https://niche-mining-web.vercel.app\n" +
          "• Local dev: http://localhost:3000"
      );
      return;
    }
    login();
  };

  const navLinks = [
    { name: t.nav.features, href: "#features" },
    { name: t.nav.agents, href: "#agents" },
    { name: t.nav.howItWorks, href: "#how-it-works" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border py-3 shadow-lg"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400">
            <Pickaxe className="w-6 h-6 transform group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-white leading-none">
              Niche Digger
            </span>
            <span className="text-[10px] text-primary/90 font-mono tracking-[0.2em] uppercase mt-1">
              Blue Ocean Protocol
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors font-mono uppercase tracking-widest relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-zinc-800 mx-2"></div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "cn" : "en")}
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors group"
          >
            <Globe className="w-3 h-3 group-hover:text-primary transition-colors" />
            <span className={lang === "en" ? "text-white font-bold" : ""}>
              EN
            </span>
            <span className="text-zinc-700">/</span>
            <span className={lang === "cn" ? "text-white font-bold" : ""}>
              CN
            </span>
          </button>

          {/* Auth Section */}
          {!loading && (
            <>
              {authenticated && user ? (
                <div className="flex items-center gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || user.email}
                        className="w-8 h-8 rounded-full border border-primary/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <span className="text-zinc-300 hidden lg:block max-w-[120px] truncate">
                      {user.name || user.email}
                    </span>
                  </div>
                  <a
                    href="#console"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white bg-primary/10 border border-primary/30 hover:border-primary/50 rounded-sm transition-all uppercase tracking-wider"
                  >
                    <User className="w-3 h-3" />
                    <span className="hidden sm:inline">Console</span>
                  </a>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-primary border border-zinc-800 hover:border-primary/50 rounded-sm transition-all uppercase tracking-wider"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-6 py-2.5 bg-zinc-100 text-black hover:bg-primary hover:text-black rounded-sm text-xs font-bold transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] uppercase tracking-wider"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "cn" : "en")}
            className="text-xs font-mono font-bold text-zinc-400 border border-zinc-800 px-2 py-1 rounded hover:border-primary hover:text-primary transition-colors"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-300 hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-zinc-300 hover:text-primary text-lg font-bold font-mono tracking-wider border-l-2 border-transparent hover:border-primary pl-4 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {!loading && (
            <>
              {authenticated && user ? (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface/50 rounded-sm border border-border">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || user.email}
                        className="w-10 h-10 rounded-full border border-primary/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">
                        {user.name || user.email}
                      </p>
                      <p className="text-zinc-500 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#console"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 bg-primary/10 border border-primary/30 text-primary hover:text-white hover:border-primary/50 font-bold rounded-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Console</span>
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 bg-transparent border border-zinc-800 text-zinc-300 hover:border-primary hover:text-primary font-bold rounded-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-4 bg-primary text-black font-bold rounded-sm mt-6 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
