import React, { useState } from 'react';
import { TERRAFORM_MODULES_DATA, TerraformModule } from '../data/cloudDeploymentData';
import { Cloud, Copy, Check, Terminal, FileCode, CheckCircle2, Play, RefreshCw, Layers } from 'lucide-react';

export const TerraformIacViewer: React.FC = () => {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulatingPlan, setIsSimulatingPlan] = useState<boolean>(false);
  const [planOutput, setPlanOutput] = useState<string | null>(null);

  const activeModule: TerraformModule = TERRAFORM_MODULES_DATA[selectedModuleIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeModule.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTerraformPlan = async () => {
    setIsSimulatingPlan(true);
    setPlanOutput(null);
    await new Promise((r) => setTimeout(r, 800));
    setPlanOutput(`
Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # google_cloud_run_v2_service.deepfake_app will be created
  + resource "google_cloud_run_v2_service" "deepfake_app" {
      + location = "asia-southeast1"
      + name     = "deepfake-forensics-platform"
      + ingress  = "INGRESS_TRAFFIC_ALL"
    }

  # google_sql_database_instance.postgres_primary will be created
  + resource "google_sql_database_instance" "postgres_primary" {
      + database_version = "POSTGRES_16"
      + name             = "deepfake-postgres-primary"
      + region           = "asia-southeast1"
    }

  # google_artifact_registry_repository.docker_repo will be created
  + resource "google_artifact_registry_repository" "docker_repo" {
      + format        = "DOCKER"
      + repository_id = "deepfake-repo"
    }

Plan: 6 to add, 0 to change, 0 to destroy.
─────────────────────────────────────────────────────────────────────────────
Saved the plan to: tfplan
To perform these actions, run: "terraform apply tfplan"
    `.trim());
    setIsSimulatingPlan(false);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Terraform Infrastructure-as-Code (IaC) Inspector
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
              TERRAFORM 1.6 + GCP PROVIDER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Declarative HashiCorp HCL specifications provisioning GCP Cloud Run v2, High Availability PostgreSQL 16 Cloud SQL, Artifact Registry, and KMS Encrypted Storage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunTerraformPlan}
            disabled={isSimulatingPlan}
            id="run-terraform-plan-btn"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 hover:text-white font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            {isSimulatingPlan ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Play className="w-4 h-4 text-slate-950" />
            )}
            <span>{isSimulatingPlan ? 'Running tf plan...' : 'Simulate terraform plan'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            id="copy-terraform-code-btn"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy HCL'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Terraform Module Selection */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Terraform IaC Modules ({TERRAFORM_MODULES_DATA.length})
          </span>

          <div className="space-y-2">
            {TERRAFORM_MODULES_DATA.map((module, idx) => {
              const isSelected = idx === selectedModuleIndex;
              return (
                <button
                  key={module.id}
                  onClick={() => {
                    setSelectedModuleIndex(idx);
                    setPlanOutput(null);
                  }}
                  id={`select-tf-module-${idx}`}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer block ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white">{module.filename}</span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {module.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{module.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: HCL Viewer & Plan Output */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
              <span className="text-cyan-300 font-bold">{activeModule.filename}</span>
              <span className="text-slate-500">Language: HCL (HashiCorp Configuration Language)</span>
            </div>

            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-cyan-200 overflow-x-auto max-h-[380px] leading-relaxed">
              <code>{activeModule.codeSnippet}</code>
            </pre>

            {planOutput && (
              <div className="space-y-2 animate-fade-in border-t border-white/10 pt-3">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Terraform Execution Plan Output:
                </span>
                <pre className="bg-slate-900 p-3 rounded-lg border border-emerald-500/30 font-mono text-[10px] text-emerald-300 overflow-x-auto whitespace-pre-wrap max-h-[180px]">
                  <code>{planOutput}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
