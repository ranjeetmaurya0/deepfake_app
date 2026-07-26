import React from 'react';
import { Cpu, ShieldCheck, Sparkles, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { AppPhase } from '../types';

interface HeaderProps {
  currentPhase: AppPhase;
  onProceedToPhase2: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPhase, onProceedToPhase2 }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#050a14]/90 backdrop-blur-xl border-b border-purple-500/20 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <div className="w-full h-full bg-[#0a0f1e] rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                DEEPFAKE FORENSICS PLATFORM
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                PROD-READY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ResNet-50 + CapsNet + LSTM • Triple-Hybrid Architecture
            </p>
          </div>
        </div>

        {/* Phase Indicator & Proceed CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-purple-500/30 text-xs font-mono text-purple-200">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">ACTIVE:</span>
            <span className="font-semibold text-white">{currentPhase}</span>
          </div>

          <button
            onClick={onProceedToPhase2}
            id="proceed-to-phase2-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Complete Phase 1 & Proceed to Phase 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
