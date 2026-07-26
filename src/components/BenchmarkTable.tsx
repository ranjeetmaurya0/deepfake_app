import React from 'react';
import { RESEARCH_BENCHMARKS } from '../data/architectureData';
import { BarChart3, Award, FileText, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export const BenchmarkTable: React.FC = () => {
  return (
    <div className="bg-[#0c1224] rounded-2xl border border-white/10 p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Research Findings & Dataset Benchmarks
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in FaceForensics++ (ICCV 2019), DFDC (2020), Celeb-DF (CVPR 2020), and Maurya et al. (IJRPR 2025).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Top Accuracy: 99.26%
          </span>
          <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Generalization Target: Celeb-DF 78.38%
          </span>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono text-slate-400 uppercase tracking-wider bg-slate-900/60">
              <th className="py-3 px-4 rounded-tl-xl">Dataset & Quality</th>
              <th className="py-3 px-4">Manipulation Categories</th>
              <th className="py-3 px-4 text-center">Accuracy</th>
              <th className="py-3 px-4 text-center">AUC Score</th>
              <th className="py-3 px-4 text-center">EER Rate</th>
              <th className="py-3 px-4">Scale / Sample Size</th>
              <th className="py-3 px-4 rounded-tr-xl">Primary Citation</th>
            </tr>
          </thead>
          <tbody className="divide-y border-b border-white/10 divide-white/5 text-xs">
            {RESEARCH_BENCHMARKS.map((b, i) => (
              <tr key={i} className="hover:bg-slate-800/40 transition-colors font-mono">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      b.compression === 'Raw'
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : b.compression.includes('HQ')
                        ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                        : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                    }`}
                  />
                  {b.dataset}
                </td>
                <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{b.manipulationType}</td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded font-bold ${
                      b.accuracy > 95
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : b.accuracy > 85
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {b.accuracy.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center text-cyan-300 font-bold">{b.aucScore}</td>
                <td className="py-3.5 px-4 text-center text-slate-400">{b.eer}%</td>
                <td className="py-3.5 px-4 text-slate-400">{b.sampleCount}</td>
                <td className="py-3.5 px-4 text-purple-300 font-semibold">{b.referencePaper}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Model Family Trade-off Matrix */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          Architectural Trade-Off Comparison (Literature vs. Triple-Hybrid)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">2D Spatial CNNs (Xception)</span>
            <div className="mt-2 text-xs text-slate-300 space-y-1">
              <p className="text-emerald-400 font-semibold">✓ High frame spatial fidelity</p>
              <p className="text-red-400">✗ Low temporal awareness; overfits compression artifacts</p>
              <p className="text-slate-400 text-[11px] font-mono mt-2">Cost: Low-Medium • Params: ~22M</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Capsule Networks (CapsNet)</span>
            <div className="mt-2 text-xs text-slate-300 space-y-1">
              <p className="text-emerald-400 font-semibold">✓ Preserves 3D pose & spatial geometry</p>
              <p className="text-amber-400">! Dynamic routing requires careful optimization</p>
              <p className="text-slate-400 text-[11px] font-mono mt-2">Cost: Medium-High • Params: ~14M</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">CNN + LSTM Hybrids</span>
            <div className="mt-2 text-xs text-slate-300 space-y-1">
              <p className="text-emerald-400 font-semibold">✓ Captures frame-to-frame motion jitter</p>
              <p className="text-amber-400">! Sequential processing limits GPU batching</p>
              <p className="text-slate-400 text-[11px] font-mono mt-2">Cost: Medium-High • Params: ~28M</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-b from-purple-950/60 to-cyan-950/60 border border-cyan-400/50 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Triple-Hybrid (This Work)</span>
            <div className="mt-2 text-xs text-slate-200 space-y-1">
              <p className="text-emerald-300 font-semibold">✓ Spatial + Structural + Temporal balance</p>
              <p className="text-cyan-300">✓ Robust against compression & cross-dataset shifts</p>
              <p className="text-slate-300 text-[11px] font-mono mt-2">Cost: Optimized Triton • Params: ~29.5M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
