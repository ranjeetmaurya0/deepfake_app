import React, { useState } from 'react';
import { CHAOS_SCENARIOS_DATA, ChaosScenario } from '../data/testingQaData';
import { Activity, Flame, ShieldAlert, Play, RefreshCw, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';

export const LoadTestingAndChaosViewer: React.FC = () => {
  const [targetRps, setTargetRps] = useState<number>(200);
  const [selectedChaosIndex, setSelectedChaosIndex] = useState<number>(0);
  const [isInjectingChaos, setIsInjectingChaos] = useState<boolean>(false);
  const [chaosLog, setChaosLog] = useState<string | null>(null);

  const activeScenario: ChaosScenario = CHAOS_SCENARIOS_DATA[selectedChaosIndex];

  // Calculate dynamic latency curves based on RPS
  const p50 = Math.round(8 + targetRps * 0.05);
  const p95 = Math.round(22 + targetRps * 0.12);
  const p99 = Math.round(45 + targetRps * 0.22);
  const cpuUsage = Math.min(95, Math.round(25 + targetRps * 0.14));

  const handleRunChaosTest = async () => {
    setIsInjectingChaos(true);
    setChaosLog(null);
    await new Promise((r) => setTimeout(r, 700));
    setChaosLog(`[CHAOS MONKEY FAULT INJECTOR] Triggering fault on target: ${activeScenario.targetService}...
Fault type: ${activeScenario.faultType}
[00:00.2] Fault active. Monitoring system metrics...
[00:01.1] Alert triggered: Primary instance latency elevated.
[00:01.8] High Availability failover mechanism triggered successfully.
[00:02.4] Recovery complete. System Verdict: ${activeScenario.resilienceVerdict} (${activeScenario.recoveryTimeMs}ms)
`.trim());
    setIsInjectingChaos(false);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Load Testing (k6 / Locust) & Chaos Engineering Fault Injection
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              HIGH-THROUGHPUT RESILIENCE BENCHMARK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency curve simulation (p50 / p95 / p99) under 50-500 RPS load with Chaos Monkey fault injection for pod hard crashes and connection pool exhaustion.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunChaosTest}
            disabled={isInjectingChaos}
            id="run-chaos-injection-btn"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
          >
            {isInjectingChaos ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Zap className="w-4 h-4 text-amber-300" />
            )}
            <span>{isInjectingChaos ? 'Injecting Chaos Fault...' : 'Simulate Fault Injection'}</span>
          </button>
        </div>
      </div>

      {/* Target RPS Interactive Slider & Latency Curves */}
      <div className="bg-slate-950 p-5 rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-white block">
              Simulated Load Throughput: <span className="text-cyan-300 text-sm">{targetRps} Requests / sec</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Simulating concurrent user video uploads & REST API queries
            </span>
          </div>

          <div className="w-full md:w-72 space-y-1">
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={targetRps}
              onChange={(e) => setTargetRps(Number(e.target.value))}
              id="rps-target-slider"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>50 RPS</span>
              <span>250 RPS</span>
              <span>500 RPS</span>
            </div>
          </div>
        </div>

        {/* Latency Percentiles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">p50 Latency (Median):</span>
            <span className="text-lg font-bold text-emerald-400 block">{p50} ms</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">p95 Latency (95th %):</span>
            <span className="text-lg font-bold text-cyan-300 block">{p95} ms</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">p99 Latency (Tail):</span>
            <span className="text-lg font-bold text-amber-300 block">{p99} ms</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">Cluster CPU Load:</span>
            <span className="text-lg font-bold text-purple-300 block">{cpuUsage}% Utilization</span>
          </div>
        </div>
      </div>

      {/* Chaos Engineering Scenarios Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chaos Scenarios */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Chaos Injection Scenarios ({CHAOS_SCENARIOS_DATA.length})
          </span>

          <div className="space-y-2">
            {CHAOS_SCENARIOS_DATA.map((scenario, idx) => {
              const isSelected = idx === selectedChaosIndex;
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedChaosIndex(idx);
                    setChaosLog(null);
                  }}
                  id={`select-chaos-scenario-${scenario.id}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white truncate max-w-[200px]">
                      {scenario.name}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30 shrink-0">
                      {scenario.faultType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-cyan-300">{scenario.targetService}</span>
                    <span className="text-emerald-400 font-bold">{scenario.resilienceVerdict}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chaos Output & Expected System Behavior */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="text-xs font-mono text-purple-300 font-bold block">{activeScenario.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Fault: {activeScenario.faultType} | Target: {activeScenario.targetService}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <span className="text-purple-300 font-bold font-mono">Expected System Behavior: </span>
              {activeScenario.expectedSystemBehavior}
            </p>

            {chaosLog && (
              <div className="space-y-2 animate-fade-in border-t border-white/10 pt-3">
                <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-400" /> Chaos Execution Telemetry Stream:
                </span>
                <pre className="bg-[#050914] p-3 rounded-lg border border-amber-500/30 font-mono text-[10px] text-amber-200 overflow-x-auto whitespace-pre-wrap max-h-[200px]">
                  <code>{chaosLog}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
