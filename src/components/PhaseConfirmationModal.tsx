import React from 'react';
import { Layers, Database, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface PhaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PhaseConfirmationModal: React.FC<PhaseConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1224] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
        <button
          onClick={onClose}
          id="close-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Phase 1 Complete: System Architecture</h3>
            <p className="text-xs font-mono text-cyan-300">Ready to proceed to Phase 2: Database Design</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 mb-6">
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Established in Phase 1:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Triple-hybrid ResNet-50 + Capsule Network + LSTM pipeline specs.</li>
            <li>Input tensor specs (B, 5, 3, 224, 224) & 1.3x face crop alignment.</li>
            <li>Async Kafka ingestion & Triton GPU server dynamic batching setup.</li>
            <li>Grad-CAM heatmap localization & calibrated multi-branch scoring.</li>
            <li>Literature benchmarks (FF++ Raw 99.26%, DFDC 96.85%, Celeb-DF 78.38%).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 mb-6">
          <h4 className="text-xs font-mono font-bold text-purple-200 flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-purple-400" />
            Phase 2 Scope Overview (Database Design):
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            PostgreSQL database schemas for Users, Roles, Projects, Research Papers, Presentations, Images, Videos, Predictions, Audit Logs, and Contact Messages with complete ER diagrams.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            id="modal-cancel-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Review Phase 1 Further
          </button>
          <button
            onClick={onConfirm}
            id="modal-confirm-btn"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Proceed to Phase 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
