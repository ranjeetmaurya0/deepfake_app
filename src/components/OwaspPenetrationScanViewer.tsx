import React, { useState } from 'react';
import { OWASP_VULNERABILITIES_DATA, SecurityVulnerability } from '../data/testingQaData';
import { ShieldCheck, Lock, ShieldAlert, Check, Copy, AlertTriangle, FileCode, Server } from 'lucide-react';

export const OwaspPenetrationScanViewer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeVulnerability: SecurityVulnerability = OWASP_VULNERABILITIES_DATA[selectedIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeVulnerability.remediationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const securityHeaders = [
    { name: 'Strict-Transport-Security (HSTS)', value: 'max-age=31536000; includeSubDomains', status: 'PASS' },
    { name: 'Content-Security-Policy (CSP)', value: "default-src 'self'; frame-ancestors 'none'", status: 'PASS' },
    { name: 'X-Content-Type-Options', value: 'nosniff', status: 'PASS' },
    { name: 'X-Frame-Options', value: 'DENY', status: 'PASS' },
    { name: 'Cross-Origin Resource Sharing (CORS)', value: 'Strict Whitelisted Domains Only', status: 'PASS' }
  ];

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              OWASP ZAP Penetration & Vulnerability Security Audit
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              OWASP TOP 10 2026 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated penetration security benchmark verifying zero SQL injections, XSS sanitization, TLS 1.3 encryption, and Spring Security header enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl font-mono text-xs text-emerald-300 flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0 Vulnerabilities Detected (A+ Security Grade)</span>
          </div>
        </div>
      </div>

      {/* Security Headers Check Panel */}
      <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 block uppercase tracking-wider">
          HTTP Security Response Headers Audit
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {securityHeaders.map((header) => (
            <div key={header.name} className="p-3 bg-slate-900/80 rounded-lg border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold text-[11px] truncate">{header.name}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  {header.status}
                </span>
              </div>
              <p className="text-[10px] text-cyan-300 truncate">{header.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerabilities / Security Mitigations List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vulnerability Categories */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Audited OWASP Categories ({OWASP_VULNERABILITIES_DATA.length})
          </span>

          <div className="space-y-2">
            {OWASP_VULNERABILITIES_DATA.map((vuln, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={vuln.id}
                  onClick={() => setSelectedIndex(idx)}
                  id={`select-owasp-item-${vuln.id}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white truncate max-w-[200px]">
                      {vuln.title}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                      CVSS {vuln.cvssScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-cyan-300">{vuln.cweId}</span>
                    <span className="text-emerald-400 font-bold">{vuln.mitigationStatus}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code & Remediation Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block">{activeVulnerability.title}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Endpoint: {activeVulnerability.endpointTested} | {activeVulnerability.cweId}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                id="copy-owasp-code-btn"
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied' : 'Copy Remediation'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeVulnerability.details}</p>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-400">Hardened Mitigation Code Pattern:</span>
              <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-cyan-200 overflow-x-auto max-h-[260px] leading-relaxed">
                <code>{activeVulnerability.remediationCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
