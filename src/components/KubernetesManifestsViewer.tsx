import React, { useState } from 'react';
import { K8S_MANIFESTS_DATA, K8sManifest } from '../data/cloudDeploymentData';
import { Layers, Copy, Check, Terminal, Play, RefreshCw, FileText } from 'lucide-react';

export const KubernetesManifestsViewer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [applyOutput, setApplyOutput] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const activeManifest: K8sManifest = K8S_MANIFESTS_DATA[selectedIndex];

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(activeManifest.yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKubectlApply = async () => {
    setIsApplying(true);
    setApplyOutput(null);
    await new Promise((r) => setTimeout(r, 600));
    setApplyOutput(`$ kubectl apply -f ${activeManifest.filename.split(' ')[0]} -n forensics-production
${activeManifest.resourceType.toLowerCase()}.apps/${activeManifest.filename.split(' ')[0].replace('.yaml', '')} configured
namespace/forensics-production unchanged
deployment.apps/deepfake-forensics-api status: 4/4 pods ready (NVIDIA T4 GPU sidecars attached)
`.trim());
    setIsApplying(false);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Kubernetes (GKE) Production Manifests & Autoscalers
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              GKE KUBERNETES 1.28
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production-grade GKE YAML manifests defining pod specs, NVIDIA T4 GPU resource requests, Horizontal Pod Autoscaling (HPA), and Managed Certificate Ingress.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleKubectlApply}
            disabled={isApplying}
            id="run-kubectl-apply-btn"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
          >
            {isApplying ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
            <span>{isApplying ? 'Applying manifest...' : 'Simulate kubectl apply'}</span>
          </button>

          <button
            onClick={handleCopyYaml}
            id="copy-k8s-yaml-btn"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            <span>{copied ? 'Copied!' : 'Copy YAML'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Manifest Selection */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Kubernetes Manifests ({K8S_MANIFESTS_DATA.length})
          </span>

          <div className="space-y-2">
            {K8S_MANIFESTS_DATA.map((manifest, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={manifest.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setApplyOutput(null);
                  }}
                  id={`select-k8s-manifest-${idx}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white">{manifest.filename}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                      {manifest.resourceType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{manifest.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: YAML Code & Kubectl Output */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
              <span className="text-purple-300 font-bold">{activeManifest.filename}</span>
              <span className="text-slate-500">Kind: {activeManifest.resourceType}</span>
            </div>

            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-purple-200 overflow-x-auto max-h-[380px] leading-relaxed">
              <code>{activeManifest.yamlContent}</code>
            </pre>

            {applyOutput && (
              <div className="space-y-2 animate-fade-in border-t border-white/10 pt-3">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Kubectl Command Execution Output:
                </span>
                <pre className="bg-slate-900 p-3 rounded-lg border border-cyan-500/30 font-mono text-[10px] text-cyan-300 overflow-x-auto whitespace-pre-wrap max-h-[160px]">
                  <code>{applyOutput}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
