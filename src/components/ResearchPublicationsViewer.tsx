import React, { useState } from 'react';
import { RESEARCH_PAPERS } from '../data/frontendData';
import { ResearchPaper } from '../types';
import { BookOpen, Copy, Check, Download, Search, Sparkles, Award, ExternalLink, FileText } from 'lucide-react';

export const ResearchPublicationsViewer: React.FC = () => {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper>(RESEARCH_PAPERS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredPapers = RESEARCH_PAPERS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.journalVenue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(selectedPaper.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Research Publications & Peer-Reviewed Literature Repository
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              IJRPR 2025 & BENCHMARK CITATIONS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse published literature on deepfake detection, triple-hybrid neural network architectures, and spatial-temporal forgery analysis.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0 w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, authors, venue..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Publications List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Repository Directory ({filteredPapers.length})
          </span>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredPapers.map((paper) => {
              const isSelected = selectedPaper.id === paper.id;
              return (
                <button
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  id={`paper-card-${paper.id}`}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  {paper.isPrimaryPaper && (
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 mb-1.5">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PRIMARY PLATFORM RESEARCH PAPER</span>
                    </div>
                  )}

                  <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug mb-1">
                    {paper.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 line-clamp-1 mb-2 font-mono">
                    {paper.authors.join(', ')}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span className="truncate max-w-[180px]">{paper.journalVenue}</span>
                    <span className="text-purple-300 font-bold">{paper.publicationYear}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Paper Reader & BibTeX Drawer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-6 rounded-xl border border-purple-500/30 space-y-4">
            {/* Paper Header */}
            <div>
              {selectedPaper.isPrimaryPaper && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Original Core Publication (IJRPR 2025)
                </span>
              )}
              <h3 className="text-lg font-black text-white leading-snug">{selectedPaper.title}</h3>
              <p className="text-xs font-mono text-purple-300 mt-2">
                By {selectedPaper.authors.join(', ')}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Published in <span className="text-white font-bold">{selectedPaper.journalVenue}</span> ({selectedPaper.publicationYear})
              </p>
            </div>

            {/* Abstract Section */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase block">Abstract</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedPaper.abstractText}</p>
            </div>

            {/* Key Contributions */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase block">Key Novel Contributions:</span>
              <ul className="space-y-1.5">
                {selectedPaper.keyContributions.map((contrib, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-purple-400 font-bold font-mono">[{idx + 1}]</span>
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BibTeX Code Snippet & Actions */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">BibTeX Citation</span>
                <button
                  onClick={handleCopyBibtex}
                  id="copy-paper-bibtex-btn"
                  className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied BibTeX!' : 'Copy BibTeX'}</span>
                </button>
              </div>

              <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-purple-200 overflow-x-auto">
                <code>{selectedPaper.bibtex}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
