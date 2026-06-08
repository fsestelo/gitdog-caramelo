import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  GitBranch, 
  Plus, 
  Calendar, 
  User, 
  GitCommit, 
  Diff, 
  Settings, 
  Search, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle,
  Clock
} from "lucide-react";
import { Workflow, WorkflowVersion, WorkflowData } from "../types";
import DiffViewer from "../components/DiffViewer";
import WorkflowEditorMini from "../components/WorkflowEditorMini";

interface WorkflowsProps {
  workflows: Workflow[];
  onAddWorkflow: (name: string, description: string, initialNodes?: any[], comment?: string) => Promise<any>;
  onAddVersion: (workflowId: string, workflowData: WorkflowData, comment: string) => Promise<any>;
  currentUser: any;
}

export default function Workflows({
  workflows,
  onAddWorkflow,
  onAddVersion,
  currentUser
}: WorkflowsProps) {
  const { t } = useTranslation();
  
  const [selectedWfId, setSelectedWfId] = useState<string>(workflows[0]?.id || "");
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  
  // Tab control: "history" | "editor" | "diff"
  const [activeTab, setActiveTab] = useState<"history" | "editor" | "diff">("history");
  
  // New workflow modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [newWfDesc, setNewWfDesc] = useState("");
  const [isCreatingWf, setIsCreatingWf] = useState(false);
  
  // Versions picked for diffing
  const [diffVerLeft, setDiffVerLeft] = useState<string>("");
  const [diffVerRight, setDiffVerRight] = useState<string>("");

  const selectedWf = workflows.find(w => w.id === selectedWfId);

  // Fetch Versions whenever selected workflow changes
  const fetchVersions = async () => {
    if (!selectedWfId) return;
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/workflows/${selectedWfId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data);
        if (data.length >= 2) {
          setDiffVerLeft(data[1].id);
          setDiffVerRight(data[0].id);
        } else if (data.length === 1) {
          setDiffVerLeft(data[0].id);
          setDiffVerRight(data[0].id);
        }
      }
    } catch (e) {
      console.error("Error fetching versions:", e);
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [selectedWfId]);

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;
    setIsCreatingWf(true);
    try {
      const res = await onAddWorkflow(newWfName, newWfDesc);
      if (res) {
        setSelectedWfId(res.workflow.id);
        setShowAddModal(false);
        setNewWfName("");
        setNewWfDesc("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingWf(false);
    }
  };

  const handleSaveEditorVersion = async (workflowData: WorkflowData, comment: string) => {
    if (!selectedWfId) return;
    await onAddVersion(selectedWfId, workflowData, comment);
    // Refresh versions list
    await fetchVersions();
    setActiveTab("history");
  };

  const vLeftObj = versions.find(v => v.id === diffVerLeft) || null;
  const vRightObj = versions.find(v => v.id === diffVerRight) || null;

  return (
    <div id="workflows-root" className="grid grid-cols-12 gap-6 animate-fadeIn">
      {/* 1. LEFT WORKFLOWS SELECTION RAIL */}
      <div className="col-span-12 md:col-span-4 bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-4 h-[calc(100vh-120px)] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-amber-500" />
              {t("workflows.title")}
            </h3>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="p-1 px-2.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Criar
            </button>
          </div>

          {/* Search box placeholder */}
          <div className="relative">
            <Search className="w-4 h-4 absolute top-2.5 left-3 text-[#8b949e]" />
            <input
              type="text"
              placeholder={t("common.search")}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Workflow List layout */}
          <div className="space-y-1.5 overflow-y-auto max-h-96 pr-1">
            {workflows.map((wf) => {
              const matches = wf.id === selectedWfId;
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWfId(wf.id)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    matches
                      ? "bg-[#21262d] border-amber-500 text-white"
                      : "bg-[#0d1117] border-[#30363d] hover:border-zinc-500 text-[#8b949e]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className={`font-semibold text-xs truncate ${matches ? "text-white" : "text-zinc-200"}`}>{wf.name}</h5>
                    <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />
                  </div>
                  <p className="text-[10px] text-[#8b949e] truncate mt-1">{wf.description || "Nenhuma descrição."}</p>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[9px] font-mono text-zinc-500">ID: {wf.id}</span>
                    <span className="text-[9px] font-mono px-1 bg-amber-500/10 text-amber-500 rounded font-semibold border border-amber-500/20">
                      PostgreSQL
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/15">
          <p className="text-[10px] font-mono text-amber-500 leading-normal">
            ⚙️ MECANISMO DE PERSISTÊNCIA:<br />
            Sem Git. Versionador armazena JSONBs diretamente no banco relacional PostgreSQL com auditoria e controle de integridade transacional.
          </p>
        </div>
      </div>

      {/* 2. RIGHT WORKFLOW CONTENT AREA */}
      <div className="col-span-12 md:col-span-8 bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-6 h-[calc(100vh-120px)] overflow-y-auto">
        {selectedWf ? (
          <div className="space-y-6">
            {/* Upper details */}
            <div className="border-b border-[#30363d] pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">PROCESSO DE DEPLOYMENT</span>
                <h2 className="text-xl font-bold font-display text-white mt-0.5">{selectedWf.name}</h2>
                <p className="text-xs text-[#8b949e] mt-1">{selectedWf.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("history")}
                  className={`p-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    activeTab === "history" ? "bg-amber-500 text-black font-bold" : "bg-[#21262d] text-[#8b949e] hover:bg-zinc-800"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {t("workflows.view_history")}
                </button>

                <button
                  onClick={() => setActiveTab("editor")}
                  className={`p-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    activeTab === "editor" ? "bg-amber-500 text-black font-bold" : "bg-[#21262d] text-[#8b949e] hover:bg-zinc-800"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Commit
                </button>

                <button
                  onClick={() => setActiveTab("diff")}
                  className={`p-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    activeTab === "diff" ? "bg-amber-500 text-black font-bold" : "bg-[#21262d] text-[#8b949e] hover:bg-zinc-800"
                  }`}
                >
                  <Diff className="w-3.5 h-3.5" />
                  Visual Diff ({t("workflows.diff_title")})
                </button>
              </div>
            </div>

            {/* Tab content rendering */}
            {activeTab === "history" && (
              <div id="workflows-version-commits" className="space-y-4">
                <h4 className="text-xs font-semibold font-mono text-[#8b949e] tracking-widest uppercase">
                  Lista de Commits de Versão (PostgreSQL JSONB)
                </h4>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {versions.map((ver) => (
                    <div key={ver.id} className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg hover:border-[#8b949e] transition-all flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded font-mono text-[10px] border border-amber-500/20 font-bold">
                            VER: {ver.version}
                          </span>
                          <span className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                            <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
                            {ver.comment}
                          </span>
                        </div>
                        <div className="flex gap-4 text-[10px] text-[#8b949e] font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {ver.authorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ver.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 bg-[#21262d] px-2 py-1 rounded">
                          {(ver.workflowData?.nodes || []).length} nodes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "editor" && (
              <WorkflowEditorMini
                workflowId={selectedWf.id}
                workflowName={selectedWf.name}
                initialNodes={versions[0]?.workflowData?.nodes || []}
                onSaveVersion={handleSaveEditorVersion}
                isSaving={false}
              />
            )}

            {activeTab === "diff" && (
              <div className="space-y-6">
                {/* Visual dropdown selects */}
                <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8b949e] mb-1">CÓPIA BASE</label>
                    <select
                      value={diffVerLeft}
                      onChange={(e) => setDiffVerLeft(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#161b22] border border-[#30363d] rounded-lg text-white focus:outline-none"
                    >
                      {versions.map(v => (
                        <option key={v.id} value={v.id}>v{v.version} - {v.comment}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#8b949e] mb-1">CÓPIA DE COMPLEXIDADE (DESTINO)</label>
                    <select
                      value={diffVerRight}
                      onChange={(e) => setDiffVerRight(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#161b22] border border-[#30363d] rounded-lg text-white focus:outline-none"
                    >
                      {versions.map(v => (
                        <option key={v.id} value={v.id}>v{v.version} - {v.comment}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <DiffViewer versionLeft={vLeftObj} versionRight={vRightObj} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center text-[#8b949e] space-y-4">
            <GitBranch className="w-16 h-16 text-[#30363d]" />
            <h4 className="font-semibold text-white">Selecione ou Crie um Workflow</h4>
            <p className="text-xs">Para visualizar o histórico e commits, selecione um item na barra lateral.</p>
          </div>
        )}
      </div>

      {/* 3. NEW WORKFLOW MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Registrar Novo Workflow no PostgreSQL</h3>
            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome do Workflow</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Envio de Faturas SAP para Asaas"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição</label>
                <textarea
                  required
                  placeholder="Especifique as regras do negócio e webhooks"
                  value={newWfDesc}
                  onChange={(e) => setNewWfDesc(e.target.value)}
                  className="w-full h-20 p-3 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#21262d] text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWf}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg cursor-pointer flex items-center"
                >
                  {isCreatingWf ? t("common.loading") : t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
