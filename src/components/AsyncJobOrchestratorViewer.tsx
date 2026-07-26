import React, { useState } from 'react';
import { Play, CheckCircle2, Loader2, Cpu, Zap, Database, ArrowRight, ShieldCheck } from 'lucide-react';

export const AsyncJobOrchestratorViewer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Async Job Orchestrator Idle and ready for batch dispatch.'
  ]);

  const PIPELINE_STEPS = [
    {
      step: 1,
      title: 'REST Controller Ingestion',
      component: 'Spring Boot @RestController',
      detail: 'Validates request payload, checks JWT permissions, generates unique jobId, and responds 202 Accepted immediately.',
      latency: '2ms'
    },
    {
      step: 2,
      title: 'Kafka Queue Publishing',
      component: 'Apache Kafka Cluster',
      detail: 'Publishes payload to topic "deepfake.inference.requests" with key = jobId and partition distribution by videoId hash.',
      latency: '4ms'
    },
    {
      step: 3,
      title: 'Triton Dynamic Batching',
      component: 'NVIDIA Triton GPU Server',
      detail: 'Pulls frame tensor batches (B, 5, 3, 224, 224), runs TensorRT FP16 model kernels across ResNet-50, Capsule, and LSTM branches.',
      latency: '115ms'
    },
    {
      step: 4,
      title: 'PostgreSQL Persistence',
      component: 'PostgreSQL 15 / Cloud SQL',
      detail: 'Writes prediction record, per-frame Grad-CAM bounding boxes, and triggers audit log creation inside atomic transaction.',
      latency: '8ms'
    },
    {
      step: 5,
      title: 'Redis Pub/Sub WebSocket Broadcast',
      component: 'Redis Cluster + WebSockets',
      detail: 'Publishes completion event to Redis channel. Connected client receives real-time UI notification with final prediction report.',
      latency: '1ms'
    }
  ];

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setActiveStep(1);
    setLogs(['[00:00.000] POST /api/v1/predictions/async received for media asset "vid-ffraw-001"']);

    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(2);
    setLogs((prev) => [
      ...prev,
      '[00:00.002] 202 Accepted returned to client. JobID = "job-99812-triton-kafka"',
      '[00:00.006] Published message to Kafka Topic "deepfake.inference.requests" [Partition 0, Offset 14209]'
    ]);

    await new Promise((r) => setTimeout(r, 900));
    setActiveStep(3);
    setLogs((prev) => [
      ...prev,
      '[00:00.010] Triton GPU Worker pulled job-99812. Assembled tensor batch shape (32, 5, 3, 224, 224)',
      '[00:00.125] Model Forward Pass Complete: ResNet50 = 0.9840, CapsuleNet = 0.9912, LSTM = 0.9985'
    ]);

    await new Promise((r) => setTimeout(r, 700));
    setActiveStep(4);
    setLogs((prev) => [
      ...prev,
      '[00:00.133] INSERT INTO predictions (id, video_id, is_fake, confidence_score) VALUES ("pred-7712", ..., TRUE, 0.9926) SUCCESS',
      '[00:00.137] Grad-CAM Heatmap overlay generated and uploaded to Cloud Object Storage.'
    ]);

    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(5);
    setLogs((prev) => [
      ...prev,
      '[00:00.138] Redis Pub/Sub broadcast sent to WebSocket channel "user-channel-883921"',
      '[00:00.140] SUCCESS: Total end-to-end processing time = 140ms'
    ]);

    setIsSimulating(false);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Async Kafka Queue & Triton GPU Inference Orchestrator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate high-throughput asynchronous GPU batch processing pipeline with non-blocking HTTP 202 status.
          </p>
        </div>

        <button
          onClick={handleStartSimulation}
          disabled={isSimulating}
          id="simulate-orchestrator-btn"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isSimulating ? 'Simulating Pipeline...' : 'Run Async Job Pipeline Simulation'}</span>
        </button>
      </div>

      {/* Pipeline Visual Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {PIPELINE_STEPS.map((step) => {
          const isActive = activeStep === step.step;
          const isPassed = activeStep > step.step;

          return (
            <div
              key={step.step}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.03]'
                  : isPassed
                  ? 'bg-slate-900/90 border-emerald-500/50'
                  : 'bg-slate-900/40 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isActive ? 'bg-cyan-500 text-slate-950' : isPassed ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  STEP {step.step}
                </span>
                <span className="text-[10px] font-mono text-cyan-300">{step.latency}</span>
              </div>

              <h4 className="font-mono font-bold text-xs text-white mb-1">{step.title}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{step.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Live Pipeline Terminal Logs */}
      <div className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <span className="text-slate-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Backend Kafka Worker & Triton Event Log
          </span>
          <span className="text-[10px] text-emerald-400">Total Latency: 140ms</span>
        </div>

        <div className="space-y-1.5 text-cyan-200/90 max-h-48 overflow-y-auto font-mono text-xs scrollbar-thin">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
