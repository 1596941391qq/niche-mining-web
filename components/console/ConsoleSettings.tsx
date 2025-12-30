import React, { useState, useContext } from 'react';
import {
  User,
  Mail,
  Globe,
  Bell,
  Shield,
  Lock,
  Trash2,
  Save,
  Camera,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';

const ConsoleSettings: React.FC = () => {
  const { user } = useAuth();
  const { lang, t } = useContext(LanguageContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 检查哪些功能未开放（没有任何处理逻辑）
  const isFeatureDisabled = true; // 目前所有保存功能都未开放

  return (
    <div className="space-y-8">
      {/* Header - Settings */}
      <div className="border-l-4 border-accent-orange pl-4">
        <h1 className="text-3xl font-bold text-text-primary mb-2 font-mono uppercase tracking-tight">
          {t.console?.settings?.profile?.title || (lang === 'cn' ? '设置' : 'Settings')}
        </h1>
        <p className="text-text-tertiary text-sm font-mono">
          {lang === 'cn' ? '管理您的账户设置和偏好' : 'Manage your account settings and preferences'}
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary font-mono uppercase tracking-wider">
            {t.console?.settings?.profile?.title || 'Profile Settings'}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm text-text-tertiary font-mono uppercase tracking-wider mb-3">
              {t.console?.settings?.profile?.avatar || 'Profile Picture'}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-bold text-2xl">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary text-sm font-mono uppercase tracking-wider transition-all">
                  <Camera className="w-4 h-4" />
                  {t.console?.settings?.profile?.changeAvatar || 'Change Avatar'}
                </button>
                <span className="text-xs text-accent-orange font-mono">
                  {t.console?.settings?.profile?.noSave || 'Feature not available'}
                </span>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-text-tertiary font-mono uppercase tracking-wider mb-2">
              {t.console?.settings?.profile?.fullName || 'Full Name'}
            </label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-text-tertiary font-mono uppercase tracking-wider mb-2">
              {t.console?.settings?.profile?.email || 'Email Address'}
            </label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              className="w-full px-4 py-3 bg-background border border-border rounded-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
            />
            <p className="text-xs text-text-tertiary mt-2 font-mono">
              {user?.email?.includes('google') || user?.email?.includes('gmail')
                ? (lang === 'cn' ? '此邮箱与您的 Google 账户关联' : 'This email is linked to your Google account')
                : (lang === 'cn' ? '邮箱已关联到您的账户' : 'Email linked to your account')}
            </p>
          </div>

          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
            title={t.console?.settings?.profile?.noSave || 'Feature not available'}
          >
            <Save className="w-4 h-4" />
            {t.console?.settings?.profile?.save || 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-surface border border-border p-6 opacity-75">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary font-mono uppercase tracking-wider">
            {t.console?.settings?.preferences?.title || 'Preferences'}
          </h2>
          <span className="ml-auto px-2 py-1 bg-accent-orange/20 text-accent-orange text-xs font-mono font-bold uppercase tracking-wider">
            {t.console?.settings?.security?.notAvailable || 'Coming Soon'}
          </span>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm text-text-tertiary font-mono uppercase tracking-wider mb-2">
              {t.console?.settings?.preferences?.language || 'Language'}
            </label>
            <select className="w-full px-4 py-3 bg-background border border-border text-text-primary focus:border-primary/50 focus:outline-none transition-colors">
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm text-text-tertiary font-mono uppercase tracking-wider mb-2">
              {t.console?.settings?.preferences?.timezone || 'Timezone'}
            </label>
            <select className="w-full px-4 py-3 bg-background border border-border text-text-primary focus:border-primary/50 focus:outline-none transition-colors">
              <option value="UTC+8">UTC+8 (Beijing, Shanghai)</option>
              <option value="UTC+9">UTC+9 (Tokyo, Seoul)</option>
              <option value="UTC-5">UTC-5 (New York)</option>
              <option value="UTC-8">UTC-8 (Los Angeles)</option>
              <option value="UTC+0">UTC+0 (London)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary font-mono uppercase tracking-wider">
            {t.console?.settings?.notifications?.title || 'Notifications'}
          </h2>
          <span className="ml-auto px-2 py-1 bg-accent-orange/20 text-accent-orange text-xs font-mono font-bold uppercase tracking-wider">
            {t.console?.settings?.security?.notAvailable || 'Coming Soon'}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border">
            <div>
              <h3 className="text-text-primary font-bold mb-1 font-mono">
                {t.console?.settings?.notifications?.email || 'Email Notifications'}
              </h3>
              <p className="text-sm text-text-tertiary font-mono">
                {t.console?.settings?.notifications?.emailDesc || 'Receive updates about your account and usage'}
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-primary' : 'bg-zinc-700'
              } disabled:opacity-50`}
              disabled
              title={t.console?.settings?.security?.notAvailable || 'Coming Soon'}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border">
            <div>
              <h3 className="text-text-primary font-bold mb-1 font-mono">
                {t.console?.settings?.notifications?.usage || 'Usage Alerts'}
              </h3>
              <p className="text-sm text-text-tertiary font-mono">
                {t.console?.settings?.notifications?.usageDesc || 'Get notified when you reach 80% of your credit limit'}
              </p>
            </div>
            <button className="relative w-14 h-7 rounded-full bg-primary transition-colors">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border">
            <div>
              <h3 className="text-text-primary font-bold mb-1 font-mono">
                {t.console?.settings?.notifications?.marketing || 'Marketing Emails'}
              </h3>
              <p className="text-sm text-text-tertiary font-mono">
                {t.console?.settings?.notifications?.marketingDesc || 'Receive news about new features and promotions'}
              </p>
            </div>
            <button className="relative w-14 h-7 rounded-full bg-zinc-700 transition-colors">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary font-mono uppercase tracking-wider">
            {t.console?.settings?.security?.title || 'Security'}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-text-primary font-bold font-mono">
                    {t.console?.settings?.security?.twoFactor || 'Two-Factor Authentication'}
                  </h3>
                  {twoFactorEnabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.console?.settings?.security?.disable || 'Enabled'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-tertiary font-mono">
                  {t.console?.settings?.security?.twoFactorDesc || 'Add an extra layer of security to your account'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              disabled
              className={`px-4 py-2 text-sm font-mono uppercase tracking-wider transition-all ${
                twoFactorEnabled
                  ? 'bg-transparent border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
                  : 'bg-primary text-black hover:bg-primary/90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={t.console?.settings?.security?.notAvailable || 'Coming Soon'}
            >
              {t.console?.settings?.security?.enable || 'Enable'}
            </button>
          </div>

          {/* Password */}
          <div className="p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-text-primary font-bold mb-1 font-mono">
                  {t.console?.settings?.security?.password || 'Password'}
                </h3>
                <p className="text-sm text-text-tertiary font-mono">
                  {t.console?.settings?.security?.passwordDesc || "You're signed in with Google OAuth. No password needed."}
                </p>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-text-primary font-bold mb-1 font-mono">
                  {t.console?.settings?.security?.sessions || 'Active Sessions'}
                </h3>
                <p className="text-sm text-text-tertiary font-mono">
                  {t.console?.settings?.security?.sessionsDesc || 'Manage and logout from your active sessions'}
                </p>
              </div>
            </div>
            <button
              disabled
              className="px-4 py-2 bg-transparent border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary text-sm font-mono uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={t.console?.settings?.security?.notAvailable || 'Coming Soon'}
            >
              {t.console?.settings?.security?.viewSessions || 'View Sessions'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold text-text-primary font-mono uppercase tracking-wider">
            {t.console?.settings?.danger?.title || 'Danger Zone'}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-red-500/30">
            <h3 className="text-text-primary font-bold mb-1 font-mono">
              {t.console?.settings?.danger?.delete || 'Delete Account'}
            </h3>
            <p className="text-sm text-text-tertiary mb-4 font-mono">
              {t.console?.settings?.danger?.deleteDesc || 'Once you delete your account, there is no going back. Please be certain.'}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-mono uppercase tracking-wider transition-all"
            >
              {t.console?.settings?.danger?.delete || 'Delete Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-red-500/30 p-8 max-w-md w-full mx-4 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>

            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-text-primary font-mono uppercase tracking-wider">
                {t.console?.settings?.deleteModal?.title || 'Delete Account'}
              </h2>
            </div>
            <p className="text-text-secondary mb-6 font-mono">
              {t.console?.settings?.deleteModal?.warning || "This action cannot be undone. This will permanently delete your account and remove all your data from our servers."}
            </p>
            <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6">
              <p className="text-sm text-red-300 font-mono">
                <strong>{lang === 'cn' ? '警告' : 'Warning'}:</strong> {lang === 'cn' ? '您将失去对以下内容的访问权限：' : 'You will lose access to:'}
              </p>
              <ul className="text-sm text-red-300 mt-2 space-y-1 ml-4 font-mono">
                <li>• {lang === 'cn' ? '所有 API 密钥和配置' : 'All API keys and configurations'}</li>
                <li>• {lang === 'cn' ? '剩余额度和订阅' : 'Remaining credits and subscriptions'}</li>
                <li>• {lang === 'cn' ? '使用历史和分析数据' : 'Usage history and analytics'}</li>
                <li>• {lang === 'cn' ? '团队会员资格' : 'Team memberships'}</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-transparent border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary text-sm font-mono uppercase tracking-wider transition-all"
              >
                {t.console?.settings?.deleteModal?.cancel || 'Cancel'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all"
              >
                {t.console?.settings?.deleteModal?.delete || 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleSettings;
