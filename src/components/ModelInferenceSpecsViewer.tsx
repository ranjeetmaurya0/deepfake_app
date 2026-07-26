import React, { useState } from 'react';
import { MODEL_SPECS_DATA, ModelLayerSpec } from '../data/aiPipelineData';
import { Code, Copy, Check, Cpu, Layers, Sliders, Activity, Terminal, FileCode } from 'lucide-react';

export const ModelInferenceSpecsViewer: React.FC = () => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeSpec: ModelLayerSpec = MODEL_SPECS_DATA[selectedLayerIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSpec.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              PyTorch AI Model Architecture & ONNX Inference Specs
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              PYTORCH 2.2 + ONNX RUNTIME
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production deep neural network architecture specifications, tensor input/output shapes, activation functions, and FLOPs compute load.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          id="copy-model-code-btn"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
          <span>{copied ? 'Code Copied!' : 'Copy PyTorch Code'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Layer Selection */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Model Modules ({MODEL_SPECS_DATA.length})
          </span>

          <div className="space-y-2">
            {MODEL_SPECS_DATA.map((spec, idx) => {
              const isSelected = idx === selectedLayerIndex;
              return (
                <button
                  key={spec.layerName}
                  onClick={() => setSelectedLayerIndex(idx)}
                  id={`select-model-spec-${idx}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-xs font-bold font-mono text-white">{spec.moduleType}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate pl-6">{spec.layerName}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code & Specs Inspector */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
              <span className="text-purple-300 font-bold">{activeSpec.moduleType} ({activeSpec.layerName})</span>
              <span className="text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded text-[10px]">FLOPs: {activeSpec.flopsGiga} GFLOPs</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-500 block text-[10px]">Input Tensor</span>
                <span className="text-white font-bold">{activeSpec.inputShape}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-500 block text-[10px]">Output Tensor</span>
                <span className="text-cyan-300 font-bold">{activeSpec.outputShape}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-500 block text-[10px]">Parameters</span>
                <span className="text-purple-300 font-bold">{activeSpec.parameters}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-500 block text-[10px]">Activation</span>
                <span className="text-emerald-300 font-bold">{activeSpec.activation}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {activeSpec.description}
            </p>

            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-purple-200 overflow-x-auto max-h-[360px]">
              <code>{activeSpec.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
