import React, { useState } from 'react';
import { RBAC_PERMISSIONS_MATRIX } from '../data/authData';
import { AuthUser, RbacPermission, UserRole } from '../types';
import { Shield, Lock, Check, X, Play, Terminal, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RbacMatrixViewerProps {
  activeUser: AuthUser;
}

export const RbacMatrixViewer: React.FC<RbacMatrixViewerProps> = ({ activeUser }) => {
  const [selectedPermission, setSelectedPermission] = useState<RbacPermission>(RBAC_PERMISSIONS_MATRIX[2]);
  const [testResult, setTestResult] = useState<{
    status: number;
    statusText: string;
    allowed: boolean;
    reason: string;
    timestamp: string;
  } | null>(null);

  const [isTesting, setIsTesting] = useState<boolean>(false);

  const handleTestEndpointAccess = async (perm: RbacPermission) => {
    setIsTesting(true);
    setSelectedPermission(perm);

    await new Promise((r) => setTimeout(r, 400));

    const isRoleAllowed = perm.allowedRoles.includes(activeUser.role);

    if (isRoleAllowed) {
      setTestResult({
        status: 200,
        statusText: '200 OK - Access Granted',
        allowed: true,
        reason: `Authenticated as ${activeUser.role}. Principal passed Spring Security SecurityFilterChain matched requestMatchers("${perm.endpointPath}").`,
        timestamp: new Date().toISOString()
      });
    } else {
      setTestResult({
        status: 403,
        statusText: '403 FORBIDDEN - Access Denied',
        allowed: false,
        reason: `Access Denied: Principal role '${activeUser.role}' lacks required authority. Allowed roles: [${perm.allowedRoles.join(', ')}].`,
        timestamp: new Date().toISOString()
      });
    }

    setIsTesting(false);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Role-Based Access Control (RBAC) Permissions Matrix
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              SPRING SECURITY AUTHORIZATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Declarative security authorization matrix enforcing granular access controls across Anonymous, Researcher, and Administrator roles.
          </p>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10 font-mono text-xs flex items-center gap-3">
          <span className="text-slate-400">Current Role:</span>
          <span className={`font-bold px-2.5 py-0.5 rounded ${
            activeUser.role === 'ROLE_ADMIN'
              ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
              : activeUser.role === 'ROLE_RESEARCHER'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-600'
          }`}>
            {activeUser.role}
          </span>
        </div>
      </div>

      {/* Permissions Table Matrix */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900 border-b border-white/10 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">HTTP / Endpoint</th>
              <th className="p-3">Summary</th>
              <th className="p-3 text-center">ROLE_ANONYMOUS</th>
              <th className="p-3 text-center">ROLE_RESEARCHER</th>
              <th className="p-3 text-center">ROLE_ADMIN</th>
              <th className="p-3 text-right">Test Guard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {RBAC_PERMISSIONS_MATRIX.map((perm) => {
              const isSelected = selectedPermission.permissionId === perm.permissionId;
              const isAnonymousAllowed = perm.allowedRoles.includes('ROLE_ANONYMOUS');
              const isResearcherAllowed = perm.allowedRoles.includes('ROLE_RESEARCHER');
              const isAdminAllowed = perm.allowedRoles.includes('ROLE_ADMIN');

              return (
                <tr
                  key={perm.permissionId}
                  className={`transition-colors hover:bg-slate-900/50 ${
                    isSelected ? 'bg-cyan-950/30' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        perm.httpMethod === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                        perm.httpMethod === 'POST' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' :
                        'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}>
                        {perm.httpMethod}
                      </span>
                      <span className="text-white font-bold">{perm.endpointPath}</span>
                    </div>
                  </td>

                  <td className="p-3 text-slate-300">{perm.summary}</td>

                  {/* Role Indicators */}
                  <td className="p-3 text-center">
                    {isAnonymousAllowed ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500/40">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {isResearcherAllowed ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500/40">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {isAdminAllowed ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500/40">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleTestEndpointAccess(perm)}
                      id={`test-rbac-guard-${perm.permissionId}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-cyan-400" />
                      <span>Test Request</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live Request Guard Console */}
      {testResult && (
        <div className={`p-5 rounded-2xl border ${
          testResult.allowed
            ? 'bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
            : 'bg-gradient-to-r from-rose-950/80 via-slate-950 to-purple-950/80 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">Live Spring Security SecurityFilterChain Evaluator</span>
            </div>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
              testResult.allowed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400 border border-rose-500/40'
            }`}>
              {testResult.statusText}
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Requested Endpoint:</span> <span className="text-white font-bold">{selectedPermission.httpMethod} {selectedPermission.endpointPath}</span>
            </p>
            <p>
              <span className="text-slate-500">Evaluated Role:</span> <span className="text-cyan-300 font-bold">{activeUser.role}</span>
            </p>
            <p>
              <span className="text-slate-500">Result Details:</span> <span className={testResult.allowed ? 'text-emerald-300' : 'text-rose-300'}>{testResult.reason}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
