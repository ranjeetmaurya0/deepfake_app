import React, { useState } from 'react';
import { MOCK_USERS } from '../data/authData';
import { AuthUser, UserRole } from '../types';
import { Shield, Key, UserCheck, Lock, RefreshCw, CheckCircle2, UserX, AlertCircle, Sparkles } from 'lucide-react';

export const UserRoleManagementConsole: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>(MOCK_USERS);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/v1/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              const updatedPermissions =
                newRole === 'ROLE_ADMIN'
                  ? ['READ_MEDIA', 'UPLOAD_MEDIA', 'RUN_INFERENCE', 'EXPORT_REPORT', 'MANAGE_USERS', 'VIEW_AUDIT_LOGS']
                  : newRole === 'ROLE_RESEARCHER'
                  ? ['READ_MEDIA', 'UPLOAD_MEDIA', 'RUN_INFERENCE', 'EXPORT_REPORT']
                  : ['READ_MEDIA'];
              return { ...u, role: newRole, permissions: updatedPermissions };
            }
            return u;
          })
        );
        setFeedbackMessage(`Updated user authority role to ${newRole}.`);
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const toggleMfaEnforced = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, mfaEnabled: !u.mfaEnabled } : u))
    );
    setFeedbackMessage(`Updated MFA enforcement status.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              User Role Provisioning & RBAC Governance Console
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              SPRING SECURITY ROLE GOVERNANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Administrative management of user authorities, MFA enforcement, granted granular permission scopes, and active JWT session revocations.
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-slate-950 rounded-xl border border-white/10">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900 border-b border-white/10 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Principal Identity</th>
              <th className="p-3.5">Granted Role</th>
              <th className="p-3.5">Permission Scopes</th>
              <th className="p-3.5">MFA Enforcement</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-[10px]">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{user.name}</span>
                      <span className="text-[10px] text-slate-500">{user.email}</span>
                    </div>
                  </div>
                </td>

                <td className="p-3.5">
                  <select
                    value={user.role}
                    disabled={updatingUserId === user.id}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    id={`role-select-${user.id}`}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-bold focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                    <option value="ROLE_RESEARCHER">ROLE_RESEARCHER</option>
                    <option value="ROLE_ANONYMOUS">ROLE_ANONYMOUS</option>
                  </select>
                </td>

                <td className="p-3.5 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-white/5"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3.5">
                  <button
                    onClick={() => toggleMfaEnforced(user.id)}
                    id={`toggle-mfa-${user.id}`}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                      user.mfaEnabled
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {user.mfaEnabled ? 'MFA ACTIVE' : 'MFA DISABLED'}
                  </button>
                </td>

                <td className="p-3.5 text-right">
                  <button
                    onClick={() => {
                      setFeedbackMessage(`Revoked all active JWT sessions for ${user.email}.`);
                      setTimeout(() => setFeedbackMessage(null), 3000);
                    }}
                    id={`revoke-session-${user.id}`}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-white/10 hover:border-rose-400 text-rose-400 hover:text-rose-300 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Revoke JWT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
