import React from 'react';
import { Layout, Shield, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface Phase4ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Phase4ConfirmationModal: React.FC<Phase4ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1224] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
        <button
          onClick={onClose}
          id="close-phase4-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Phase 4 Complete: Frontend Platform</h3>
            <p className="text-xs font-mono text-cyan-300">Ready to proceed to Phase 5: Authentication & Authz</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 mb-6">
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Delivered in Phase 4:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Live Deepfake Media Forensic Inspector with frame slider & bounding box overlay.</li>
            <li>Grad-CAM explainable heatmap visualizer & sub-model score breakdown.</li>
            <li>Research Publications & Literature Repository showcase (IJRPR 2025 Paper).</li>
            <li>Deepfake benchmark comparison gallery (FaceForensics++, DFDC, Celeb-DF).</li>
            <li>Research collaboration & enterprise contact form API integration.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 mb-6">
          <h4 className="text-xs font-mono font-bold text-purple-200 flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-purple-400" />
            Phase 5 Scope Overview (Auth & Role-Based Security):
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Spring Security JWT login / refresh flow, RBAC permissions matrix (ROLE_RESEARCHER, ROLE_ADMIN, ROLE_ANONYMOUS), route guards, token revocation, and user session management.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            id="modal-phase4-cancel-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Review Phase 4
          </button>
          <button
            onClick={onConfirm}
            id="modal-phase4-confirm-btn"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Proceed to Phase 5</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
