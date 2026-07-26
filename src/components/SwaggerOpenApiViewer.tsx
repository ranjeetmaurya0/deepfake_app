import React, { useState } from 'react';
import { API_ENDPOINTS } from '../data/backendData';
import { ApiEndpoint } from '../types';
import { Terminal, Send, CheckCircle2, Lock, ShieldAlert, Sparkles, Copy, Check, Play, FileCode, Layers } from 'lucide-react';

export const SwaggerOpenApiViewer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[1]);
  const [testPayload, setTestPayload] = useState<string>(selectedEndpoint.requestBodyExample || '');
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectEndpoint = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setTestPayload(endpoint.requestBodyExample || '');
    setResponseOutput(null);
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    setResponseOutput(null);

    try {
      if (selectedEndpoint.path === '/api/v1/auth/login') {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: testPayload,
        });
        const data = await res.json();
        setResponseOutput(JSON.stringify(data, null, 2));
      } else if (selectedEndpoint.path === '/api/v1/predictions/async') {
        const res = await fetch('/api/v1/predictions/async', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: testPayload,
        });
        const data = await res.json();
        setResponseOutput(JSON.stringify(data, null, 2));
      } else {
        // Fallback to static mock response
        await new Promise((r) => setTimeout(r, 400));
        setResponseOutput(selectedEndpoint.responseBodyExample);
      }
    } catch (err: any) {
      setResponseOutput(JSON.stringify({ error: err.message, status: 500 }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              OpenAPI 3.0 / Swagger Interactive REST API Console
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              Spring Boot 3.2 + Express
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test live REST endpoints, inspect request/response schemas, and verify JWT role-based security headers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Endpoint Selector Menu */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            API Route Directory ({API_ENDPOINTS.length})
          </span>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {API_ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              const methodColor =
                ep.method === 'GET'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                  : ep.method === 'POST'
                  ? 'bg-cyan-950 text-cyan-400 border-cyan-500/30'
                  : 'bg-amber-950 text-amber-400 border-amber-500/30';

              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  id={`endpoint-${ep.id}`}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${methodColor}`}>
                        {ep.method}
                      </span>
                      <span className="text-xs font-mono font-bold text-white truncate">{ep.path}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{ep.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Request & Response Console */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-black text-xs">
                  {selectedEndpoint.method}
                </span>
                <span className="text-white font-bold text-sm">{selectedEndpoint.path}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px]">
                Security: {selectedEndpoint.security}
              </span>
            </div>

            <p className="text-slate-300 font-sans text-xs">{selectedEndpoint.summary}</p>

            {/* Request Parameters */}
            <div>
              <span className="text-[11px] text-slate-500 block mb-1 uppercase font-bold">Parameters & Body Payload:</span>
              {selectedEndpoint.parameters.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900 p-2 rounded mb-1 text-[11px]">
                  <span className="text-cyan-300 font-bold">{p.name} <span className="text-slate-500 font-normal">({p.in})</span></span>
                  <span className="text-slate-400">{p.description}</span>
                  <span className="text-amber-400">{p.required ? 'Required' : 'Optional'}</span>
                </div>
              ))}
            </div>

            {/* Editable Request Body Payload if applicable */}
            {selectedEndpoint.requestBodyExample && (
              <div>
                <label className="text-[11px] text-slate-500 block mb-1 uppercase font-bold">Request Body Payload (JSON):</label>
                <textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  rows={4}
                  className="w-full bg-[#050914] border border-white/10 rounded-lg p-3 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {/* Action Trigger */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleExecuteRequest}
                disabled={loading}
                id="execute-api-endpoint-btn"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{loading ? 'Executing HTTP Call...' : 'Execute API Test Request'}</span>
              </button>
            </div>
          </div>

          {/* Response Inspector Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 font-mono text-xs relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                HTTP {selectedEndpoint.statusCode} Response Body
              </span>
              {responseOutput && (
                <button
                  onClick={handleCopyResponse}
                  id="copy-api-response-btn"
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Response'}</span>
                </button>
              )}
            </div>

            <pre className="bg-[#050914] p-4 rounded-lg text-cyan-200 text-xs overflow-x-auto max-h-64 leading-relaxed scrollbar-thin">
              <code>{responseOutput || selectedEndpoint.responseBodyExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
