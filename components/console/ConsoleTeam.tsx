import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  Shield,
  Trash2,
  MoreVertical,
  Check,
  X
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'active' | 'pending';
  joinedDate: string;
}

const ConsoleTeam: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamMembers] = useState<TeamMember[]>([]);

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-primary/20 text-primary border-primary/30',
      admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      member: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    };
    return styles[role as keyof typeof styles] || styles.member;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3" />;
      case 'admin':
        return <Shield className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-accent-orange pl-4">
          <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">
            Team
          </h1>
          <p className="text-zinc-400 text-sm font-mono">
            Manage your team members and permissions
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-6 py-3 bg-zinc-700 text-zinc-500 font-bold text-sm uppercase tracking-wider cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Feature Not Available Banner */}
      <div className="bg-accent-orange/10 border-2 border-accent-orange/30 p-6 text-center">
        <h3 className="text-lg font-bold text-accent-orange mb-2 font-mono uppercase tracking-wider">
          Team Management Coming Soon
        </h3>
        <p className="text-sm text-zinc-400 font-mono max-w-md mx-auto">
          Team management feature is currently under development and will be available in a future update.
        </p>
      </div>

      {/* Team Stats - All Zero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border p-6 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-white data-value">0</p>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Team members</p>
        </div>
        <div className="bg-surface border border-border p-6 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-5 h-5 text-accent-green" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-white data-value">0</p>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Active members</p>
        </div>
        <div className="bg-surface border border-border p-6 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-5 h-5 text-accent-yellow" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              Pending
            </span>
          </div>
          <p className="text-3xl font-bold text-white data-value">0</p>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Pending invites</p>
        </div>
      </div>

      {/* Team Members List - Empty State */}
      <div className="bg-surface border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Team Members
          </h2>
        </div>

        {teamMembers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-wider">
                No Team Members
              </h3>
              <p className="text-sm text-zinc-400 font-mono max-w-md mb-6">
                Team members will appear here once the team management feature is enabled. This feature is currently under development.
              </p>
              <button
                disabled
                className="px-6 py-3 bg-zinc-800 text-zinc-500 cursor-not-allowed font-mono uppercase tracking-wider text-sm border border-zinc-700"
              >
                Invite First Member (Coming Soon)
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 hover:bg-surface/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {member.name[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold">{member.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${getRoleBadge(
                            member.role
                          )}`}
                        >
                          {getRoleIcon(member.role)}
                          {member.role}
                        </span>
                        {member.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            <Mail className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 font-mono">{member.email}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-1">
                        Joined {member.joinedDate}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Disabled */}
                  {member.role !== 'owner' && (
                    <div className="flex items-center gap-2">
                      <button disabled className="p-2 text-zinc-600 cursor-not-allowed">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <button disabled className="p-2 text-zinc-600 cursor-not-allowed">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roles & Permissions */}
      <div className="bg-surface border border-border p-6 opacity-50">
        <h2 className="text-lg font-bold text-white mb-6 font-mono uppercase tracking-wider">
          Roles & Permissions (Preview)
        </h2>

        <div className="space-y-4">
          <div className="border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="text-white font-bold font-mono uppercase tracking-wider">Owner</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Full access to all features
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Billing and subscription management
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Team member management
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                API key management
              </li>
            </ul>
          </div>

          <div className="border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-bold font-mono uppercase tracking-wider">Admin</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Create and manage API keys
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                View team analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Invite team members
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-zinc-600" />
                Billing management
              </li>
            </ul>
          </div>

          <div className="border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-zinc-400" />
              <h3 className="text-white font-bold font-mono uppercase tracking-wider">Member</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Use existing API keys
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                View analytics
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-zinc-600" />
                Create API keys
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-zinc-600" />
                Manage team
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleTeam;
