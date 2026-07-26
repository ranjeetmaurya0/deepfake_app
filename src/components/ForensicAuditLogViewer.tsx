import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, ShieldCheck, ShieldAlert, Filter, RefreshCw, Terminal } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  principal: string;
  role: string;
  action: string;
  targetMedia: string;
  clientIp: string;
  status: string;
}

export const ForensicAuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([
    { id: 'log-9001', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), principal: 'dr.maurya@deepfake.org', role: 'ROLE_ADMIN', action: 'EXPERT_REPORT_EXPORTED', targetMedia: 'celebdf_manipulated_interview_042.mp4', clientIp: '192.168.1.104', status: 'SUCCESS' },
    { id: 'log-9002', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), principal: 'dr.maurya@deepfake.org', role: 'ROLE_ADMIN', action: 'TRITON_GPU_BATCH_INFERENCE', targetMedia: 'vid-30frame-sequence-001', clientIp: '192.168.1.104', status: 'SUCCESS' },
    { id: 'log-9003', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), principal: 'a.patel@research.edu', role: 'ROLE_RESEARCHER', action: 'JWT_TOKEN_ISSUED', targetMedia: 'AUTH_SERVICE', clientIp: '10.0.4.12', status: 'SUCCESS' },
    { id: 'log-9004', timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(), principal: 'anonymous_user', role: 'ROLE_ANONYMOUS', action: 'ACCESS_DENIED_DELETE_MEDIA', targetMedia: '/api/v1/media/usr-001', clientIp: '172.16.8.99', status: '403_FORBIDDEN' },
    { id: 'log-9005', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), principal: 's.kumar@defense.gov', role: 'ROLE_ADMIN', action: 'ROLE_PROMOTION', targetMedia: 'USER:usr-883921 -> ROLE_ADMIN', clientIp: '192.168.1.108', status: 'SUCCESS' }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchAuditLogs = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetMedia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.clientIp.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'SUCCESS'
        ? log.status === 'SUCCESS'
        : log.status.includes('403') || log.status.includes('DENIED');

    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Principal,Role,Action,TargetMedia,ClientIP,Status\n';
    const rows = filteredLogs
      .map((l) => `"${l.id}","${l.timestamp}","${l.principal}","${l.role}","${l.action}","${l.targetMedia}","${l.clientIp}","${l.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic_audit_log_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Immutable Digital Forensic Audit Trail Explorer
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              CHAIN OF CUSTODY AUDIT LOGS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident system activity ledger recording cryptographic verification requests, JWT authorizations, Triton GPU batch dispatches, and access violations.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          id="export-audit-csv-btn"
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search principal, IP, action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cyan-300 cursor-pointer"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="403_FORBIDDEN">SECURITY VIOLATIONS (403)</option>
            </select>
          </div>

          <button
            onClick={fetchAuditLogs}
            disabled={isRefreshing}
            id="refresh-audit-logs-btn"
            className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:text-white text-slate-400 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto bg-slate-950 rounded-xl border border-white/10">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900 border-b border-white/10 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Log ID / Timestamp</th>
              <th className="p-3.5">Principal & Role</th>
              <th className="p-3.5">Action Event</th>
              <th className="p-3.5">Target Resource</th>
              <th className="p-3.5">Client IP</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3.5">
                  <span className="text-cyan-300 font-bold block">{log.id}</span>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                </td>

                <td className="p-3.5">
                  <span className="text-white font-bold block">{log.principal}</span>
                  <span className="text-[10px] text-purple-300">{log.role}</span>
                </td>

                <td className="p-3.5">
                  <span className="font-bold text-slate-200">{log.action}</span>
                </td>

                <td className="p-3.5 max-w-xs truncate text-slate-400">
                  {log.targetMedia}
                </td>

                <td className="p-3.5 text-slate-400">
                  {log.clientIp}
                </td>

                <td className="p-3.5 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUCCESS'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
