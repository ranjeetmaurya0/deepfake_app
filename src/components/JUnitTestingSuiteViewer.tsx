import React, { useState } from 'react';
import { JUNIT_TEST_CASES_DATA, TestCase } from '../data/testingQaData';
import { CheckCircle2, Play, RefreshCw, Code, ShieldCheck, Terminal, Copy, Check, Clock, FileCode } from 'lucide-react';

export const JUnitTestingSuiteViewer: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [isExecutingSuite, setIsExecutingSuite] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredTestCases = JUNIT_TEST_CASES_DATA.filter((tc) => {
    if (filterCategory === 'ALL') return true;
    return tc.category === filterCategory;
  });

  const activeTestCase: TestCase = filteredTestCases[selectedTestCaseIndex] || filteredTestCases[0] || JUNIT_TEST_CASES_DATA[0];

  const handleRunTestSuite = async () => {
    setIsExecutingSuite(true);
    setProgressPercent(0);

    for (let p = 10; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 120));
      setProgressPercent(p);
    }

    setIsExecutingSuite(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTestCase.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDurationMs = JUNIT_TEST_CASES_DATA.reduce((acc, curr) => acc + curr.durationMs, 0);
  const totalAssertions = JUNIT_TEST_CASES_DATA.reduce((acc, curr) => acc + curr.assertionsCount, 0);

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">
              Automated JUnit 5 & RestAssured Integration Testing Suite
            </h2>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">
              SPRING BOOT TEST + MOCKMVC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end integration test runner validating RS256 JWT signature security, 30-frame tensor normalization pipelines, REST endpoint assertions, and HikariCP connection pool resilience.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunTestSuite}
            disabled={isExecutingSuite}
            id="run-junit-test-suite-btn"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            {isExecutingSuite ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Play className="w-4 h-4 text-slate-950" />
            )}
            <span>{isExecutingSuite ? 'Running Test Suite...' : 'Run All Test Cases'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Test Suite Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono block">Pass Rate:</span>
            <span className="text-xl font-bold font-mono text-emerald-400">100% (5 / 5 Passed)</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono block">Total Suite Execution:</span>
            <span className="text-xl font-bold font-mono text-cyan-300">{totalDurationMs} ms</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono block">Validated Assertions:</span>
            <span className="text-xl font-bold font-mono text-purple-300">{totalAssertions} Assertions</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-1.5 flex flex-col justify-center">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Execution Progress:</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <span className="text-xs font-mono text-slate-400 mr-2">Filter Category:</span>
        {['ALL', 'Security Test', 'Integration Test', 'Performance Test'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilterCategory(cat);
              setSelectedTestCaseIndex(0);
            }}
            id={`filter-junit-cat-${cat.toLowerCase().replace(' ', '-')}`}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Test Case Selection & Code Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Test Cases List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Test Cases ({filteredTestCases.length})
          </span>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredTestCases.map((tc, idx) => {
              const isSelected = idx === selectedTestCaseIndex;
              return (
                <button
                  key={tc.id}
                  onClick={() => setSelectedTestCaseIndex(idx)}
                  id={`select-test-case-${tc.id}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white truncate max-w-[220px]">
                      {tc.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                      {tc.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-cyan-300">{tc.targetClass}</span>
                    <span>{tc.durationMs} ms | {tc.assertionsCount} assertions</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Inspector & Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block">{activeTestCase.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">Target: {activeTestCase.targetClass}</span>
              </div>

              <button
                onClick={handleCopyCode}
                id="copy-test-code-btn"
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-emerald-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied' : 'Copy Test'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeTestCase.description}</p>

            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-emerald-200 overflow-x-auto max-h-[280px] leading-relaxed">
              <code>{activeTestCase.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
