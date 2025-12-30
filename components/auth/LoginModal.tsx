import React, { useState, useContext } from "react";
import { X, Mail, Lock, User, LogIn, UserPlus } from "lucide-react";
import { LanguageContext } from "../../contexts/LanguageContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name?: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onEmailLogin,
  onRegister,
}) => {
  const { lang, t } = useContext(LanguageContext);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await onEmailLogin(email, password);
        onClose();
        resetForm();
      } else {
        await onRegister(email, password, name || undefined);
        onClose();
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || (lang === "cn" ? "操作失败" : "Operation failed"));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface border border-border p-8 m-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2 font-mono uppercase tracking-tight">
            {mode === "login"
              ? lang === "cn"
                ? "登录"
                : "Login"
              : lang === "cn"
              ? "注册"
              : "Sign Up"}
          </h2>
          <p className="text-sm text-text-tertiary font-mono">
            {mode === "login"
              ? lang === "cn"
                ? "登录您的账户"
                : "Sign in to your account"
              : lang === "cn"
              ? "创建新账户"
              : "Create a new account"}
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={onGoogleLogin}
          className="w-full mb-4 px-6 py-3 bg-white text-gray-900 font-bold text-sm uppercase tracking-wider border border-border hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {lang === "cn" ? "使用 Google 登录" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-surface text-text-tertiary font-mono">
              {lang === "cn" ? "或" : "OR"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
                {lang === "cn" ? "姓名（可选）" : "Name (Optional)"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border text-text-primary focus:border-primary focus:outline-none transition-colors font-mono"
                  placeholder={lang === "cn" ? "您的姓名" : "Your name"}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
              {lang === "cn" ? "邮箱" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-background border border-border text-text-primary focus:border-primary focus:outline-none transition-colors font-mono"
                placeholder={lang === "cn" ? "your@email.com" : "your@email.com"}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
              {lang === "cn" ? "密码" : "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border text-text-primary focus:border-primary focus:outline-none transition-colors font-mono"
                placeholder={lang === "cn" ? "至少8位" : "At least 8 characters"}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold text-sm uppercase tracking-wider hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {lang === "cn" ? "处理中..." : "Processing..."}
              </>
            ) : (
              <>
                {mode === "login" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    {lang === "cn" ? "登录" : "Login"}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {lang === "cn" ? "注册" : "Sign Up"}
                  </>
                )}
              </>
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors font-mono"
          >
            {mode === "login" ? (
              <>
                {lang === "cn" ? "还没有账户？" : "Don't have an account? "}
                <span className="text-primary font-bold">
                  {lang === "cn" ? "立即注册" : "Sign Up"}
                </span>
              </>
            ) : (
              <>
                {lang === "cn" ? "已有账户？" : "Already have an account? "}
                <span className="text-primary font-bold">
                  {lang === "cn" ? "立即登录" : "Sign In"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

