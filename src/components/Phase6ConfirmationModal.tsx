import React from 'react';
import { Cpu, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface Phase6ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Phase6ConfirmationModal: React.FC<Phase6ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1224] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
        <button
          onClick={onClose}
          id="close-phase6-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Phase 6 Complete: AI Pipeline Integration</h3>
            <p className="text-xs font-mono text-cyan-300">Ready to proceed to Phase 7: Admin Dashboard & Analytics</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 mb-6">
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Delivered in Phase 6:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Interactive 30-frame AI pipeline tensor simulator with ResNet-50, CapsNet, & Bi-LSTM dynamics.</li>
            <li>Gemini 2.5 Flash digital forensic explainability report generator for court proceedings.</li>
            <li>PyTorch 2.2 model layer specifications, tensor I/O shapes, and GFLOPs compute metrics.</li>
            <li>Triton GPU inference batch dispatcher with Kafka asynchronous result streams.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 mb-6">
          <h4 className="text-xs font-mono font-bold text-purple-200 flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-purple-400" />
            Phase 7 Scope Overview (Admin Dashboard & Platform Analytics):
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Administrative governance portal, user role provisioning, system resource monitoring (NVIDIA GPU utilization, Kafka consumer lag, PostgreSQL connection pool), and forensic audit logs.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            id="modal-phase6-cancel-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Review Phase 6
          </button>
          <button
            onClick={onConfirm}
            id="modal-phase6-confirm-btn"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 hover:text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Proceed to Phase 7</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
