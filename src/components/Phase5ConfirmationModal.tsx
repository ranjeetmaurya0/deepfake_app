import React from 'react';
import { Shield, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface Phase5ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Phase5ConfirmationModal: React.FC<Phase5ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c1224] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative">
        <button
          onClick={onClose}
          id="close-phase5-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Phase 5 Complete: Authentication & Security</h3>
            <p className="text-xs font-mono text-purple-300">Ready to proceed to Phase 6: AI Pipeline Integration</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 space-y-2 mb-6">
          <p className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Delivered in Phase 5:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Spring Security 6 stateless JWT authentication & refresh token rotation.</li>
            <li>Role-Based Access Control (RBAC) matrix for ROLE_ANONYMOUS, ROLE_RESEARCHER, and ROLE_ADMIN.</li>
            <li>Decoded JWT claims inspector (Header, Payload, HMAC-SHA256 signature).</li>
            <li>Live endpoint guard test playground with 200 OK & 403 Forbidden evaluation.</li>
            <li>Production SecurityConfig.java, JwtAuthenticationFilter.java, & JwtTokenProvider.java Java files.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 mb-6">
          <h4 className="text-xs font-mono font-bold text-cyan-200 flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-cyan-400" />
            Phase 6 Scope Overview (AI Model Pipeline Integration):
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct integration with ResNet-50 spatial high-pass filter, Capsule Network dynamic routing, and Bi-LSTM temporal sequence scoring engine with Gemini 2.5 Flash explainability.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            id="modal-phase5-cancel-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Review Phase 5
          </button>
          <button
            onClick={onConfirm}
            id="modal-phase5-confirm-btn"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Proceed to Phase 6</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
