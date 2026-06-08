import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tag, Plus, Trash2, Box, Calendar, User, ListPlus, Archive, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Workflow, WorkflowVersion, Release } from "../types";

interface ReleasesProps {
  releases: Release[];
  workflows: Workflow[];
  onAddRelease: (name: string, description: string, items: any[]) => Promise<any>;
  currentUser: any;
}

export default function Releases({
  releases,
  workflows,
  onAddRelease,
  currentUser
}: ReleasesProps) {
  const { t } = useTranslation();

  // state for release creation
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  
  // chosen items to package
  const [items, setItems] = useState<Array<{ workflowId: string; workflowName: string; versionId: string; versionNumber: number }>>([]);
  
  // temporary selector states
  const [selectedWfId, setSelectedWfId] = useState("");
  const [versionsForWf, setVersionsForWf] = useState<WorkflowVersion[]>([]);
  const [selectedVerId, setSelectedVerId] = useState("");

  const selectedWorkflowObj = workflows.find(w => w.id === selectedWfId);

  // Fetch versions whenever the user selects a workflow in the dropdown
  useEffect(() => {
    if (!selectedWfId) {
      setVersionsForWf([]);
      setSelectedVerId("");
      return;
    }
    
    fetch(`/api/workflows/${selectedWfId}/versions`)
      .then(res => res.json())
      .then(data => {
        setVersionsForWf(data);
        if (data.length) setSelectedVerId(data[0].id);
      })
      .catch(e => console.error(e));
  }, [selectedWfId]);

  // Set initial selected workflow
  useEffect(() => {
    if (workflows.length && !selectedWfId) {
      setSelectedWfId(workflows[0].id);
    }
  }, [workflows]);

  const handleAddItem = () => {
    if (!selectedWfId || !selectedVerId) return;
    
    const wfName = workflows.find(w => w.id === selectedWfId)?.name || "";
    const verNum = versionsForWf.find(v => v.id === selectedVerId)?.version || 1;
    
    // Check if workflow already exists in this release list
    if (items.some(it => it.workflowId === selectedWfId)) {
      alert("Este workflow já foi adicionado a esta release. Caso queira usar outra versão, remova-o primeiro.");
      return;
    }

    setItems([...items, {
      workflowId: selectedWfId,
      workflowName: wfName,
      versionId: selectedVerId,
      versionNumber: verNum
    }]);
  };

  const handleRemoveItem = (wfId: string) => {
    setItems(items.filter(it => it.workflowId !== wfId));
  };

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || items.length === 0) return;
    
    try {
      const res = await onAddRelease(name, desc, items);
      if (res) {
        setShowAdd(false);
        setName("");
        setDesc("");
        setItems([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canManage = ["Administrator", "Release Manager"].includes(currentUser?.role || "");

  return (
    <div id="releases-container-root" className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">{t("releases.title")}</h2>
          <p className="text-xs text-[#8b949e]">Agrupamento estruturado de workflows versionados para homologação e auditoria</p>
        </div>
        
        {canManage && (
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold font-display rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("releases.create_release")}
          </button>
        )}
      </div>

      {!canManage && (
        <div className="p-3.5 bg-rose-500/5 rounded-lg border border-rose-500/10 flex items-center gap-2.5 text-xs text-rose-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span>Apenas perfis Administrator e Release Manager possuem privilégios para gerar novas releases.</span>
        </div>
      )}

      {/* Grid of registered releases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {releases.map((rel) => (
          <div key={rel.id} className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold font-display text-white text-base tracking-tight">{rel.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-[#8b949e]">{rel.id}</span>
              </div>
              
              <p className="text-xs text-[#8b949e]">{rel.description || "Nenhuma descrição."}</p>

              {/* Pack items list */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase">COMPONENTES ENVELOPADOS:</span>
                <div className="space-y-1.5">
                  {rel.items.map((it) => (
                    <div key={it.id} className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#c9d1d9]">{it.workflowName}</span>
                      <span className="font-mono text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 text-[10px] font-bold">
                        COMMIT v{it.versionNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Release Footer Metadata */}
            <div className="flex justify-between items-center pt-3 border-t border-[#30363d] text-[10px] font-mono text-[#8b949e]">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Criador: {rel.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(rel.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Archive className="w-5 h-5 text-amber-500" />
              Empacotar Nova Release estável
            </h3>
            
            <form onSubmit={handleCreateRelease} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">{t("releases.release_name")}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Release 1.2.0-Patch3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">{t("releases.description")}</label>
                  <input
                    type="text"
                    required
                    placeholder="Objetivo e modificações principais"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Sub area: Select element to add */}
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t("releases.select_workflow_vers")}</h4>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <label className="block text-[10px] font-mono text-[#8b949e] mb-1">CÓPIA DO WORKFLOW</label>
                    <select
                      value={selectedWfId}
                      onChange={(e) => setSelectedWfId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-md text-white focus:outline-none"
                    >
                      {workflows.map((w) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-[10px] font-mono text-[#8b949e] mb-1">VERSÃO DISPONÍVEL</label>
                    <select
                      value={selectedVerId}
                      onChange={(e) => setSelectedVerId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-md text-white focus:outline-none"
                    >
                      {versionsForWf.map((v) => (
                        <option key={v.id} value={v.id}>Versão: {v.version} - {v.comment}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full py-1.5 bg-amber-500 text-black text-xs font-bold rounded-md hover:bg-amber-600 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                      Anexar
                    </button>
                  </div>
                </div>
              </div>

              {/* Items currently added */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">Workflows empacotados nesta Release:</label>
                {items.length === 0 ? (
                  <div className="p-4 bg-[#0d1117] rounded-lg border border-dashed border-[#30363d] text-center text-xs text-[#8b949e]">
                    Adicione pelo menos um workflow-versão para gerar o pacote de release.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {items.map((it) => (
                      <div key={it.workflowId} className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-white">{it.workflowName}</span>
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20 text-[10px] font-mono font-bold">
                            Commit v{it.versionNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(it.workflowId)}
                          className="text-[#8b949e] hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-[#21262d] text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-800"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirmar Envelopamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
