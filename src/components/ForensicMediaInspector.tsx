import React, { useState } from 'react';
import { MOCK_FORENSIC_REPORTS } from '../data/frontendData';
import { ForensicAnalysisReport, ForensicFrameData } from '../types';
import { Upload, Play, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Sliders, FileText, Download, RefreshCw, Eye, Sparkles, Layers, Activity } from 'lucide-react';

export const ForensicMediaInspector: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ForensicAnalysisReport>(MOCK_FORENSIC_REPORTS[0]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(100);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [customFileUploaded, setCustomFileUploaded] = useState<string | null>(null);

  const activeFrame: ForensicFrameData = selectedReport.frames[currentFrameIndex] || selectedReport.frames[0];

  const handleSimulateCustomUpload = async (filename: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setCustomFileUploaded(filename);

    await new Promise((r) => setTimeout(r, 400));
    setAnalysisProgress(35); // RetinaFace alignment
    await new Promise((r) => setTimeout(r, 500));
    setAnalysisProgress(65); // ResNet & Capsule
    await new Promise((r) => setTimeout(r, 500));
    setAnalysisProgress(90); // Bi-LSTM sequence
    await new Promise((r) => setTimeout(r, 400));
    setAnalysisProgress(100);
    setIsAnalyzing(false);
  };

  const handleExportJsonReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `forensic_report_${selectedReport.analysisId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Live Deepfake Media Forensic Inspector
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              TRIPLE-HYBRID AI ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload video or image assets for real-time frame extraction, face landmark alignment, ResNet-50 spatial analysis, Capsule structural routing, and Bi-LSTM temporal evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJsonReport}
            id="export-forensic-report-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Forensic JSON Report</span>
          </button>
        </div>
      </div>

      {/* Preset Media Sample Selector & Upload Drag Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload & Presets */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
            1. Select Sample or Upload Media
          </span>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleSimulateCustomUpload(e.dataTransfer.files[0].name);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/40'
                : 'border-white/10 bg-slate-950/60 hover:border-cyan-500/50 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-xs font-bold text-white mb-1">
              {customFileUploaded ? `Uploaded: ${customFileUploaded}` : 'Drag & Drop Video or Image File Here'}
            </p>
            <p className="text-[11px] text-slate-400 mb-3">Supports MP4, MOV, AVI, PNG, JPG (Max 500MB)</p>
            <label id="browse-media-file-btn" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs cursor-pointer inline-block hover:bg-cyan-400">
              Browse Media File
              <input
                type="file"
                accept="video/*,image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSimulateCustomUpload(e.target.files[0].name);
                  }
                }}
              />
            </label>
          </div>

          {/* Preset Benchmark Samples */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Or Pick Benchmark Sample:</span>
            {MOCK_FORENSIC_REPORTS.map((report) => {
              const isSelected = selectedReport.analysisId === report.analysisId;
              return (
                <button
                  key={report.analysisId}
                  onClick={() => {
                    setSelectedReport(report);
                    setCurrentFrameIndex(0);
                    setCustomFileUploaded(null);
                  }}
                  id={`preset-report-${report.analysisId}`}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white font-mono">{report.mediaFilename}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      report.isFake ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {report.isFake ? 'DEEPFAKE' : 'AUTHENTIC'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span>{report.resolution}</span>
                    <span>•</span>
                    <span>{report.fps} FPS</span>
                    <span>•</span>
                    <span className="text-cyan-300">Conf: {(report.calibratedConfidence * 100).toFixed(2)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Live Analysis HUD & Frame Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {isAnalyzing ? (
            <div className="bg-slate-950 p-8 rounded-2xl border border-cyan-500/40 text-center space-y-4 py-16">
              <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">Executing Triple-Hybrid GPU Pipeline...</h3>
              <div className="max-w-md mx-auto bg-slate-900 rounded-full h-3 border border-white/10 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-xs font-mono text-cyan-300">
                {analysisProgress < 30 ? 'Stage 1: Extracting 5-frame sequence & RetinaFace cropping...' :
                 analysisProgress < 70 ? 'Stage 2 & 3: Running ResNet-50 Spatial & Capsule Routing passes...' :
                 'Stage 4 & 5: Bi-LSTM temporal sequence & Calibrated Softmax classification...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Verdict Summary Card */}
              <div className={`p-5 rounded-2xl border ${
                selectedReport.isFake
                  ? 'bg-gradient-to-r from-rose-950/80 via-slate-950 to-purple-950/80 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                  : 'bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {selectedReport.isFake ? (
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      <span className={`text-sm font-black font-mono tracking-wider ${
                        selectedReport.isFake ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {selectedReport.verdictLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">
                      File: {selectedReport.mediaFilename} ({selectedReport.resolution} @ {selectedReport.fps} FPS)
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Calibrated Probability</span>
                    <span className={`text-2xl font-black font-mono ${
                      selectedReport.isFake ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {(selectedReport.calibratedConfidence * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Sub-model Scores Bar Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 font-mono text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">ResNet Spatial</span>
                    <span className="font-bold text-cyan-300">{(selectedReport.spatialResNetScore * 100).toFixed(1)}%</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Capsule Structure</span>
                    <span className="font-bold text-purple-300">{(selectedReport.structuralCapsuleScore * 100).toFixed(1)}%</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">LSTM Temporal</span>
                    <span className="font-bold text-emerald-300">{(selectedReport.temporalLstmScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Active Frame & Bounding Box Inspector */}
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono text-xs">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Frame Inspector (Frame #{currentFrameIndex + 1} / {selectedReport.frames.length})
                  </span>
                  <span className="text-slate-400">Offset: {activeFrame.timeOffsetMs}ms</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Frame Image Preview with Bounding Box Overlay */}
                  <div className="md:col-span-6 relative rounded-xl overflow-hidden border border-cyan-500/30 group">
                    <img
                      src={activeFrame.thumbnailUrl}
                      alt={`Frame ${currentFrameIndex}`}
                      className="w-full h-48 object-cover"
                    />
                    {/* Simulated Bounding Box Overlay */}
                    {selectedReport.isFake && (
                      <div className="absolute inset-x-8 inset-y-6 border-2 border-dashed border-rose-500/80 bg-rose-500/10 rounded pointer-events-none flex items-start justify-end p-1">
                        <span className="text-[9px] font-mono font-bold bg-rose-950 text-rose-300 px-1 rounded border border-rose-500/40">
                          BBox [110, 45, 230, 220]
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Detected Artifacts & Spatial Info */}
                  <div className="md:col-span-6 space-y-2 font-mono text-xs">
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Detected Forgery Artifacts:</span>
                    {activeFrame.detectedArtifacts.length > 0 ? (
                      <ul className="space-y-1.5">
                        {activeFrame.detectedArtifacts.map((art, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-500/20 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{art}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-300 text-[11px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>No structural or spatial forgery artifacts detected in frame.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame Timeline Selector Slider */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Frame Timeline Sequence</span>
                    <span>Frame {currentFrameIndex + 1} of {selectedReport.frames.length}</span>
                  </div>
                  <div className="flex gap-2">
                    {selectedReport.frames.map((frame, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentFrameIndex(idx)}
                        className={`flex-1 p-2 rounded-lg border text-center transition-all cursor-pointer font-mono text-xs ${
                          currentFrameIndex === idx
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        F{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
