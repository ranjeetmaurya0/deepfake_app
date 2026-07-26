import React from 'react';
import { Database, Server, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface Phase2ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Phase2ConfirmationModal: React.FC<Phase2ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1224] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
        <button
          onClick={onClose}
          id="close-phase2-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Phase 2 Complete: Database Design</h3>
            <p className="text-xs font-mono text-cyan-300">Ready to proceed to Phase 3: Backend Services</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 mb-6">
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Designed in Phase 2:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Full relational schema for 12 core entity tables.</li>
            <li>Users, Roles (RBAC), Projects, Research Papers & Presentations.</li>
            <li>Media Gallery (Images/Videos) with SHA256 deduplication.</li>
            <li>AI Predictions, per-frame Grad-CAM heatmaps, and audit logs.</li>
            <li>Exportable PostgreSQL DDL migration script with indexing strategies.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 mb-6">
          <h4 className="text-xs font-mono font-bold text-purple-200 flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-purple-400" />
            Phase 3 Scope Overview (Backend Services):
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Spring Boot 3 / Express REST controllers, Spring Data JPA entities, OpenAPI / Swagger documentation, async job orchestrator, and media upload controllers.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            id="modal-phase2-cancel-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Review Phase 2 Further
          </button>
          <button
            onClick={onConfirm}
            id="modal-phase2-confirm-btn"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Proceed to Phase 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
