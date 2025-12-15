import React, { useState } from 'react';
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

const ConsoleSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-accent-orange pl-4">
        <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
          Settings
        </h1>
        <p className="text-zinc-400 text-sm font-mono">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Profile Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-2xl">锰</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white text-sm font-mono uppercase tracking-wider transition-all">
                <Camera className="w-4 h-4" />
                Change Avatar
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="锰"
              className="w-full px-4 py-3 bg-background border border-border rounded-sm text-white focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="x1596941391@gmail.com"
              className="w-full px-4 py-3 bg-background border border-border rounded-sm text-white focus:border-primary/50 focus:outline-none transition-colors"
            />
            <p className="text-xs text-zinc-500 mt-2 font-mono">
              This email is linked to your Google account
            </p>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Preferences
          </h2>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-2">
              Language
            </label>
            <select className="w-full px-4 py-3 bg-background border border-border text-white focus:border-primary/50 focus:outline-none transition-colors">
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-2">
              Timezone
            </label>
            <select className="w-full px-4 py-3 bg-background border border-border text-white focus:border-primary/50 focus:outline-none transition-colors">
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
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Notifications
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border">
            <div>
              <h3 className="text-white font-bold mb-1 font-mono">Email Notifications</h3>
              <p className="text-sm text-zinc-400 font-mono">
                Receive updates about your account and usage
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-primary' : 'bg-zinc-700'
              }`}
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
              <h3 className="text-white font-bold mb-1 font-mono">Usage Alerts</h3>
              <p className="text-sm text-zinc-400 font-mono">
                Get notified when you reach 80% of your credit limit
              </p>
            </div>
            <button className="relative w-14 h-7 rounded-full bg-primary transition-colors">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border">
            <div>
              <h3 className="text-white font-bold mb-1 font-mono">Marketing Emails</h3>
              <p className="text-sm text-zinc-400 font-mono">
                Receive news about new features and promotions
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
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Security
          </h2>
        </div>

        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold font-mono">Two-Factor Authentication</h3>
                  {twoFactorEnabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Enabled
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 font-mono">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`px-4 py-2 text-sm font-mono uppercase tracking-wider transition-all ${
                twoFactorEnabled
                  ? 'bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white'
                  : 'bg-primary text-black hover:bg-primary/90'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {/* Password */}
          <div className="p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1 font-mono">Password</h3>
                <p className="text-sm text-zinc-400 font-mono">
                  You're signed in with Google OAuth. No password needed.
                </p>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1 font-mono">Active Sessions</h3>
                <p className="text-sm text-zinc-400 font-mono">
                  Manage and logout from your active sessions
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white text-sm font-mono uppercase tracking-wider transition-all">
              View Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Danger Zone
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-red-500/30">
            <h3 className="text-white font-bold mb-1 font-mono">Delete Account</h3>
            <p className="text-sm text-zinc-400 mb-4 font-mono">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-mono uppercase tracking-wider transition-all"
            >
              Delete Account
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
              <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
                Delete Account
              </h2>
            </div>
            <p className="text-zinc-300 mb-6 font-mono">
              This action cannot be undone. This will permanently delete your account and remove all
              your data from our servers.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6">
              <p className="text-sm text-red-300 font-mono">
                <strong>Warning:</strong> You will lose access to:
              </p>
              <ul className="text-sm text-red-300 mt-2 space-y-1 ml-4 font-mono">
                <li>• All API keys and configurations</li>
                <li>• Remaining credits and subscriptions</li>
                <li>• Usage history and analytics</li>
                <li>• Team memberships</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white text-sm font-mono uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleSettings;
