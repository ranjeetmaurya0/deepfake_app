import React from 'react';
import { DbTable } from '../types';
import { Table as TableIcon, Key, Link, ShieldCheck, Database, Layers, Check, X, FileCode } from 'lucide-react';

interface TableSchemaInspectorProps {
  table: DbTable;
}

export const TableSchemaInspector: React.FC<TableSchemaInspectorProps> = ({ table }) => {
  return (
    <div className="bg-[#0c1224] rounded-2xl border border-cyan-500/30 p-6 shadow-2xl relative">
      {/* Table Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <TableIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono text-white">{table.tableName}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-mono font-semibold">
                  {table.moduleGroup}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{table.displayName} • Estimated Scale: {table.estimatedRows} records</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-white/10">
          <div>
            <span className="text-slate-500 block text-[10px]">Columns:</span>
            <span className="text-cyan-300 font-bold">{table.columns.length}</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <span className="text-slate-500 block text-[10px]">Indexes:</span>
            <span className="text-purple-300 font-bold">{table.indexes.length}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-white/5 mb-6 leading-relaxed">
        {table.description}
      </p>

      {/* Columns Data Dictionary Table */}
      <div className="mb-8">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Data Dictionary & Field Specifications
        </h3>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-xs font-mono text-slate-400 uppercase border-b border-white/10">
                <th className="py-3 px-4">Column Name</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4 text-center">Key Type</th>
                <th className="py-3 px-4 text-center">Nullable</th>
                <th className="py-3 px-4 text-center">Unique</th>
                <th className="py-3 px-4">Default Value</th>
                <th className="py-3 px-4">Functional Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {table.columns.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    {col.isPrimary && <Key className="w-3.5 h-3.5 text-amber-400" />}
                    {col.isForeign && <Link className="w-3.5 h-3.5 text-cyan-400" />}
                    <span className={col.isPrimary ? 'text-amber-300' : col.isForeign ? 'text-cyan-300' : 'text-slate-200'}>
                      {col.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-semibold">{col.type}</td>
                  <td className="py-3 px-4 text-center">
                    {col.isPrimary ? (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px]">
                        PRIMARY
                      </span>
                    ) : col.isForeign ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                        FK → {col.references}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {col.isNullable ? (
                      <span className="text-slate-400">YES</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">NO</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {col.isUnique ? (
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px]">
                        UNIQUE
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{col.defaultValue || 'NULL'}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Indexing Strategy & Query Optimization */}
      <div>
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Database Index Strategy & Query Optimization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {table.indexes.map((idx, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-cyan-300">{idx.name}</span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px]">
                  {idx.type}
                </span>
              </div>
              <div className="text-slate-400 mb-1">
                Indexed Columns: <span className="text-white">({idx.columns.join(', ')})</span>
              </div>
              <div className="text-slate-300 text-[11px] font-sans">
                Purpose: {idx.purpose}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
