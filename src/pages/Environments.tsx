import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Server, HelpCircle, Plus, Activity, CheckCircle, AlertOctagon, Trash2, Key, Info } from "lucide-react";
import { Environment } from "../types";

interface EnvironmentsProps {
  environments: Environment[];
  onAddEnvironment: (name: string, description: string, url: string, apiKey: string) => Promise<any>;
  onDeleteEnvironment: (id: string) => Promise<any>;
  currentUser: any;
}

export default function Environments({
  environments,
  onAddEnvironment,
  onDeleteEnvironment,
  currentUser
}: EnvironmentsProps) {
  const { t } = useTranslation();
  
  // connection test state: map of environmentId -> "idle" | "testing" | "success" | "error"
  const [testStates, setTestStates] = useState<Record<string, "idle" | "testing" | "success" | "error">>({});
  const [testMessages, setTestMessages] = useState<Record<string, string>>({});

  // add modal state
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestConnection = async (envId: string) => {
    setTestStates(prev => ({ ...prev, [envId]: "testing" }));
    try {
      const res = await fetch(`/api/environments/${envId}/test`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTestStates(prev => ({ ...prev, [envId]: "success" }));
        setTestMessages(prev => ({ ...prev, [envId]: data.message }));
      } else {
        setTestStates(prev => ({ ...prev, [envId]: "error" }));
        setTestMessages(prev => ({ ...prev, [envId]: data.error || "Erro de Conexão." }));
      }
    } catch (e) {
      setTestStates(prev => ({ ...prev, [envId]: "error" }));
      setTestMessages(prev => ({ ...prev, [envId]: "Sem resposta do cluster." }));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !apiKey) return;
    setIsSubmitting(true);
    try {
      await onAddEnvironment(name, desc, url, apiKey);
      setShowAdd(false);
      setName("");
      setDesc("");
      setUrl("");
      setApiKey("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = currentUser?.role === "Administrator";

  return (
    <div id="environments-container-root" className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">{t("environments.title")}</h2>
          <p className="text-xs text-[#8b949e]">Contratos OpenAPI e API Keys para as instâncias ativas do n8n</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold font-display rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("environments.add_new")}
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="p-3.5 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-center gap-2.5 text-xs text-amber-500 font-mono">
          <Info className="w-4 h-4 text-amber-500" />
          <span>Apenas Administradores possuem privilégios para registrar ou remover clusters n8n.</span>
        </div>
      )}

      {/* Grid of environment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {environments.map((env) => {
          const testState = testStates[env.id] || "idle";
          const testMsg = testMessages[env.id] || "";
          
          return (
            <div key={env.id} className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-between space-y-5 relative overflow-hidden group">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold font-display text-white tracking-tight flex items-center gap-1.5">
                      <Server className="w-4.5 h-4.5 text-amber-500" />
                      {env.name}
                    </h3>
                    <p className="text-xs text-[#8b949e] mt-1">{env.description || "Nenhuma descrição fornecida."}</p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    env.status === "ONLINE" 
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-900" 
                      : "bg-rose-950/40 text-rose-400 border-rose-900"
                  }`}>
                    ● {env.status}
                  </span>
                </div>

                <div className="p-3 bg-[#0d1117] rounded-lg space-y-2 border border-[#30363d]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8b949e] font-mono">ENDPOINT URL:</span>
                    <a href={env.url} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline font-mono truncate max-w-xs">{env.url}</a>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-[#8b949e] font-mono">API KEY TOKEN:</span>
                    <span className="font-mono text-zinc-500 text-[11px] select-none flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      ********* {env.apiKey.substring(env.apiKey.length - 4)}
                    </span>
                  </div>
                </div>

                {/* Connection check logs */}
                {testState !== "idle" && (
                  <div className={`p-2.5 rounded-lg text-[11px] font-mono border ${
                    testState === "testing" 
                      ? "bg-zinc-950/40 text-zinc-400 border-zinc-800" 
                      : testState === "success"
                      ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40"
                      : "bg-rose-950/20 text-rose-400 border-rose-900/40"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Activity className={`w-3.5 h-3.5 ${testState === "testing" ? "animate-spin text-amber-500" : ""}`} />
                      <span>{testState === "testing" ? "Contatando n8n API. Carregando payload..." : testMsg}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleTestConnection(env.id)}
                  disabled={testState === "testing"}
                  className="px-3 py-1.5 bg-[#21262d] hover:bg-zinc-800 disabled:bg-zinc-900 text-zinc-200 border border-[#30363d] rounded-lg text-xs font-bold font-display cursor-pointer transition-colors"
                >
                  {t("environments.test_connection")}
                </button>

                {isAdmin && (
                  <button
                    onClick={() => onDeleteEnvironment(env.id)}
                    className="p-1 px-2 hover:bg-rose-950/30 text-rose-500 border border-transparent hover:border-rose-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("common.delete")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Registrar Servidor n8n Remoto</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">{t("environments.name")}</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: PROD-US"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-amber-500 font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição do escopo</label>
                <input
                  type="text"
                  placeholder="Ex: Servidores em cloud homologação"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">{t("environments.url")}</label>
                <input
                  type="url"
                  required
                  placeholder="https://n8n.prod.mycompany.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">{t("environments.api_key")}</label>
                <input
                  type="password"
                  required
                  placeholder="n8n_api_key_xxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-[#21262d] text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-800"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg cursor-pointer"
                >
                  {isSubmitting ? t("common.loading") : t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
