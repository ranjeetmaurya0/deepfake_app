import React from 'react';
import { DATA_PIPELINE_STAGES } from '../data/architectureData';
import { Network, Server, HardDrive, Cpu, ArrowRight, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export const DataPipelineViewer: React.FC = () => {
  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Enterprise Ingestion & Data Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Decoupled CPU-bound decoding and GPU-bound inference architecture with Kafka messaging buffer.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/10">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Kafka Buffer</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center gap-1.5 bg-cyan-950/60 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>NVIDIA Triton FP16</span>
          </div>
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DATA_PIPELINE_STAGES.map((s) => (
          <div
            key={s.step}
            className="p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 transition-all group hover:bg-slate-800/40"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                0{s.step}
              </span>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-950/50 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                {s.hardwareTarget}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
              {s.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {s.transformDetails}
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Throughput Target:</span>
              <span className="text-emerald-400 font-semibold">{s.throughput}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Infrastructure Decoupling Specs Footer */}
      <div className="mt-8 p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <h4 className="text-xs font-mono font-bold text-purple-200">
              Stateful Persistence & Cold Storage Architecture
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Redis holds hot preprocessed tensors (24h TTL); PostgreSQL records strict immutable audit logs with SHA256 file hashes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded bg-slate-900 text-xs font-mono text-slate-300 border border-white/10">
            S3 Object Store (Videos/Heatmaps)
          </span>
          <span className="px-3 py-1 rounded bg-slate-900 text-xs font-mono text-cyan-300 border border-cyan-500/30">
            PostgreSQL Audit Tables
          </span>
        </div>
      </div>
    </div>
  );
};
