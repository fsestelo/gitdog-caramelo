import React from "react";
import { useTranslation } from "react-i18next";
import { 
  GitBranch, 
  Layers, 
  Send, 
  Server, 
  ArrowRight, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Flame, 
  UserCheck 
} from "lucide-react";
import { Environment, Deployment, AuditLog } from "../types";

interface DashboardProps {
  workflowsCount: number;
  versionsCount: number;
  deployments: Deployment[];
  environments: Environment[];
  auditLogs: AuditLog[];
}

export default function Dashboard({
  workflowsCount,
  versionsCount,
  deployments,
  environments,
  auditLogs
}: DashboardProps) {
  const { t } = useTranslation();

  const successDeploys = deployments.filter(d => d.status === "SUCCESS").length;

  return (
    <div id="dashboard-root" className="space-y-8 animate-fadeIn">
      {/* 1. Header with branding and date */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">{t("dashboard.title")}</h2>
          <p className="text-xs text-[#8b949e]">Controle em tempo real de servidores n8n distribuídos</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-[#8b949e] block">INSTANTE DO SERVIDOR (UTC)</span>
          <span className="text-xs font-mono font-bold text-amber-500">2026-06-08 22:34:41</span>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-15 transform group-hover:scale-110 transition-transform">
            <GitBranch className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-xs font-mono text-[#8b949e] uppercase font-semibold">{t("dashboard.total_workflows")}</p>
          <h3 className="text-3xl font-extrabold text-white font-display mt-2">{workflowsCount}</h3>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">● 100% integrados no PostgreSQL</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-15 transform group-hover:scale-110 transition-transform">
            <Layers className="w-16 h-16 text-sky-500" />
          </div>
          <p className="text-xs font-mono text-[#8b949e] uppercase font-semibold">{t("dashboard.total_versions")}</p>
          <h3 className="text-3xl font-extrabold text-white font-display mt-2">{versionsCount}</h3>
          <p className="text-[10px] text-sky-400 font-mono mt-1">JSONB Snapshots Versionados</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-15 transform group-hover:scale-110 transition-transform">
            <Send className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-xs font-mono text-[#8b949e] uppercase font-semibold">{t("dashboard.total_deploys")}</p>
          <h3 className="text-3xl font-extrabold text-white font-display mt-2">{deployments.length}</h3>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">➔ {successDeploys} Deploys com Sucesso</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-15 transform group-hover:scale-110 transition-transform">
            <Server className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-xs font-mono text-[#8b949e] uppercase font-semibold">{t("dashboard.active_environments")}</p>
          <h3 className="text-3xl font-extrabold text-white font-display mt-2">{environments.length}</h3>
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded font-mono mt-2 inline-block border border-emerald-900">
            PROD, HOMOLOG, QA, DEV
          </span>
        </div>
      </div>

      {/* 3. Visual CI/CD Flow Illustration */}
      <div className="p-6 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-xl">
        <h4 className="text-sm font-bold text-white font-display mb-4 tracking-tight uppercase text-amber-500">
          {t("dashboard.deploy_flow_title")}
        </h4>
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
          {/* Step 1 */}
          <div className="text-center space-y-2 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 font-bold font-display text-sm">
              01
            </div>
            <h5 className="text-xs font-bold text-white">Desenho no n8n DEV</h5>
            <p className="text-[10px] text-[#8b949e]">Construa fluxos e integre APIs no painel local</p>
          </div>

          <ArrowRight className="w-5 h-5 text-[#30363d] hidden md:block" />

          {/* Step 2 */}
          <div className="text-center space-y-2 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400 font-bold font-display text-sm">
              02
            </div>
            <h5 className="text-xs font-bold text-white">Commit no GitDog</h5>
            <p className="text-[10px] text-[#8b949e]">Salve snapshots no PostgreSQL JSONB nativo</p>
          </div>

          <ArrowRight className="w-5 h-5 text-[#30363d] hidden md:block" />

          {/* Step 3 */}
          <div className="text-center space-y-2 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 font-bold font-display text-sm">
              03
            </div>
            <h5 className="text-xs font-bold text-white">Releases Estáveis</h5>
            <p className="text-[10px] text-[#8b949e]">Agrupe múltiplos fluxos em pacotes nomeados</p>
          </div>

          <ArrowRight className="w-5 h-5 text-[#30363d] hidden md:block" />

          {/* Step 4 */}
          <div className="text-center space-y-2 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 font-bold font-display text-sm">
              04
            </div>
            <h5 className="text-xs font-bold text-white">Deploy nos Clusters</h5>
            <p className="text-[10px] text-[#8b949e]">Propague para os canais QA, HOMOLOG ou PROD</p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid splits: Recent Deploys (left) and Activities (right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Recent Deploy Table */}
        <div className="md:col-span-8 p-5 bg-[#161b22] border border-[#30363d] rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">{t("dashboard.recent_deploys")}</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#30363d] text-[#8b949e] font-mono">
                  <th className="pb-3 text-left">Deploy ID</th>
                  <th className="pb-3">Tipo / Alvo</th>
                  <th className="pb-3">Responsável</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {deployments.slice(0, 5).map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#21262d]/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-amber-500">{dep.id}</td>
                    <td className="py-3">
                      <div className="font-semibold text-white">
                        {dep.releaseId ? "📦 Pacote Release" : "⚡ Workflow Solo"}
                      </div>
                      <div className="text-[10px] text-[#8b949e]">Ambiente: <span className="font-bold text-white">{dep.targetEnvironmentName}</span></div>
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                        {dep.authorName}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium inline-block border ${
                        dep.status === "SUCCESS" 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-900" 
                          : "bg-rose-950/40 text-rose-400 border-rose-900"
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[#8b949e] text-[10px] font-mono">
                      {new Date(dep.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Status / Activities */}
        <div className="md:col-span-4 space-y-6">
          {/* Health Indicators */}
          <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">{t("dashboard.health_indicators")}</h4>
            <div className="space-y-3">
              {environments.map((env) => (
                <div key={env.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{env.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      100% ONLINE
                    </span>
                  </div>
                  <div className="w-full bg-[#30363d] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick activities summary */}
          <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">{t("dashboard.recent_activities")}</h4>
            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs flex gap-2">
                  <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white">
                      <strong className="text-[#c9d1d9]">{log.userName}</strong> executou <span className="font-mono text-amber-400">{log.action}</span>
                    </p>
                    <p className="text-[10px] text-[#8b949e] italic">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
