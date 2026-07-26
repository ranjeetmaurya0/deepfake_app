import React, { useState } from 'react';
import { INSPECTION_SAMPLES } from '../data/architectureData';
import { InspectionSample } from '../types';
import { Eye, ShieldAlert, CheckCircle2, Flame, Layers, Sparkles, Sliders, Activity } from 'lucide-react';

export const GradCamInspector: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<InspectionSample>(INSPECTION_SAMPLES[0]);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(2);
  const [showGradCamOverlay, setShowGradCamOverlay] = useState<boolean>(true);
  const [heatIntensity, setHeatIntensity] = useState<number>(80);

  return (
    <div className="bg-[#0c1224] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">
              Explainable AI: Grad-CAM Heatmap Localization
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual verification showing exact facial regions (seams, landmarks, blendshape boundaries) triggering model predictions.
          </p>
        </div>

        {/* Sample Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {INSPECTION_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setSelectedSample(sample);
                setActiveFrameIndex(2);
              }}
              id={`sample-btn-${sample.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedSample.id === sample.id
                  ? 'bg-purple-600 text-white font-bold border border-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                  : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {sample.isFake ? 'FAKE' : 'REAL'}: {sample.sourceDataset.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Inspector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Frame Canvas & Grad-CAM Overlay */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] max-w-md rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner group">
            {/* Base Image Frame */}
            <img
              src={selectedSample.frameThumbnails[activeFrameIndex]}
              alt={`Frame ${activeFrameIndex + 1}`}
              className="w-full h-full object-cover filter contrast-105"
            />

            {/* Simulated Grad-CAM Heatmap Overlay */}
            {showGradCamOverlay && selectedSample.isFake && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-300"
                style={{
                  opacity: heatIntensity / 100,
                  background:
                    activeFrameIndex % 2 === 0
                      ? 'radial-gradient(circle at 45% 55%, rgba(239,68,68,0.85) 0%, rgba(249,115,22,0.6) 30%, rgba(234,179,8,0.3) 55%, transparent 75%)'
                      : 'radial-gradient(circle at 60% 40%, rgba(239,68,68,0.9) 0%, rgba(168,85,247,0.7) 35%, rgba(6,182,212,0.3) 60%, transparent 80%)',
                }}
              />
            )}

            {/* Facial Landmark Tracking Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <circle cx="50%" cy="45%" r="32%" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="42%" cy="40%" r="4%" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
              <circle cx="58%" cy="40%" r="4%" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
              <path d="M 44% 58% Q 50% 64% 56% 58%" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            </svg>

            {/* Top Badge: Real vs Fake */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
                  selectedSample.isFake
                    ? 'bg-red-950/80 text-red-300 border border-red-500/50'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                }`}
              >
                {selectedSample.isFake ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {selectedSample.isFake ? 'FORGERY DETECTED' : 'AUTHENTIC REAL'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-md">
                Frame {activeFrameIndex + 1} / {selectedSample.tensorFrames}
              </span>
            </div>

            {/* Grad-CAM Focus Annotation */}
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono backdrop-blur-md">
              <span className="text-slate-400 block text-[10px]">Grad-CAM High-Activation Region:</span>
              <span className="text-cyan-300 font-semibold">{selectedSample.gradCamFocusRegion}</span>
            </div>
          </div>

          {/* Controls & Heatmap Intensity Slider */}
          <div className="w-full max-w-md mt-4 flex items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <button
              onClick={() => setShowGradCamOverlay(!showGradCamOverlay)}
              id="toggle-gradcam-overlay-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showGradCamOverlay
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showGradCamOverlay ? 'Grad-CAM On' : 'Grad-CAM Off'}
            </button>

            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] font-mono text-slate-400 shrink-0">Opacity:</span>
              <input
                type="range"
                min="20"
                max="100"
                value={heatIntensity}
                onChange={(e) => setHeatIntensity(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[11px] font-mono text-cyan-300 w-8">{heatIntensity}%</span>
            </div>
          </div>

          {/* 5-Frame Sequence Selector */}
          <div className="w-full max-w-md mt-4">
            <label className="text-xs font-mono text-slate-400 block mb-2">
              Temporal Window (5 Consecutive Frames @ 1 FPS):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {selectedSample.frameThumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFrameIndex(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 aspect-square transition-all cursor-pointer ${
                    activeFrameIndex === idx
                      ? 'border-cyan-400 shadow-[0_0_12px_#06b6d4] scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 bg-slate-950/80 px-1 py-0.2 text-[9px] font-mono text-white rounded">
                    t+{idx}s
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Stage: Per-Branch Confidence Breakdown */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Calibrated Multi-Branch Score Breakdown
            </h3>

            {/* Final Overall Score */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 block">Overall Forgery Score</span>
                <span className="text-2xl font-black text-white font-mono">
                  {(selectedSample.confidenceScore * 100).toFixed(1)}%
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                  selectedSample.isFake
                    ? 'bg-red-950 text-red-300 border border-red-500/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {selectedSample.isFake ? 'HIGH RISK' : 'AUTHENTIC'}
              </div>
            </div>

            {/* Branch 1: Spatial ResNet */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Spatial Branch (ResNet-50 Texture / Seam):</span>
                <span className="text-purple-300 font-bold">{(selectedSample.spatialScore * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedSample.spatialScore * 100}%` }}
                />
              </div>
            </div>

            {/* Branch 2: Structural CapsNet */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Structural Branch (CapsNet Pose / Hierarchy):</span>
                <span className="text-cyan-300 font-bold">{(selectedSample.capsuleScore * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedSample.capsuleScore * 100}%` }}
                />
              </div>
            </div>

            {/* Branch 3: Temporal LSTM */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Temporal Branch (LSTM Sequence Motion):</span>
                <span className="text-emerald-300 font-bold">{(selectedSample.temporalScore * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedSample.temporalScore * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Forensic Metadata Box */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs font-mono text-purple-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Dataset Source:</span>
              <span className="text-white font-semibold">{selectedSample.sourceDataset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Manipulation Method:</span>
              <span className="text-cyan-300">{selectedSample.manipulationMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Abstain Threshold Gate:</span>
              <span className="text-emerald-400">Passed (Clear Confidence Bounds)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
