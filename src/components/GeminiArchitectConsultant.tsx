import React, { useState } from 'react';
import { Bot, Send, Sparkles, Loader2, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

export const GeminiArchitectConsultant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const SUGGESTED_QUERIES = [
    'Why use Capsule Networks over standard CNN pooling for face structure?',
    'How does H.264 compression degrade spatial forgery detection accuracy?',
    'Explain the identity-aware dataset splitting methodology to prevent leakage.',
    'Compare ResNet-50 vs EfficientNet-B4 as a spatial feature backbone.',
  ];

  const handleConsult = async (promptQuery: string) => {
    if (!promptQuery.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptQuery, section: 'Phase 1 System Architecture' }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.answer);
      } else {
        setResponse(`Error: ${data.details || data.error}`);
      }
    } catch (err: any) {
      setResponse(`System error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0c1224] rounded-2xl border border-purple-500/30 p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              AI Forensic Architect Consultation
              <span className="text-[10px] font-mono font-normal text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                SERVER-SIDE GEMINI 3.6
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Query the system about research findings, model trade-offs, tensor mechanics, or Triton GPU deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="mb-4">
        <span className="text-xs font-mono text-slate-400 block mb-2">Suggested Architectural Queries:</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleConsult(q);
              }}
              id={`suggested-query-${idx}`}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400/50 text-xs text-slate-300 hover:text-white transition-all text-left cursor-pointer"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConsult(query);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a technical or architectural question based on the uploaded research papers..."
          className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          id="ask-gemini-architect-btn"
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>{loading ? 'Analyzing...' : 'Consult AI'}</span>
        </button>
      </form>

      {/* Response Display Box */}
      {response && (
        <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs font-sans text-slate-200 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap shadow-inner font-mono">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-3 border-b border-white/10 pb-2">
            <Bot className="w-4 h-4" />
            <span>AI Research Architect Analysis:</span>
          </div>
          {response}
        </div>
      )}
    </div>
  );
};
