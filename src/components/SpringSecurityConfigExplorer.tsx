import React, { useState } from 'react';
import { SPRING_SECURITY_CODE_FILES } from '../data/authData';
import { Code, Copy, Check, Shield, FileCode, CheckCircle2 } from 'lucide-react';

export const SpringSecurityConfigExplorer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(SPRING_SECURITY_CODE_FILES[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = SPRING_SECURITY_CODE_FILES.find((f) => f.id === selectedFileId) || SPRING_SECURITY_CODE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Spring Security 6 Java Infrastructure Codebase
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              SPRING BOOT 3.2 + JWT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production Java Spring Security 6 filter chain, Stateless session policy, and HMAC-SHA256 token verification logic.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          id="copy-spring-security-code-btn"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
          <span>{copied ? 'Copied Java Class!' : 'Copy Code Snippet'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: File Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Security Classes ({SPRING_SECURITY_CODE_FILES.length})
          </span>

          <div className="space-y-2">
            {SPRING_SECURITY_CODE_FILES.map((file) => {
              const isSelected = file.id === activeFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  id={`security-file-tab-${file.id}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-xs font-bold font-mono text-white">{file.fileName}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate pl-6">{file.packageName}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Java Code Reader */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
              <span className="text-slate-400 font-bold">{activeFile.packageName}.{activeFile.fileName}</span>
              <span className="text-purple-300 bg-purple-950 px-2 py-0.5 rounded text-[10px]">Java 21 / Spring Security 6</span>
            </div>

            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-purple-200 overflow-x-auto max-h-[480px]">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
