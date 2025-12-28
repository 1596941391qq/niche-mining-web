import React, { useState, useEffect, useContext } from 'react';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Shield,
  AlertTriangle,
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageContext } from '../../App';

interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  apiKey?: string; // 只在创建时返回
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usage?: {
    requestCount: number;
    totalCreditsUsed: number;
  };
}

const ConsoleAPI: React.FC = () => {
  const { getToken } = useAuth();
  const { lang, t } = useContext(LanguageContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiresAt, setNewKeyExpiresAt] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 翻译文本
  const translations = {
    en: {
      title: 'API Keys',
      subtitle: 'Manage your API keys for authentication',
      createNew: 'Create New Key',
      noKeys: 'No API Keys Created',
      noKeysDesc: 'Create your first API key to start using the API',
      createFirst: 'Create First API Key',
      name: 'Name',
      created: 'Created',
      lastUsed: 'Last Used',
      never: 'Never',
      expires: 'Expires',
      neverExpires: 'Never',
      status: 'Status',
      usage: 'Usage',
      requests: 'Requests',
      creditsUsed: 'Credits Used',
      active: 'Active',
      inactive: 'Inactive',
      copy: 'Copy',
      delete: 'Delete',
      show: 'Show',
      hide: 'Hide',
      createModal: {
        title: 'Create New API Key',
        nameLabel: 'Key Name',
        namePlaceholder: 'e.g., Production API Key',
        expiresLabel: 'Expires At (Optional)',
        expiresPlaceholder: 'YYYY-MM-DD',
        create: 'Create Key',
        cancel: 'Cancel',
        warning: 'Please save your API key securely. You will not be able to see it again.',
        copyKey: 'Copy API Key',
        close: 'Close',
      },
      deleteConfirm: 'Are you sure you want to delete this API key? This action cannot be undone.',
      deleteSuccess: 'API key deleted successfully',
      createSuccess: 'API key created successfully',
      error: 'An error occurred',
      warning: 'Keep your API keys secure',
      warningDesc: 'Never share your API keys publicly. Treat them like passwords and store them securely.',
      docTitle: 'API Documentation',
      docAuth: 'Authentication',
      docAuthDesc: 'Include your API key in the request header:',
      docExample: 'Example Request',
      viewDocs: 'View Full Documentation',
      loading: 'Loading...',
      failedToLoad: 'Failed to load API keys',
      failedToCreate: 'Failed to create API key',
      failedToDelete: 'Failed to delete API key',
    },
    cn: {
      title: 'API 密钥',
      subtitle: '管理您的 API 密钥用于身份验证',
      createNew: '创建新密钥',
      noKeys: '未创建 API 密钥',
      noKeysDesc: '创建您的第一个 API 密钥以开始使用 API',
      createFirst: '创建第一个 API 密钥',
      name: '名称',
      created: '创建时间',
      lastUsed: '最后使用',
      never: '从未使用',
      expires: '过期时间',
      neverExpires: '永不过期',
      status: '状态',
      usage: '用量',
      requests: '请求次数',
      creditsUsed: '消耗积分',
      active: '激活',
      inactive: '未激活',
      copy: '复制',
      delete: '删除',
      show: '显示',
      hide: '隐藏',
      createModal: {
        title: '创建新 API 密钥',
        nameLabel: '密钥名称',
        namePlaceholder: '例如：生产环境 API 密钥',
        expiresLabel: '过期时间（可选）',
        expiresPlaceholder: 'YYYY-MM-DD',
        create: '创建密钥',
        cancel: '取消',
        warning: '请安全保存您的 API 密钥。创建后将无法再次查看完整密钥。',
        copyKey: '复制 API 密钥',
        close: '关闭',
      },
      deleteConfirm: '您确定要删除此 API 密钥吗？此操作无法撤销。',
      deleteSuccess: 'API 密钥删除成功',
      createSuccess: 'API 密钥创建成功',
      error: '发生错误',
      warning: '请妥善保管您的 API 密钥',
      warningDesc: '切勿公开分享您的 API 密钥。请像对待密码一样妥善保管。',
      docTitle: 'API 文档',
      docAuth: '身份验证',
      docAuthDesc: '在请求头中包含您的 API 密钥：',
      docExample: '请求示例',
      viewDocs: '查看完整文档',
      loading: '加载中...',
      failedToLoad: '加载 API 密钥失败',
      failedToCreate: '创建 API 密钥失败',
      failedToDelete: '删除 API 密钥失败',
    },
  };

  const tr = translations[lang as 'en' | 'cn'] || translations.en;

  // 获取 API keys 列表
  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/v1/api-keys', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.data?.apiKeys || []);
        setError(null); // 成功时清除错误
      } else {
        // 只在真正的错误时显示错误消息（不是空列表）
        const errorData = await response.json().catch(() => ({}));
        // 如果是 401 或其他真正的错误，才显示错误
        if (response.status !== 200) {
          setError(errorData.message || tr.failedToLoad);
        } else {
          // 空列表不是错误
          setApiKeys([]);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      // 只在网络错误等真正的问题时显示错误
      setError(tr.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [getToken]);

  // 创建 API key
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      setError(lang === 'cn' ? '请输入密钥名称' : 'Please enter a key name');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError(lang === 'cn' ? '请先登录' : 'Please login first');
        return;
      }

      const body: any = { name: newKeyName.trim() };
      if (newKeyExpiresAt) {
        // 转换为 ISO 格式
        const date = new Date(newKeyExpiresAt);
        if (!isNaN(date.getTime())) {
          body.expiresAt = date.toISOString();
        }
      }

      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const newKey = data.data;
        setNewlyCreatedKey(newKey.apiKey);
        setSuccess(tr.createSuccess);
        setNewKeyName('');
        setNewKeyExpiresAt('');
        await fetchApiKeys();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || tr.failedToCreate);
      }
    } catch (err) {
      console.error('Failed to create API key:', err);
      setError(tr.failedToCreate);
    } finally {
      setCreating(false);
    }
  };

  // 删除 API key
  const handleDeleteKey = async (keyId: string) => {
    if (!confirm(tr.deleteConfirm)) {
      return;
    }

    try {
      setDeletingId(keyId);
      setError(null);
      const token = getToken();
      if (!token) {
        setError(lang === 'cn' ? '请先登录' : 'Please login first');
        return;
      }

      const response = await fetch(`/api/v1/api-keys?id=${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccess(tr.deleteSuccess);
        await fetchApiKeys();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || tr.failedToDelete);
      }
    } catch (err) {
      console.error('Failed to delete API key:', err);
      setError(tr.failedToDelete);
    } finally {
      setDeletingId(null);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(lang === 'cn' ? '已复制到剪贴板' : 'Copied to clipboard');
    setTimeout(() => setSuccess(null), 2000);
  };

  // 切换显示/隐藏
  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return tr.never;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === 'cn' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // 跳转到文档页面
  const handleViewDocs = () => {
    window.open('/docs', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-2 border-primary pl-3">
          <h1 className="text-2xl font-bold text-text-primary mb-1 font-mono uppercase tracking-tight">
            {tr.title}
          </h1>
          <p className="text-text-tertiary text-xs font-mono">{tr.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3 h-3" />
          {tr.createNew}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-primary/10 border border-primary/30 p-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm text-primary font-mono">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-accent-red/10 border border-accent-red/30 p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0" />
          <p className="text-sm text-accent-red font-mono">{error}</p>
        </div>
      )}

      {/* Warning Banner */}
      <div className="bg-accent-yellow/10 border border-accent-yellow/30 p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-accent-yellow flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-accent-yellow font-medium mb-1 font-mono">
            {tr.warning}
          </p>
          <p className="text-[10px] text-accent-yellow/80 font-mono">
            {tr.warningDesc}
          </p>
        </div>
      </div>

      {/* API Keys List */}
      {loading ? (
        <div className="bg-surface border border-border p-8 text-center">
          <p className="text-text-tertiary font-mono">{tr.loading}</p>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="bg-surface border border-border p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Key className="w-12 h-12 text-text-tertiary mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2 font-mono uppercase tracking-wider">
              {tr.noKeys}
            </h3>
            <p className="text-sm text-text-tertiary font-mono max-w-md mb-6">
              {tr.noKeysDesc}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-mono uppercase tracking-wider text-sm border border-primary/30 transition-colors"
            >
              {tr.createFirst}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="bg-surface border border-border p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 border border-primary/30">
                    <Key className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary font-mono">
                      {apiKey.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-text-tertiary font-mono">
                        {tr.created} {formatDate(apiKey.createdAt)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono ${
                          apiKey.isActive
                            ? 'bg-primary/10 text-primary border border-primary/30'
                            : 'bg-zinc-800 text-text-tertiary border border-zinc-700'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 ${
                            apiKey.isActive ? 'bg-primary' : 'bg-text-tertiary'
                          }`}
                        />
                        {apiKey.isActive ? tr.active : tr.inactive}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteKey(apiKey.id)}
                  disabled={deletingId === apiKey.id}
                  className="text-text-tertiary hover:text-accent-red transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-background border border-border p-4 mb-4 font-mono">
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm text-text-primary flex-1 overflow-x-auto">
                    {apiKey.keyPrefix}
                  </code>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
                      title={visibleKeys.has(apiKey.id) ? tr.hide : tr.show}
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.keyPrefix)}
                      className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
                      title={tr.copy}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-1">
                    {tr.lastUsed}
                  </p>
                  <p className="text-sm text-text-primary font-mono">
                    {formatDate(apiKey.lastUsedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-1">
                    {tr.expires}
                  </p>
                  <p className="text-sm text-text-primary font-mono">
                    {apiKey.expiresAt ? formatDate(apiKey.expiresAt) : tr.neverExpires}
                  </p>
                </div>
              </div>

              {/* Usage Statistics */}
              {apiKey.usage && (
                <div className="bg-background border border-border p-3">
                  <p className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-2">
                    {tr.usage}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-text-tertiary font-mono mb-0.5">
                        {tr.requests}
                      </p>
                      <p className="text-sm text-text-primary font-mono font-bold">
                        {apiKey.usage.requestCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary font-mono mb-0.5">
                        {tr.creditsUsed}
                      </p>
                      <p className="text-sm text-text-primary font-mono font-bold">
                        {apiKey.usage.totalCreditsUsed.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documentation */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary font-mono uppercase tracking-wider">
            {tr.docTitle}
          </h2>
        </div>
        <div className="space-y-4 text-sm text-text-secondary font-mono">
          <div>
            <h3 className="text-text-primary font-bold mb-2">{tr.docAuth}</h3>
            <p className="mb-2 text-text-tertiary">{tr.docAuthDesc}</p>
            <div className="bg-background border border-border p-3 font-mono text-xs overflow-x-auto">
              <code className="text-primary">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
          <div>
            <h3 className="text-text-primary font-bold mb-2">{tr.docExample}</h3>
            <div className="bg-background border border-border p-3 font-mono text-xs overflow-x-auto">
              <code>
                <span className="text-blue-400">curl</span>{' '}
                <span className="text-text-tertiary">-X POST</span>{' '}
                <span className="text-primary">
                  "https://www.nichedigger.ai/api/v1/seo-agent"
                </span>{' '}
                <span className="text-text-tertiary">\</span>
                <br />
                {'  '}
                <span className="text-text-tertiary">-H</span>{' '}
                <span className="text-primary">
                  "Authorization: Bearer YOUR_API_KEY"
                </span>{' '}
                <span className="text-text-tertiary">\</span>
                <br />
                {'  '}
                <span className="text-text-tertiary">-H</span>{' '}
                <span className="text-primary">
                  "Content-Type: application/json"
                </span>
              </code>
            </div>
          </div>
          <button
            onClick={handleViewDocs}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white font-mono text-xs uppercase tracking-wider transition-colors"
          >
            {tr.viewDocs}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary font-mono uppercase tracking-wider">
                {tr.createModal.title}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeyName('');
                  setNewKeyExpiresAt('');
                  setNewlyCreatedKey(null);
                }}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newlyCreatedKey ? (
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/30 p-4">
                  <p className="text-sm text-primary font-mono mb-2">
                    {tr.createModal.warning}
                  </p>
                  <div className="bg-background border border-border p-3 font-mono text-xs">
                    <code className="text-primary break-all">{newlyCreatedKey}</code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(newlyCreatedKey)}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    {tr.createModal.copyKey}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewlyCreatedKey(null);
                      setNewKeyName('');
                      setNewKeyExpiresAt('');
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    {tr.createModal.close}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-tertiary font-mono mb-2">
                    {tr.createModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={tr.createModal.namePlaceholder}
                    className="w-full px-3 py-2 bg-background border border-border text-text-primary font-mono text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-tertiary font-mono mb-2">
                    {tr.createModal.expiresLabel}
                  </label>
                  <input
                    type="date"
                    value={newKeyExpiresAt}
                    onChange={(e) => setNewKeyExpiresAt(e.target.value)}
                    placeholder={tr.createModal.expiresPlaceholder}
                    className="w-full px-3 py-2 bg-background border border-border text-text-primary font-mono text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateKey}
                    disabled={creating || !newKeyName.trim()}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    {creating ? tr.loading : tr.createModal.create}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewKeyName('');
                      setNewKeyExpiresAt('');
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    {tr.createModal.cancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleAPI;

