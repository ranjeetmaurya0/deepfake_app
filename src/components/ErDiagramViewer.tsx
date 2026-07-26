import React, { useState } from 'react';
import { DATABASE_TABLES, DATABASE_RELATIONSHIPS } from '../data/databaseData';
import { DbTable } from '../types';
import { Database, Key, Link, ArrowRight, Layers, Table as TableIcon, Search, Shield, Filter } from 'lucide-react';

interface ErDiagramViewerProps {
  onSelectTable: (table: DbTable) => void;
  selectedTableId: string;
}

export const ErDiagramViewer: React.FC<ErDiagramViewerProps> = ({ onSelectTable, selectedTableId }) => {
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const MODULE_GROUPS = ['ALL', 'Core Auth', 'Media Management', 'Research & Papers', 'AI Inference & Forensics', 'Content & Communications'];

  const filteredTables = DATABASE_TABLES.filter((t) => {
    const matchesModule = filterModule === 'ALL' || t.moduleGroup === filterModule;
    const matchesSearch = t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) || t.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Entity-Relationship (ER) Visual Diagram
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            PostgreSQL relational architecture showing 12 production tables, primary keys, foreign keys, and indexes.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tables..."
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-white/10 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-purple-400 ml-1" />
            {MODULE_GROUPS.map((mod) => (
              <button
                key={mod}
                onClick={() => setFilterModule(mod)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                  filterModule === mod
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ER Diagram Grid of Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const relatedRels = DATABASE_RELATIONSHIPS.filter(
            (r) => r.fromTable === table.tableName || r.toTable === table.tableName
          );

          return (
            <div
              key={table.id}
              onClick={() => onSelectTable(table)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-950/70 via-slate-900 to-cyan-950/80 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-[1.02]'
                  : 'bg-slate-900/60 border-white/10 hover:border-purple-500/50 hover:bg-slate-800/60'
              }`}
            >
              <div>
                {/* Table Top Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-purple-400'}`} />
                    <span className="font-mono font-bold text-sm text-white">{table.tableName}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {table.moduleGroup}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                  {table.description}
                </p>

                {/* Column Previews (PK, FK, Type) */}
                <div className="space-y-1.5 font-mono text-xs mb-4 bg-slate-950/80 p-2.5 rounded-xl border border-white/5 max-h-36 overflow-y-auto">
                  {table.columns.slice(0, 5).map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 truncate">
                        {col.isPrimary ? (
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        ) : col.isForeign ? (
                          <Link className="w-3 h-3 text-cyan-400 shrink-0" />
                        ) : (
                          <span className="w-3 h-3 block rounded-full bg-slate-700 shrink-0" />
                        )}
                        <span className={`truncate ${col.isPrimary ? 'text-amber-300 font-bold' : col.isForeign ? 'text-cyan-300' : 'text-slate-300'}`}>
                          {col.name}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px] ml-2 shrink-0">{col.type}</span>
                    </div>
                  ))}
                  {table.columns.length > 5 && (
                    <div className="text-[10px] text-slate-500 text-center pt-1">
                      + {table.columns.length - 5} more columns...
                    </div>
                  )}
                </div>
              </div>

              {/* Table Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Estimated Rows: <strong className="text-emerald-400">{table.estimatedRows}</strong></span>
                <span className="text-cyan-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect Schema <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Relational Connectivity Summary */}
      <div className="bg-slate-950/80 rounded-xl border border-white/10 p-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Link className="w-4 h-4 text-cyan-400" />
          Active Foreign Key Foreign Relationships (1:N & Cascade Rules)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-xs">
          {DATABASE_RELATIONSHIPS.map((rel) => (
            <div key={rel.id} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 truncate">
                <span className="text-purple-300 font-bold">{rel.fromTable}</span>
                <span className="text-slate-500">.({rel.fromColumn})</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                {rel.type}
              </span>
              <div className="flex items-center gap-1.5 text-slate-300 truncate">
                <span className="text-cyan-300 font-bold">{rel.toTable}</span>
                <span className="text-slate-500">.({rel.toColumn})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
