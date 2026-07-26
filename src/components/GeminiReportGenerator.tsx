import React, { useState } from 'react';
import { Sparkles, FileText, Send, Download, Copy, Check, ShieldAlert, Cpu, Terminal, ShieldCheck, RefreshCw } from 'lucide-react';

export const GeminiReportGenerator: React.FC = () => {
  const [mediaName, setMediaName] = useState<string>('celebdf_manipulated_interview_042.mp4');
  const [spatialScore, setSpatialScore] = useState<number>(0.942);
  const [capsuleScore, setCapsuleScore] = useState<number>(0.918);
  const [temporalScore, setTemporalScore] = useState<number>(0.887);
  const [overallConfidence, setOverallConfidence] = useState<number>(0.961);
  const [frameRange, setFrameRange] = useState<string>('Frames 8 to 24 (00:00:08 - 00:00:24)');

  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [generatedBy, setGeneratedBy] = useState<string>('');

  const handleGenerateReport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/v1/forensics/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaName,
          spatialScore,
          capsuleScore,
          temporalScore,
          overallConfidence,
          frameRange
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReportMarkdown(data.reportMarkdown);
        setGeneratedBy(data.generatedBy || 'Gemini 2.5 Flash Forensic Inference Engine');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              AI Forensic Expert Report Generator (Gemini 2.5 Flash)
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              LEGAL FORENSIC EXPLAINABILITY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated digital forensic testimony report synthesis translating tensor outputs into structured court-admissible diagnostic reports.
          </p>
        </div>

        {reportMarkdown && (
          <button
            onClick={handleCopyReport}
            id="copy-forensic-report-btn"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            <span>{copied ? 'Report Copied!' : 'Copy Forensic Markdown'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Parameters Form */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
            1. Target Media & Tensor Metrics
          </span>

          <form onSubmit={handleGenerateReport} className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Media Filename</label>
              <input
                type="text"
                value={mediaName}
                onChange={(e) => setMediaName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">ResNet-50 Score</label>
                <input
                  type="number"
                  step="0.001"
                  value={spatialScore}
                  onChange={(e) => setSpatialScore(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-purple-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Capsule Error</label>
                <input
                  type="number"
                  step="0.001"
                  value={capsuleScore}
                  onChange={(e) => setCapsuleScore(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Bi-LSTM Jitter</label>
                <input
                  type="number"
                  step="0.001"
                  value={temporalScore}
                  onChange={(e) => setTemporalScore(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-purple-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Overall Forgery Prob</label>
                <input
                  type="number"
                  step="0.001"
                  value={overallConfidence}
                  onChange={(e) => setOverallConfidence(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Flagged Frame Range</label>
              <input
                type="text"
                value={frameRange}
                onChange={(e) => setFrameRange(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              id="generate-forensic-report-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] mt-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
              <span>{isGenerating ? 'Synthesizing Forensic Testimony...' : 'Generate Gemini Forensic Report'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Generated Report Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/30 space-y-4 min-h-[420px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">Forensic Examination Output Document</span>
              </div>
              {generatedBy && (
                <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  {generatedBy}
                </span>
              )}
            </div>

            {reportMarkdown ? (
              <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-slate-200 overflow-x-auto whitespace-pre-wrap max-h-[480px] leading-relaxed">
                <code>{reportMarkdown}</code>
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-[320px] text-center space-y-3 p-6 border border-dashed border-white/10 rounded-xl">
                <Sparkles className="w-10 h-10 text-purple-400/60 animate-pulse" />
                <h4 className="text-sm font-bold text-white font-mono">No Report Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Click 'Generate Gemini Forensic Report' to run the AI explainability pipeline and produce a formal digital forensic report for court submission.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
