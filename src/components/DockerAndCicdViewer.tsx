import React, { useState } from 'react';
import { DOCKER_CICD_DATA, DockerAndCicdConfig } from '../data/cloudDeploymentData';
import { Terminal, Copy, Check, Play, RefreshCw, CheckCircle2, ShieldCheck, GitBranch } from 'lucide-react';

export const DockerAndCicdViewer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isBuildingPipeline, setIsBuildingPipeline] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const activeConfig: DockerAndCicdConfig = DOCKER_CICD_DATA[selectedIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeConfig.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunPipelineSimulation = async () => {
    setIsBuildingPipeline(true);
    setActiveStep(0);
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(1);
    await new Promise((r) => setTimeout(r, 700));
    setActiveStep(2);
    await new Promise((r) => setTimeout(r, 800));
    setActiveStep(3);
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(4);
    setIsBuildingPipeline(false);
  };

  const pipelineSteps = [
    { title: '1. Checkout Repository', detail: 'actions/checkout@v4' },
    { title: '2. Setup JDK 21 & Maven Cache', detail: 'actions/setup-java@v4' },
    { title: '3. SonarQube SAST Security Scan', detail: 'SonarSource/sonarqube-scan-action' },
    { title: '4. Multi-Stage OCI Docker Build', detail: 'asia-southeast1-docker.pkg.dev' },
    { title: '5. Zero-Downtime Cloud Run Deploy', detail: 'gcloud run deploy v2' }
  ];

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Multi-Stage OCI Dockerfile & GitHub Actions CI/CD Pipeline
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              CI/CD AUTOMATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production container build pipeline featuring Maven JDK 21 compilation, SonarQube security SAST scans, and automated GCP Artifact Registry publishing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunPipelineSimulation}
            disabled={isBuildingPipeline}
            id="run-cicd-simulation-btn"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 hover:text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            {isBuildingPipeline ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Play className="w-4 h-4 text-slate-950" />
            )}
            <span>{isBuildingPipeline ? 'Executing CI/CD Jobs...' : 'Simulate GitHub Actions Run'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            id="copy-cicd-code-btn"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy Config'}</span>
          </button>
        </div>
      </div>

      {/* Interactive CI/CD Progress Tracker Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 block uppercase tracking-wider">
          GitHub Actions Workflow Simulation Execution
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs">
          {pipelineSteps.map((step, idx) => {
            const isDone = activeStep > idx || (activeStep === 4 && !isBuildingPipeline);
            const isCurrent = activeStep === idx && isBuildingPipeline;

            return (
              <div
                key={step.title}
                className={`p-3 rounded-lg border transition-all ${
                  isDone
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 animate-pulse'
                    : 'bg-slate-900 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-[11px]">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block shrink-0" />
                  )}
                  <span className="truncate">{step.title}</span>
                </div>
                <p className="text-[9px] text-slate-400 truncate">{step.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Selection */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Configuration Templates ({DOCKER_CICD_DATA.length})
          </span>

          <div className="space-y-2">
            {DOCKER_CICD_DATA.map((cfg, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cfg.id}
                  onClick={() => setSelectedIndex(idx)}
                  id={`select-cicd-cfg-${idx}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white">{cfg.title}</span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {cfg.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{cfg.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
              <span className="text-cyan-300 font-bold">{activeConfig.filename}</span>
              <span className="text-slate-500">{activeConfig.type} Spec</span>
            </div>

            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-purple-200 overflow-x-auto max-h-[380px] leading-relaxed">
              <code>{activeConfig.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
