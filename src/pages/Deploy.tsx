import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, RotateCcw, Server, Play, ShieldAlert, CheckCircle, Terminal, HelpCircle, Layers, GitCommit } from "lucide-react";
import { Workflow, WorkflowVersion, Release, Environment, Deployment } from "../types";

interface DeployProps {
  workflows: Workflow[];
  releases: Release[];
  environments: Environment[];
  deployments: Deployment[];
  onExecuteDeploy: (deployData: any) => Promise<any>;
  onExecuteRollback: (rollbackData: any) => Promise<any>;
  currentUser: any;
}

export default function Deploy({
  workflows,
  releases,
  environments,
  deployments,
  onExecuteDeploy,
  onExecuteRollback,
  currentUser
}: DeployProps) {
  const { t } = useTranslation();

  // Tab control: "deploy" | "rollback"
  const [panelTab, setPanelTab] = useState<"deploy" | "rollback">("deploy");

  // FORM STATS - DEPLOY
  const [deployType, setDeployType] = useState<"single" | "release">("single");
  const [targetEnvId, setTargetEnvId] = useState("");
  const [selectedWfId, setSelectedWfId] = useState("");
  const [selectedVerNum, setSelectedVerNum] = useState<number>(1);
  const [selectedRelId, setSelectedRelId] = useState("");
  
  // Versions for single deployment dropdown
  const [availableVersions, setAvailableVersions] = useState<WorkflowVersion[]>([]);

  // FORM STATS - ROLLBACK
  const [rollWfId, setRollWfId] = useState("");
  const [rollVerNum, setRollVerNum] = useState<number>(1);
  const [rollEnvId, setRollEnvId] = useState("");
  const [availableRollVersions, setAvailableRollVersions] = useState<WorkflowVersion[]>([]);

  // PROCESS STATES
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);

  // Set default form values inside selectors on load
  useEffect(() => {
    if (environments.length && !targetEnvId) {
      setTargetEnvId(environments[0].id);
      setRollEnvId(environments[0].id);
    }
    if (workflows.length) {
      if (!selectedWfId) setSelectedWfId(workflows[0].id);
      if (!rollWfId) setRollWfId(workflows[0].id);
    }
    if (releases.length && !selectedRelId) {
      setSelectedRelId(releases[0].id);
    }
  }, [environments, workflows, releases]);

  // Fetch versions for single deploy workflow selector
  useEffect(() => {
    if (!selectedWfId) return;
    fetch(`/api/workflows/${selectedWfId}/versions`)
      .then(res => res.json())
      .then(data => {
        setAvailableVersions(data);
        if (data.length) setSelectedVerNum(data[0].version);
      })
      .catch(e => console.error(e));
  }, [selectedWfId]);

  // Fetch versions for rollback workflow selector
  useEffect(() => {
    if (!rollWfId) return;
    fetch(`/api/workflows/${rollWfId}/versions`)
      .then(res => res.json())
      .then(data => {
        setAvailableRollVersions(data);
        if (data.length) setRollVerNum(data[0].version);
      })
      .catch(e => console.error(e));
  }, [rollWfId]);

  const triggerDeployLogSimulation = (finalLogs: string[]) => {
    setActiveLogs([]);
    setIsProcessing(true);
    let currentLine = 0;

    const interval = setInterval(() => {
      if (currentLine < finalLogs.length) {
        setActiveLogs(prev => [...prev, finalLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 600); // stream simulated latency
  };

  const handleDeploySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEnvId) return;
    if (deployType === "single" && !selectedWfId) return;
    if (deployType === "release" && !selectedRelId) return;

    setActiveLogs(["[INFO] Processando transação de Deploy...", "[INFO] Contatando o banco PostgreSQL central..."]);
    setIsProcessing(true);

    const payload = {
      type: deployType,
      targetEnvironmentId: targetEnvId,
      workflowId: deployType === "single" ? selectedWfId : undefined,
      versionNumber: deployType === "single" ? selectedVerNum : undefined,
      releaseId: deployType === "release" ? selectedRelId : undefined
    };

    try {
      const res = await onExecuteDeploy(payload);
      if (res) {
        triggerDeployLogSimulation(res.logs);
      }
    } catch (err) {
      console.error(err);
      setActiveLogs(prev => [...prev, "[ERROR] Falha de comunicação com o cluster n8n."]);
      setIsProcessing(false);
    }
  };

  const handleRollbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollWfId || !rollEnvId) return;

    setActiveLogs(["[INFO] INICIANDO ROLLBACK DE EMERGÊNCIA...", "[INFO] Recuperando histórico..."]);
    setIsProcessing(true);

    const payload = {
      workflowId: rollWfId,
      versionNumber: rollVerNum,
      targetEnvironmentId: rollEnvId
    };

    try {
      const res = await onExecuteRollback(payload);
      if (res && res.deployment) {
        triggerDeployLogSimulation(res.deployment.logs);
      }
    } catch (err) {
      console.error(err);
      setActiveLogs(prev => [...prev, "[ERROR] Cancelado. Servidor n8n inoperável ou erro de timeout."]);
      setIsProcessing(false);
    }
  };

  const canDeploy = ["Administrator", "Release Manager", "Developer"].includes(currentUser?.role || "");

  return (
    <div id="deploy-root" className="grid grid-cols-12 gap-6 animate-fadeIn">
      {/* LEFT FORM SELECTOR RAIL */}
      <div className="col-span-12 md:col-span-5 bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-5 h-[calc(100vh-120px)] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex border-b border-[#30363d] pb-2">
            <button
              onClick={() => { setPanelTab("deploy"); setActiveLogs([]); }}
              className={`flex-1 py-2 text-xs font-bold font-display flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                panelTab === "deploy" ? "text-amber-500 border-amber-500" : "text-[#8b949e] border-transparent hover:text-white"
              }`}
            >
              <Send className="w-4 h-4" />
              Executar Deploy
            </button>
            <button
              onClick={() => { setPanelTab("rollback"); setActiveLogs([]); }}
              className={`flex-1 py-2 text-xs font-bold font-display flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                panelTab === "rollback" ? "text-rose-400 border-rose-400" : "text-[#8b949e] border-transparent hover:text-white"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Emergência (Rollback)
            </button>
          </div>

          {/* ACTIVE TAB: DEPLOY */}
          {panelTab === "deploy" && (
            <form onSubmit={handleDeploySubmit} className="space-y-4 text-xs">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">configurações CICD</span>
              
              {/* Deploy Type */}
              <div className="space-y-2">
                <label className="block font-medium text-zinc-300">Tipo de Entrega</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDeployType("single")}
                    className={`flex-1 py-2.5 rounded-lg border text-center transition-all cursor-pointer font-bold font-display ${
                      deployType === "single"
                        ? "bg-[#21262d] border-amber-500 text-white"
                        : "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-zinc-500"
                    }`}
                  >
                    Workflow Solo
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeployType("release")}
                    className={`flex-1 py-2.5 rounded-lg border text-center transition-all cursor-pointer font-bold font-display ${
                      deployType === "release"
                        ? "bg-[#21262d] border-amber-500 text-white"
                        : "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-zinc-500"
                    }`}
                  >
                    Pacote Release
                  </button>
                </div>
              </div>

              {/* Single form selector */}
              {deployType === "single" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-300 mb-1">Selecione o Workflow</label>
                    <select
                      value={selectedWfId}
                      onChange={(e) => setSelectedWfId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium focus:outline-none"
                    >
                      {workflows.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1">Versão de Commit Solicitada</label>
                    <select
                      value={selectedVerNum}
                      onChange={(e) => setSelectedVerNum(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium"
                    >
                      {availableVersions.map(v => (
                        <option key={v.id} value={v.version}>v{v.version} - {v.comment}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-zinc-300 mb-1">Selecione o Pacote de Release</label>
                  <select
                    value={selectedRelId}
                    onChange={(e) => setSelectedRelId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium"
                  >
                    {releases.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.items.length} fluxos)</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Target Environment */}
              <div>
                <label className="block text-zinc-300 mb-2">Ambiente de Destino (Instância n8n)</label>
                <div className="grid grid-cols-2 gap-2">
                  {environments.map(env => (
                    <div
                      key={env.id}
                      onClick={() => setTargetEnvId(env.id)}
                      className={`p-3 rounded-lg border cursor-pointer text-left transition-all ${
                        targetEnvId === env.id
                          ? "bg-amber-500/10 border-amber-500 text-white font-semibold"
                          : "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-zinc-500"
                      }`}
                    >
                      <h5 className="font-bold font-display">{env.name}</h5>
                      <p className="text-[9px] font-mono truncate mt-0.5">{env.url}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action trigger button */}
              <button
                type="submit"
                disabled={isProcessing || !canDeploy}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black disabled:text-[#8b949e] font-extrabold font-display rounded-lg tracking-wide uppercase cursor-pointer"
              >
                {isProcessing ? "Transmitindo no Cluster..." : "Executar Deploy Oficial"}
              </button>
            </form>
          )}

          {/* ACTIVE TAB: EMERGENCY ROLLBACK */}
          {panelTab === "rollback" && (
            <form onSubmit={handleRollbackSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/15 text-rose-400 space-y-1">
                <h5 className="font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                  Regras de Rollback Seguro
                </h5>
                <p className="text-[10px] leading-relaxed">
                  Para restaurar a integridade sem furos no commit, o sistema copia as especificações do JSONB selecionado e gera um novo commit sequencial, registrando a operação e aplicando override nas APIs do n8n automaticamente.
                </p>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Selecione o Workflow Problemático</label>
                <select
                  value={rollWfId}
                  onChange={(e) => setRollWfId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium"
                >
                  {workflows.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Snapshot de Versão de Backup Alvo</label>
                <select
                  value={rollVerNum}
                  onChange={(e) => setRollVerNum(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium focus:outline-none"
                >
                  {availableRollVersions.map(v => (
                    <option key={v.id} value={v.version}>Versão {v.version} - {v.comment}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-2">Ambiente para Restaurar</label>
                <div className="grid grid-cols-2 gap-2">
                  {environments.map(env => (
                    <div
                      key={env.id}
                      onClick={() => setRollEnvId(env.id)}
                      className={`p-3 rounded-lg border cursor-pointer text-left transition-all ${
                        rollEnvId === env.id
                          ? "bg-rose-500/10 border-rose-500 text-white font-semibold"
                          : "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-zinc-500"
                      }`}
                    >
                      <h5 className="font-bold font-display">{env.name}</h5>
                      <p className="text-[9px] font-mono truncate mt-0.5">{env.url}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigger rollback button */}
              <button
                type="submit"
                disabled={isProcessing || !canDeploy}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-800 text-white font-bold font-display rounded-lg uppercase cursor-pointer"
              >
                {isProcessing ? "Revertendo Transação..." : "Confirmar Rollback Imediato"}
              </button>
            </form>
          )}
        </div>

        <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
          <p className="text-[10px] font-mono text-zinc-500">
            Autorizado para: <span className="text-white font-bold">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>
      </div>

      {/* RIGHT REALTIME TERMINAL LOG */}
      <div className="col-span-12 md:col-span-7 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col justify-between h-[calc(100vh-120px)] overflow-hidden">
        {/* Console Header */}
        <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold font-mono text-zinc-300">CONSOLA OPERACIONAL: DEPLOY & ROLLBACK SECURE MONITOR</h4>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-60"></span>
          </div>
        </div>

        {/* Live logs scrolling element */}
        <div className="p-5 font-mono text-xs text-[#c9d1d9] space-y-2 overflow-y-auto flex-1 bg-black/35">
          {activeLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
              <Terminal className="w-8 h-8 text-[#30363d]" />
              <p className="text-[11px]">Consola vazia. Dispare um deploy ou rollback para monitorar os webhooks da API n8n em tempo real.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {activeLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-amber-500 select-none font-bold mr-1.5">λ</span>
                  <span className={log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" : log.includes("[ERROR]") ? "text-rose-400 font-bold" : "text-zinc-300"}>
                    {log}
                  </span>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 pt-2 text-[#8b949e]">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="text-[11px] font-bold italic">Processando canal gRPC e JSONB local...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status footer inside terminal */}
        <div className="bg-[#161b22] px-4 py-2 border-t border-[#30363d] flex justify-between items-center text-[10px] font-mono text-[#8b949e] shrink-0">
          <span>PORT: 5432 (POSTGRESQL RELATIONAL)</span>
          <span>SYSTEM SINC: SECURE OK</span>
        </div>
      </div>
    </div>
  );
}
