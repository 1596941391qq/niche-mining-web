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
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-2 border-primary pl-3">
          <h1 className="text-2xl font-bold text-white mb-1 font-mono uppercase tracking-tight">
            API Keys
          </h1>
          <p className="text-zinc-400 text-xs font-mono">
            Manage your API keys for authentication
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-zinc-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
          Create New Key
        </button>
      </div>

      {/* Feature Not Available Banner */}
      <div className="bg-accent-orange/10 border-2 border-accent-orange/30 p-6 text-center">
        <h3 className="text-lg font-bold text-accent-orange mb-2 font-mono uppercase tracking-wider">
          API Management Coming Soon
        </h3>
        <p className="text-sm text-zinc-400 font-mono max-w-md mx-auto">
          API key management feature is currently under development and will be available in a future update.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-accent-yellow/10 border border-accent-yellow/30 p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-accent-yellow flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-yellow-200 font-medium mb-1 font-mono">
            Keep your API keys secure
          </p>
          <p className="text-[10px] text-yellow-300/80 font-mono">
            Never share your API keys publicly. Treat them like passwords and store them securely.
          </p>
        </div>
      </div>

      {/* API Keys List - Empty State */}
      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <div className="bg-surface border border-border p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Key className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-wider">
                No API Keys Created
              </h3>
              <p className="text-sm text-zinc-400 font-mono max-w-md mb-6">
                API keys will appear here once the feature is enabled. This feature is currently under development.
              </p>
              <button
                disabled
                className="px-6 py-3 bg-zinc-800 text-zinc-500 cursor-not-allowed font-mono uppercase tracking-wider text-sm border border-zinc-700"
              >
                Create First API Key (Coming Soon)
              </button>
            </div>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
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
                    <h3 className="text-sm font-bold text-white font-mono">{apiKey.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Created {apiKey.created}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono ${
                        apiKey.status === 'active'
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 ${
                          apiKey.status === 'active' ? 'bg-accent-green' : 'bg-zinc-500'
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

              <div className="bg-black/30 border border-border p-4 mb-4 font-mono">
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm text-zinc-300 flex-1 overflow-x-auto">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                  </code>
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="p-2 text-zinc-600 cursor-not-allowed"
                      title="Feature disabled (demo only)"
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      disabled
                      className="p-2 text-zinc-600 cursor-not-allowed"
                      title="Feature disabled (demo only)"
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
                  <p className="text-sm text-white font-mono data-value">{apiKey.lastUsed}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">
                    Total Calls
                  </p>
                  <p className="text-sm text-white font-mono data-value">{apiKey.calls.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Documentation */}
      <div className="bg-surface border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            API Documentation
          </h2>
        </div>
        <div className="space-y-4 text-sm text-zinc-300 font-mono">
          <div>
            <h3 className="text-white font-bold mb-2">Authentication</h3>
            <p className="mb-2">Include your API key in the request header:</p>
            <div className="bg-black/30 border border-border p-3 font-mono text-xs overflow-x-auto">
              <code className="text-primary">Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">Example Request</h3>
            <div className="bg-black/30 border border-border p-3 font-mono text-xs overflow-x-auto">
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
          <button disabled className="text-zinc-600 cursor-not-allowed font-mono text-xs uppercase tracking-wider">
            Documentation Not Available
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsoleAPI;
