import React, { useState } from 'react';
import { generatePostgreSQLDDL } from '../data/databaseData';
import { FileCode, Copy, Check, Download, Terminal, Database } from 'lucide-react';

export const SqlDdlExportViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const ddlSql = generatePostgreSQLDDL();

  const handleCopy = () => {
    navigator.clipboard.writeText(ddlSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([ddlSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'V1_0__deepfake_detection_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              PostgreSQL DDL Migration Script
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production ready DDL syntax compatible with PostgreSQL 15+, Cloud SQL, AWS RDS, and Flyway/Liquibase migrations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            id="copy-sql-ddl-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied DDL!' : 'Copy SQL Script'}</span>
          </button>

          <button
            onClick={handleDownload}
            id="download-sql-ddl-btn"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .sql File</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
          <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            db/migration/V1_0__deepfake_detection_schema.sql
          </span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30">
            PostgreSQL DDL • UUID-OSSP
          </span>
        </div>

        <pre className="bg-[#050914] p-5 font-mono text-xs text-cyan-200/90 leading-relaxed overflow-x-auto max-h-[500px] scrollbar-thin">
          <code>{ddlSql}</code>
        </pre>
      </div>
    </div>
  );
};
