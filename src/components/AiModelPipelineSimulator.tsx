import React, { useState } from 'react';
import { FRAME_INFERENCE_PIPELINE_DATA, FrameInferenceDetails } from '../data/aiPipelineData';
import { Cpu, Play, Pause, RotateCcw, Activity, Layers, Sliders, ShieldAlert, CheckCircle2, ArrowRight, Zap, RefreshCw, Eye, Sparkles } from 'lucide-react';

export const AiModelPipelineSimulator: React.FC = () => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(11); // Frame 12 (in fake region)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRunningBatchInference, setIsRunningBatchInference] = useState<boolean>(false);
  const [activeModelStage, setActiveModelStage] = useState<'spatial' | 'capsule' | 'temporal' | 'fusion'>('spatial');

  const currentFrameData: FrameInferenceDetails = FRAME_INFERENCE_PIPELINE_DATA[currentFrameIndex];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % FRAME_INFERENCE_PIPELINE_DATA.length);
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleBatchTritonInference = async () => {
    setIsRunningBatchInference(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      await fetch('/api/v1/predictions/async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: 'vid-30frame-sequence-001', priority: 'REALTIME' })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningBatchInference(false);
    }
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Triple-Hybrid AI Pipeline Tensor Simulator
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              TRITON GPU INFERENCE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate 30-frame tensor propagation across ResNet-50 spatial high-pass filtering, Capsule Network dynamic routing pose vectors, and Bi-LSTM temporal sequence attention.
          </p>
        </div>

        <button
          onClick={handleBatchTritonInference}
          disabled={isRunningBatchInference}
          id="run-batch-triton-inference-btn"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 hover:text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer shrink-0"
        >
          {isRunningBatchInference ? (
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Zap className="w-4 h-4 text-slate-950" />
          )}
          <span>{isRunningBatchInference ? 'Dispatching Triton GPU Job...' : 'Run 30-Frame GPU Inference'}</span>
        </button>
      </div>

      {/* Interactive 30-Frame Sequence Timeline & Player */}
      <div className="bg-slate-950 p-5 rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              id="toggle-frame-playback-btn"
              className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold flex items-center justify-center cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentFrameIndex(0)}
              id="reset-frame-slider-btn"
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="font-mono text-xs">
              <span className="text-slate-400">Frame:</span>{' '}
              <span className="text-cyan-300 font-bold">{currentFrameData.frameNumber} / 30</span>{' '}
              <span className="text-slate-500 ml-2">({currentFrameData.timeCode})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Frame Verdict:</span>
            <span className={`px-2.5 py-0.5 rounded font-bold ${
              currentFrameData.finalFakeProb > 0.5
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
            }`}>
              {currentFrameData.finalFakeProb > 0.5 ? 'DEEPFAKE FORGERY (0.961)' : 'AUTHENTIC (0.012)'}
            </span>
          </div>
        </div>

        {/* 30 Frame Scrubbing Track */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Frame 1 (00:00:01)</span>
            <span className="text-rose-400 font-bold">Forgery Region (Frames 8–24)</span>
            <span>Frame 30 (00:00:30)</span>
          </div>

          <div className="grid grid-cols-30 gap-1 h-8 items-center bg-slate-900 p-1 rounded-lg border border-white/10">
            {FRAME_INFERENCE_PIPELINE_DATA.map((frame, idx) => {
              const isCurrent = idx === currentFrameIndex;
              const isFake = frame.finalFakeProb > 0.5;

              return (
                <button
                  key={frame.frameNumber}
                  onClick={() => setCurrentFrameIndex(idx)}
                  id={`select-frame-${frame.frameNumber}`}
                  className={`h-full rounded transition-all cursor-pointer relative ${
                    isCurrent
                      ? 'ring-2 ring-cyan-400 scale-110 z-10'
                      : ''
                  } ${
                    isFake
                      ? 'bg-rose-500/80 hover:bg-rose-400'
                      : 'bg-emerald-500/40 hover:bg-emerald-400'
                  }`}
                  title={`Frame ${frame.frameNumber}: ${isFake ? 'Deepfake' : 'Authentic'}`}
                />
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={29}
            value={currentFrameIndex}
            onChange={(e) => setCurrentFrameIndex(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Model Stage Inspector Sub-tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveModelStage('spatial')}
          id="stage-spatial-btn"
          className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer ${
            activeModelStage === 'spatial'
              ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              : 'bg-slate-950 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">1. Spatial ResNet-50</span>
            <span className="text-[10px] text-purple-300">High-Pass Filter</span>
          </div>
          <p className="text-[11px] text-slate-400">Score: <span className="text-purple-300 font-bold">{currentFrameData.spatialScore}</span></p>
        </button>

        <button
          onClick={() => setActiveModelStage('capsule')}
          id="stage-capsule-btn"
          className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer ${
            activeModelStage === 'capsule'
              ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
              : 'bg-slate-950 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">2. Capsule Net</span>
            <span className="text-[10px] text-cyan-300">Pose Agreement</span>
          </div>
          <p className="text-[11px] text-slate-400">Error: <span className="text-cyan-300 font-bold">{currentFrameData.capsulePoseError}</span></p>
        </button>

        <button
          onClick={() => setActiveModelStage('temporal')}
          id="stage-temporal-btn"
          className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer ${
            activeModelStage === 'temporal'
              ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              : 'bg-slate-950 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">3. Bi-LSTM Temporal</span>
            <span className="text-[10px] text-purple-300">30-Frame Dynamics</span>
          </div>
          <p className="text-[11px] text-slate-400">Attention: <span className="text-purple-300 font-bold">{currentFrameData.lstmAttentionWeight}</span></p>
        </button>

        <button
          onClick={() => setActiveModelStage('fusion')}
          id="stage-fusion-btn"
          className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer ${
            activeModelStage === 'fusion'
              ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-slate-950 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">4. Calibrated Fusion</span>
            <span className="text-[10px] text-emerald-300">Triton Softmax</span>
          </div>
          <p className="text-[11px] text-slate-400">Prob: <span className="text-emerald-300 font-bold">{(currentFrameData.finalFakeProb * 100).toFixed(1)}%</span></p>
        </button>
      </div>

      {/* Stage Detail Card */}
      <div className="bg-slate-950 p-5 rounded-xl border border-white/10 space-y-4">
        {activeModelStage === 'spatial' && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              ResNet-50 High-Pass Spatial Feature Extraction (Frame #{currentFrameData.frameNumber})
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Applies 3x3 high-pass convolution kernels to suppress low-frequency facial illuminations and highlight boundary blending seams, color mismatch, and steganographic residual noise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Tensor Shape</span>
                <span className="text-white font-bold">(Batch=1, 2048, 7, 7)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">High-Pass Anomaly Metric</span>
                <span className="text-purple-300 font-bold">{currentFrameData.spatialScore}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Detected High-Freq Residual</span>
                <span className="text-cyan-300 font-bold">{currentFrameData.highPassFilterPreview}</span>
              </div>
            </div>
          </div>
        )}

        {activeModelStage === 'capsule' && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Structural Capsule Network Dynamic Routing (Frame #{currentFrameData.frameNumber})
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Calculates agreement vectors across 16 primary capsules representing eyes, nose, and mouth pose matrices. Evaluates dynamic routing convergence after 3 iterations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Capsule Agreement Vector</span>
                <span className="text-white font-bold">{currentFrameData.capsuleAgreementScore}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Pose Matrix Deviation</span>
                <span className="text-cyan-300 font-bold">{currentFrameData.capsulePoseError}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Routing Convergence</span>
                <span className="text-emerald-300 font-bold">3 Iterations (0.012 ms)</span>
              </div>
            </div>
          </div>
        )}

        {activeModelStage === 'temporal' && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Bi-LSTM Inter-Frame Temporal Sequence Model (30-Frame Window)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Processes 30 sequential frame feature vectors to detect subtle micro-flickering, unnatural eye blink intervals, and optical flow trajectory discontinuities across time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Sequence Length</span>
                <span className="text-white font-bold">30 Frames (1.0 sec)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">LSTM Attention Weight</span>
                <span className="text-purple-300 font-bold">{currentFrameData.lstmAttentionWeight}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Temporal Micro-Jitter</span>
                <span className="text-rose-300 font-bold">{currentFrameData.temporalJitter}</span>
              </div>
            </div>
          </div>
        )}

        {activeModelStage === 'fusion' && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Calibrated Softmax Fusion & Triton GPU Serving Output
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Combines Spatial, Capsule, and Temporal probabilities via Temperature Scaling (T=1.2) to yield risk-mitigated forgery classification scores.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Final Deepfake Probability</span>
                <span className="text-rose-400 font-bold">{(currentFrameData.finalFakeProb * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Triton Inference Latency</span>
                <span className="text-emerald-300 font-bold">14.2 ms (NVIDIA T4)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[10px]">Flagged Anomalies</span>
                <span className="text-cyan-300 font-bold">{currentFrameData.detectedArtifacts.join(', ')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
