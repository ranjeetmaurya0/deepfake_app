import React, { useState } from 'react';
import { SPRING_CODE_FILES } from '../data/backendData';
import { SpringCodeFile } from '../types';
import { FileCode, Copy, Check, Server, ShieldCheck, Database, Layers, Terminal } from 'lucide-react';

export const SpringCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SpringCodeFile>(SPRING_CODE_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Spring Boot 3 / Java 21 Enterprise Backend Source Code
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production Spring Boot code artifacts: Controllers (@RestController), Services (@Service), Spring Data JPA Entities (@Entity), and Security Filters.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          id="copy-spring-code-btn"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied File!' : 'Copy Java Source Code'}</span>
        </button>
      </div>

      {/* File Tab Selector */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none mb-6">
        {SPRING_CODE_FILES.map((file) => {
          const isSelected = selectedFile.id === file.id;
          return (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              id={`file-tab-${file.id}`}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{file.fileName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-purple-200">
                {file.layer}
              </span>
            </button>
          );
        })}
      </div>

      {/* Code Display Container */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-purple-300 font-bold">{selectedFile.packageName}</span>
            <span className="text-slate-500">/</span>
            <span className="text-white font-bold">{selectedFile.fileName}</span>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-500/30">
            {selectedFile.language}
          </span>
        </div>

        <pre className="bg-[#050914] p-5 font-mono text-xs text-purple-200/90 leading-relaxed overflow-x-auto max-h-[500px] scrollbar-thin">
          <code>{selectedFile.code}</code>
        </pre>
      </div>
    </div>
  );
};
