import React, { useState } from 'react';
import { Header } from './components/Header';
import { PhaseRoadmap } from './components/PhaseRoadmap';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { GradCamInspector } from './components/GradCamInspector';
import { DataPipelineViewer } from './components/DataPipelineViewer';
import { BenchmarkTable } from './components/BenchmarkTable';
import { GeminiArchitectConsultant } from './components/GeminiArchitectConsultant';
import { PhaseConfirmationModal } from './components/PhaseConfirmationModal';
import { ErDiagramViewer } from './components/ErDiagramViewer';
import { TableSchemaInspector } from './components/TableSchemaInspector';
import { SqlDdlExportViewer } from './components/SqlDdlExportViewer';
import { Phase2ConfirmationModal } from './components/Phase2ConfirmationModal';
import { SwaggerOpenApiViewer } from './components/SwaggerOpenApiViewer';
import { SpringCodeExplorer } from './components/SpringCodeExplorer';
import { AsyncJobOrchestratorViewer } from './components/AsyncJobOrchestratorViewer';
import { Phase3ConfirmationModal } from './components/Phase3ConfirmationModal';
import { ForensicMediaInspector } from './components/ForensicMediaInspector';
import { ResearchPublicationsViewer } from './components/ResearchPublicationsViewer';
import { ContactEnterpriseForm } from './components/ContactEnterpriseForm';
import { Phase4ConfirmationModal } from './components/Phase4ConfirmationModal';
import { JwtTokenSimulator } from './components/JwtTokenSimulator';
import { RbacMatrixViewer } from './components/RbacMatrixViewer';
import { SpringSecurityConfigExplorer } from './components/SpringSecurityConfigExplorer';
import { Phase5ConfirmationModal } from './components/Phase5ConfirmationModal';
import { AiModelPipelineSimulator } from './components/AiModelPipelineSimulator';
import { GeminiReportGenerator } from './components/GeminiReportGenerator';
import { ModelInferenceSpecsViewer } from './components/ModelInferenceSpecsViewer';
import { Phase6ConfirmationModal } from './components/Phase6ConfirmationModal';
import { AdminInfrastructureTelemetry } from './components/AdminInfrastructureTelemetry';
import { UserRoleManagementConsole } from './components/UserRoleManagementConsole';
import { ForensicAuditLogViewer } from './components/ForensicAuditLogViewer';
import { Phase7ConfirmationModal } from './components/Phase7ConfirmationModal';
import { TerraformIacViewer } from './components/TerraformIacViewer';
import { KubernetesManifestsViewer } from './components/KubernetesManifestsViewer';
import { DockerAndCicdViewer } from './components/DockerAndCicdViewer';
import { Phase8ConfirmationModal } from './components/Phase8ConfirmationModal';
import { JUnitTestingSuiteViewer } from './components/JUnitTestingSuiteViewer';
import { OwaspPenetrationScanViewer } from './components/OwaspPenetrationScanViewer';
import { LoadTestingAndChaosViewer } from './components/LoadTestingAndChaosViewer';
import { Phase9ConfirmationModal } from './components/Phase9ConfirmationModal';
import { ProductionOptimizationViewer } from './components/ProductionOptimizationViewer';
import { Phase10ConfirmationModal } from './components/Phase10ConfirmationModal';
import { MOCK_USERS } from './data/authData';
import { AuthUser, AppPhase } from './types';
import { Gauge, Shield, FileText, Cpu, Sparkles, Code, Lock, Eye, BookOpen, HelpCircle, CheckCircle2, ArrowRight, Cloud, Layers, GitBranch, CheckSquare, ShieldCheck, Flame, Award, Globe, Trophy } from 'lucide-react';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('Phase 10: Production Optimization');
  const [activeUser, setActiveUser] = useState<AuthUser>(MOCK_USERS[0]); // Dr. Ranjeet Maurya
  const [isModal1Open, setIsModal1Open] = useState<boolean>(false);
  const [isModal2Open, setIsModal2Open] = useState<boolean>(false);
  const [isModal3Open, setIsModal3Open] = useState<boolean>(false);
  const [isModal4Open, setIsModal4Open] = useState<boolean>(false);
  const [isModal5Open, setIsModal5Open] = useState<boolean>(false);
  const [isModal6Open, setIsModal6Open] = useState<boolean>(false);
  const [isModal7Open, setIsModal7Open] = useState<boolean>(false);
  const [isModal8Open, setIsModal8Open] = useState<boolean>(false);
  const [isModal9Open, setIsModal9Open] = useState<boolean>(false);
  const [isModal10Open, setIsModal10Open] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    | 'production-opt'
    | 'junit-tests'
    | 'owasp-audit'
    | 'load-chaos'
    | 'terraform'
    | 'kubernetes'
    | 'docker-cicd'
    | 'telemetry'
    | 'user-roles'
    | 'audit-logs'
    | 'ai-pipeline'
    | 'gemini-reports'
    | 'model-specs'
    | 'jwt-simulator'
    | 'rbac-matrix'
    | 'forensic-inspector'
    | 'publications'
    | 'ai-consultant'
  >('production-opt');

  const handleConfirmPhase2 = () => {
    setIsModal1Open(false);
    setCurrentPhase('Phase 2: Database Design');
  };

  const handleConfirmPhase3 = () => {
    setIsModal2Open(false);
    setCurrentPhase('Phase 3: Backend Services');
  };

  const handleConfirmPhase4 = () => {
    setIsModal3Open(false);
    setCurrentPhase('Phase 4: Frontend Platform');
    setActiveTab('forensic-inspector');
  };

  const handleConfirmPhase5 = () => {
    setIsModal4Open(false);
    setCurrentPhase('Phase 5: Authentication & Authorization');
    setActiveTab('jwt-simulator');
  };

  const handleConfirmPhase6 = () => {
    setIsModal5Open(false);
    setCurrentPhase('Phase 6: AI Pipeline Integration');
    setActiveTab('ai-pipeline');
  };

  const handleConfirmPhase7 = () => {
    setIsModal6Open(false);
    setCurrentPhase('Phase 7: Admin Dashboard');
    setActiveTab('telemetry');
  };

  const handleConfirmPhase8 = () => {
    setIsModal7Open(false);
    setCurrentPhase('Phase 8: Deployment & Cloud Infra');
    setActiveTab('terraform');
  };

  const handleConfirmPhase9 = () => {
    setIsModal8Open(false);
    setCurrentPhase('Phase 9: Testing & QA');
    setActiveTab('junit-tests');
  };

  const handleConfirmPhase10 = () => {
    setIsModal9Open(false);
    setCurrentPhase('Phase 10: Production Optimization');
    setActiveTab('production-opt');
    setIsModal10Open(true);
  };

  const triggerNextPhaseModal = () => {
    if (currentPhase === 'Phase 1: System Architecture') setIsModal1Open(true);
    else if (currentPhase === 'Phase 2: Database Design') setIsModal2Open(true);
    else if (currentPhase === 'Phase 3: Backend Services') setIsModal3Open(true);
    else if (currentPhase === 'Phase 4: Frontend Platform') setIsModal4Open(true);
    else if (currentPhase === 'Phase 5: Authentication & Authorization') setIsModal5Open(true);
    else if (currentPhase === 'Phase 6: AI Pipeline Integration') setIsModal6Open(true);
    else if (currentPhase === 'Phase 7: Admin Dashboard') setIsModal7Open(true);
    else if (currentPhase === 'Phase 8: Deployment & Cloud Infra') setIsModal8Open(true);
    else if (currentPhase === 'Phase 9: Testing & QA') setIsModal9Open(true);
    else setIsModal10Open(true);
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-white pb-16">
      {/* Top Application Header */}
      <Header currentPhase={currentPhase} onProceedToPhase2={triggerNextPhaseModal} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-8">
        {/* Phase Lifecycle Progress Tracker */}
        <PhaseRoadmap currentPhase={currentPhase} onProceed={triggerNextPhaseModal} />

        {/* Hero Banner for Phase 10 Production Optimization & System Handoff */}
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-emerald-950/90 p-6 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                PHASE 10 PRODUCTION OPTIMIZATION & HANDOFF
              </span>
              <span className="text-xs font-mono text-slate-400">Global Edge CDN, SLA/SLO Telemetry & Live System Handoff</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Production System Sign-Off, CDN Edge Caching & System Handoff
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              Enterprise deployment optimization featuring <span className="text-amber-300 font-semibold">GCP Cloud CDN Edge Caching</span> (99.1% hit rate), <span className="text-emerald-300 font-semibold">Real-Time SLA Compliance (99.998% Uptime)</span>, <span className="text-cyan-300 font-semibold">100% Verified Production Checklist</span>, and <span className="text-purple-300 font-semibold">Interactive System Handoff Export</span>.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <div className="p-3.5 bg-slate-950/90 border border-white/10 rounded-xl font-mono text-xs text-slate-300 space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Global Edge CDN:</span>
                <span className="text-emerald-400 font-bold">99.1% Cache Hit Rate</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Availability SLA:</span>
                <span className="text-amber-300 font-bold">99.998% Uptime</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Sign-off Readiness:</span>
                <span className="text-cyan-300 font-bold">7 / 7 Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('production-opt')}
            id="tab-production-opt-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'production-opt'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>1. Production Edge & System Handoff</span>
          </button>

          <button
            onClick={() => setActiveTab('junit-tests')}
            id="tab-junit-tests-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'junit-tests'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>2. JUnit 5 & RestAssured Tests</span>
          </button>

          <button
            onClick={() => setActiveTab('owasp-audit')}
            id="tab-owasp-audit-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'owasp-audit'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. OWASP Security Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('load-chaos')}
            id="tab-load-chaos-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'load-chaos'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>4. Load & Chaos Engineering</span>
          </button>

          <button
            onClick={() => setActiveTab('terraform')}
            id="tab-terraform-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terraform'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>5. Terraform IaC Scripts</span>
          </button>

          <button
            onClick={() => setActiveTab('kubernetes')}
            id="tab-kubernetes-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'kubernetes'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>6. GKE Kubernetes Manifests</span>
          </button>

          <button
            onClick={() => setActiveTab('docker-cicd')}
            id="tab-docker-cicd-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'docker-cicd'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>7. Dockerfile & GitHub Actions</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            id="tab-telemetry-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>8. Hardware Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('user-roles')}
            id="tab-user-roles-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'user-roles'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>9. User Roles Console</span>
          </button>

          <button
            onClick={() => setActiveTab('audit-logs')}
            id="tab-audit-logs-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'audit-logs'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>10. Forensic Audit Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-pipeline')}
            id="tab-ai-pipeline-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai-pipeline'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>11. 30-Frame Tensor Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('gemini-reports')}
            id="tab-gemini-reports-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gemini-reports'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>12. Gemini Forensic Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('forensic-inspector')}
            id="tab-forensic-inspector-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'forensic-inspector'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>13. Live Media Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-consultant')}
            id="tab-aiconsultant-phase10-btn"
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai-consultant'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>14. AI Architect Consultant</span>
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="transition-all duration-300">
          {activeTab === 'production-opt' && <ProductionOptimizationViewer />}
          {activeTab === 'junit-tests' && <JUnitTestingSuiteViewer />}
          {activeTab === 'owasp-audit' && <OwaspPenetrationScanViewer />}
          {activeTab === 'load-chaos' && <LoadTestingAndChaosViewer />}
          {activeTab === 'terraform' && <TerraformIacViewer />}
          {activeTab === 'kubernetes' && <KubernetesManifestsViewer />}
          {activeTab === 'docker-cicd' && <DockerAndCicdViewer />}
          {activeTab === 'telemetry' && <AdminInfrastructureTelemetry />}
          {activeTab === 'user-roles' && <UserRoleManagementConsole />}
          {activeTab === 'audit-logs' && <ForensicAuditLogViewer />}
          {activeTab === 'ai-pipeline' && <AiModelPipelineSimulator />}
          {activeTab === 'gemini-reports' && <GeminiReportGenerator />}
          {activeTab === 'model-specs' && <ModelInferenceSpecsViewer />}
          {activeTab === 'jwt-simulator' && (
            <JwtTokenSimulator activeUser={activeUser} onUserChange={(usr) => setActiveUser(usr)} />
          )}
          {activeTab === 'rbac-matrix' && <RbacMatrixViewer activeUser={activeUser} />}
          {activeTab === 'forensic-inspector' && <ForensicMediaInspector />}
          {activeTab === 'publications' && <ResearchPublicationsViewer />}
          {activeTab === 'ai-consultant' && <GeminiArchitectConsultant />}
        </div>

        {/* Bottom Callout Celebrating Complete 10-Phase Platform */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/80 via-emerald-950/60 to-slate-950 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Full 10-Phase Enterprise Platform Engineering Complete</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All 10 architecture, microservice, database, frontend, security, AI, telemetry, cloud infrastructure, testing, and production handoff milestones are fully deployed and operational.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModal10Open(true)}
            id="bottom-view-final-signoff-btn"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer shrink-0"
          >
            <Trophy className="w-4 h-4 text-slate-950" />
            <span>View Final System Handoff & Sign-Off Certificate</span>
          </button>
        </div>
      </main>

      {/* Confirmation Modals */}
      <PhaseConfirmationModal
        isOpen={isModal1Open}
        onClose={() => setIsModal1Open(false)}
        onConfirm={handleConfirmPhase2}
      />

      <Phase2ConfirmationModal
        isOpen={isModal2Open}
        onClose={() => setIsModal2Open(false)}
        onConfirm={handleConfirmPhase3}
      />

      <Phase3ConfirmationModal
        isOpen={isModal3Open}
        onClose={() => setIsModal3Open(false)}
        onConfirm={handleConfirmPhase4}
      />

      <Phase4ConfirmationModal
        isOpen={isModal4Open}
        onClose={() => setIsModal4Open(false)}
        onConfirm={handleConfirmPhase5}
      />

      <Phase5ConfirmationModal
        isOpen={isModal5Open}
        onClose={() => setIsModal5Open(false)}
        onConfirm={handleConfirmPhase6}
      />

      <Phase6ConfirmationModal
        isOpen={isModal6Open}
        onClose={() => setIsModal6Open(false)}
        onConfirm={handleConfirmPhase7}
      />

      <Phase7ConfirmationModal
        isOpen={isModal7Open}
        onClose={() => setIsModal7Open(false)}
        onConfirm={handleConfirmPhase8}
      />

      <Phase8ConfirmationModal
        isOpen={isModal8Open}
        onClose={() => setIsModal8Open(false)}
        onConfirm={handleConfirmPhase9}
      />

      <Phase9ConfirmationModal
        isOpen={isModal9Open}
        onClose={() => setIsModal9Open(false)}
        onConfirm={handleConfirmPhase10}
      />

      <Phase10ConfirmationModal
        isOpen={isModal10Open}
        onClose={() => setIsModal10Open(false)}
      />
    </div>
  );
}
