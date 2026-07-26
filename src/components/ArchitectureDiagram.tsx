import React, { useState } from 'react';
import { SYSTEM_NODES } from '../data/architectureData';
import { ArchitectureNode } from '../types';
import { Cpu, ArrowRight, Code, Activity, ShieldAlert, Zap, Box, Eye, Layers, Terminal } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(SYSTEM_NODES[0]);

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Glow background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              TRIPLE-HYBRID MODEL PIPELINE
            </span>
            <span className="text-xs font-mono text-slate-400">Total Latency: ~380ms / clip</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            System Architecture & Tensor Flow
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Click any processing stage to inspect tensor dimensions, mathematical formulas, PyTorch code, and failure mode mitigations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/10">
          <Box className="w-4 h-4 text-cyan-400" />
          <span>Batch Input Shape:</span>
          <span className="text-cyan-300 font-bold">(B, 5, 3, 224, 224)</span>
        </div>
      </div>

      {/* Interactive Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-8">
        {SYSTEM_NODES.map((node, index) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <div key={node.id} className="relative group">
              <button
                onClick={() => setSelectedNode(node)}
                id={`arch-node-${node.stageNumber}`}
                className={`w-full h-full text-left p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-900/60 to-cyan-950/80 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.02]'
                    : 'bg-slate-900/50 border-white/10 hover:border-purple-500/50 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      0{node.stageNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{node.latencyAvg}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white leading-tight mb-1">{node.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{node.subtitle}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <span className="truncate">{node.category}</span>
                  <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1 text-cyan-400' : 'text-slate-600'}`} />
                </div>
              </button>

              {/* Connecting line for desktop */}
              {index < SYSTEM_NODES.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_8px_#06b6d4]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Detailed Inspector */}
      <div className="bg-slate-950/80 rounded-xl border border-cyan-500/30 p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold">
                STAGE 0{selectedNode.stageNumber} • {selectedNode.category.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">Parameters: {selectedNode.parameters}</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
              {selectedNode.title}
              <span className="text-sm font-normal text-slate-400">({selectedNode.subtitle})</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 font-mono text-xs text-slate-300">
              <span className="text-slate-500 mr-2">In:</span>
              <span className="text-purple-300">{selectedNode.inputTensor}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 font-mono text-xs text-slate-300">
              <span className="text-slate-500 mr-2">Out:</span>
              <span className="text-cyan-300 font-bold">{selectedNode.outputTensor}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Specs & Mathematical Formulation */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Functional Specification & Operation
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/5">
                {selectedNode.description}
              </p>
            </div>

            {selectedNode.mathematicalFormula && (
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Mathematical Formulation / Core Equation
                </h4>
                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl font-mono text-sm text-purple-200 text-center shadow-inner">
                  {selectedNode.mathematicalFormula}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                Failure Modes Mitigated by this Stage
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedNode.failureModesMitigated.map((fail, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono"
                  >
                    ✓ {fail}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Core Technologies & Frameworks
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedNode.keyTech.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-xs font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Code Snippet */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-t-xl border border-white/10 border-b-0">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                PyTorch Architecture Snippet
              </span>
              <span className="text-[10px] font-mono text-slate-500">Python 3.11</span>
            </div>
            <pre className="bg-[#050914] p-4 rounded-b-xl border border-white/10 overflow-x-auto font-mono text-xs text-cyan-200/90 leading-relaxed flex-1 max-h-[340px]">
              <code>{selectedNode.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
