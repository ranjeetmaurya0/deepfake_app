import React from 'react';
import { CheckCircle2, Clock, Circle, ArrowRight, Shield, Database, Server, Layout, Lock, Cpu, BarChart3, Cloud, TestTube, Zap } from 'lucide-react';
import { AppPhase } from '../types';

interface PhaseRoadmapProps {
  currentPhase: AppPhase;
  onProceed: () => void;
}

const PHASES: { id: number; title: AppPhase; name: string; desc: string; icon: any }[] = [
  { id: 1, title: 'Phase 1: System Architecture', name: 'System Architecture', desc: 'Triple-hybrid ResNet + CapsNet + LSTM design, tensor flow, data pipeline specs', icon: Cpu },
  { id: 2, title: 'Phase 2: Database Design', name: 'Database Design', desc: 'PostgreSQL schema, ER diagrams, entity relationships, indexes, audit logs', icon: Database },
  { id: 3, title: 'Phase 3: Backend Services', name: 'Backend Services', desc: 'Spring Boot 3 / Express REST APIs, job orchestrator, OpenAPI Swagger', icon: Server },
  { id: 4, title: 'Phase 4: Frontend Platform', name: 'Frontend Platform', desc: 'React 19 + TypeScript glassmorphism UI, interactive charts, media gallery', icon: Layout },
  { id: 5, title: 'Phase 5: Authentication & Authorization', name: 'Auth & Security', desc: 'Spring Security / JWT, role-based access control (Admin, Researcher, Public)', icon: Lock },
  { id: 6, title: 'Phase 6: AI Pipeline Integration', name: 'AI Pipeline', desc: 'Video processing, frame extraction, Grad-CAM heatmap visualization, confidence scoring', icon: Zap },
  { id: 7, title: 'Phase 7: Admin Dashboard', name: 'Admin Dashboard', desc: 'Media upload management, user management, project papers, analytics', icon: BarChart3 },
  { id: 8, title: 'Phase 8: Deployment & Cloud Infra', name: 'Deployment', desc: 'Docker, Docker Compose, Kubernetes, NVIDIA Triton, GitHub Actions CI/CD', icon: Cloud },
  { id: 9, title: 'Phase 9: Testing & QA', name: 'Testing & QA', desc: 'Unit, integration, cross-dataset generalization tests, model calibration', icon: TestTube },
  { id: 10, title: 'Phase 10: Production Optimization', name: 'Production Optimization', desc: 'TensorRT FP16 quantization, dynamic batching, caching, security hardening', icon: Shield },
];

export const PhaseRoadmap: React.FC<PhaseRoadmapProps> = ({ currentPhase, onProceed }) => {
  return (
    <div className="bg-[#0c1224]/80 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Project Development Lifecycle (10 Phases)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Following strict phased methodology based on uploaded research and enterprise architecture requirements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1 rounded-lg">
            Current Stage: Phase 1 of 10
          </span>
          <button
            onClick={onProceed}
            id="phase-roadmap-proceed-btn"
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Approve Phase 1 & Launch Phase 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {PHASES.map((p) => {
          const Icon = p.icon;
          const isCurrent = p.title === currentPhase;
          const isPast = p.id < 1; // currently at Phase 1
          
          return (
            <div
              key={p.id}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-gradient-to-b from-purple-900/40 to-cyan-900/40 border-cyan-400/60 shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                  : isPast
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80'
                  : 'bg-slate-900/40 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950'
                      : isPast
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  PHASE {p.id}
                </span>
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-cyan-300' : 'text-slate-400'}`} />
                <h3 className="text-xs font-semibold text-white truncate">{p.name}</h3>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
