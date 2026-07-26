import React from 'react';
import { Award, CheckCircle2, Sparkles, X, Trophy } from 'lucide-react';

interface Phase10ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Phase10ConfirmationModal: React.FC<Phase10ConfirmationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1224] border border-emerald-500/50 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_60px_rgba(16,185,129,0.3)] relative">
        <button
          onClick={onClose}
          id="close-phase10-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Full Enterprise System Sign-Off Complete!</h3>
            <p className="text-xs font-mono text-emerald-300">Phase 10: Production Optimization, Edge Caching & Handoff</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 mb-6">
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> All 10 Engineering Phases Completed:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Phase 1: Microservices & Neural Tensor Architecture</li>
            <li>Phase 2: PostgreSQL Schema, Indexes & DDL Export</li>
            <li>Phase 3: Spring Boot 3 Backend & OpenAPI Documentation</li>
            <li>Phase 4: React 18 Forensic Dashboard & GradCAM Heatmaps</li>
            <li>Phase 5: JWT RS256 Authentication & Spring Security RBAC</li>
            <li>Phase 6: AI Pipeline & Server-Side Gemini 1.5 Pro Reports</li>
            <li>Phase 7: Admin Infrastructure Telemetry & Audit Ledgers</li>
            <li>Phase 8: GCP Terraform IaC, Kubernetes GKE & CI/CD</li>
            <li>Phase 9: JUnit 5, RestAssured, OWASP & Chaos Resilience</li>
            <li>Phase 10: CDN Edge Caching, SLA Telemetry & Handoff Export</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 mb-6">
          <h4 className="text-xs font-mono font-bold text-purple-200 flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Live System Handoff Ready
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The deepfake forensic analysis platform is fully optimized, battle-tested, secure, and ready for live production operations.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            id="modal-phase10-close-btn"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Close & Explore Live Platform
          </button>
        </div>
      </div>
    </div>
  );
};
