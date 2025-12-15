import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  calls: number;
  status: 'active' | 'inactive';
}

const ConsoleAPI: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sk_live_1234567890abcdefghijklmnopqrstuvwxyz',
      created: '2025-12-01',
      lastUsed: '2 hours ago',
      calls: 12543,
      status: 'active',
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sk_test_9876543210zyxwvutsrqponmlkjihgfedcba',
      created: '2025-11-15',
      lastUsed: '1 day ago',
      calls: 3421,
      status: 'active',
    },
  ]);

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 7);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'•'.repeat(32)}${suffix}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
            API Keys
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage your API keys for authentication
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Key
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-200 font-medium mb-1">
            Keep your API keys secure
          </p>
          <p className="text-xs text-yellow-300/80">
            Never share your API keys publicly. Treat them like passwords and store them securely.
          </p>
        </div>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 border border-primary/30 rounded">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">{apiKey.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-500 font-mono">
                      Created {apiKey.created}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
                      apiKey.status === 'active'
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        apiKey.status === 'active' ? 'bg-primary' : 'bg-zinc-500'
                      }`} />
                      {apiKey.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-zinc-400 hover:text-red-400 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black/30 border border-border rounded p-4 mb-4 font-mono">
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm text-zinc-300 flex-1 overflow-x-auto">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                </code>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                    title={visibleKeys.has(apiKey.id) ? 'Hide' : 'Show'}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="p-2 text-zinc-400 hover:text-primary transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  Last Used
                </p>
                <p className="text-sm text-white font-mono">{apiKey.lastUsed}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                  Total Calls
                </p>
                <p className="text-sm text-white font-mono">{apiKey.calls.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documentation */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            API Documentation
          </h2>
        </div>
        <div className="space-y-4 text-sm text-zinc-300">
          <div>
            <h3 className="text-white font-bold mb-2">Authentication</h3>
            <p className="mb-2">Include your API key in the request header:</p>
            <div className="bg-black/30 border border-border rounded p-3 font-mono text-xs overflow-x-auto">
              <code className="text-primary">Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Example Request</h3>
            <div className="bg-black/30 border border-border rounded p-3 font-mono text-xs overflow-x-auto">
              <code>
                <span className="text-blue-400">curl</span>{' '}
                <span className="text-zinc-400">-X POST</span>{' '}
                <span className="text-green-400">"https://api.niche-mining.com/v1/analyze"</span>{' '}
                <span className="text-zinc-400">\</span>
                <br />
                {'  '}<span className="text-zinc-400">-H</span>{' '}
                <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span>{' '}
                <span className="text-zinc-400">\</span>
                <br />
                {'  '}<span className="text-zinc-400">-H</span>{' '}
                <span className="text-green-400">"Content-Type: application/json"</span>
              </code>
            </div>
          </div>
          <button className="text-primary hover:text-primary/80 font-mono text-xs uppercase tracking-wider transition-colors">
            View Full Documentation →
          </button>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-sm p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
              Create API Key
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  placeholder="Production API"
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-white placeholder-zinc-600 focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 font-mono uppercase tracking-wider mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="API key for production environment..."
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-white placeholder-zinc-600 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-transparent border border-border text-zinc-300 hover:border-primary/50 hover:text-white rounded-sm text-sm font-mono uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleAPI;
