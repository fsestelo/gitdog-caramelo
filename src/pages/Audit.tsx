import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, Search, SlidersHorizontal, ArrowDownWideNarrow, ShieldCheck, AlertCircle, Eye, Info } from "lucide-react";
import { AuditLog } from "../types";

interface AuditProps {
  auditLogs: AuditLog[];
}

export default function Audit({ auditLogs }: AuditProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  // Get distinct actions for dropdown filtering
  const distinctActions = ["ALL", ...Array.from(new Set(auditLogs.map(l => l.action)))];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.objectAffected.toLowerCase().includes(search.toLowerCase());
      
    const matchesAction = filterAction === "ALL" || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div id="audit-logs-root" className="space-y-6 animate-fadeIn">
      {/* Upper header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">{t("audit.title")}</h2>
          <p className="text-xs text-[#8b949e]">Trilha de segurança criptográfica de todas as alterações cadastrada em PostgreSQL</p>
        </div>
        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full font-mono text-xs border border-amber-500/20 font-bold">
          TOTAL LOGS: {auditLogs.length}
        </span>
      </div>

      {/* Filter and selector rail */}
      <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#8b949e] absolute top-2.5 left-3" />
          <input
            type="text"
            placeholder="Pesquisar por operador, ID do workflow ou detalhes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Action Dropdown */}
        <div className="md:col-span-4 relative flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#8b949e] shrink-0" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-amber-500"
          >
            {distinctActions.map(act => (
              <option key={act} value={act}>{act === "ALL" ? "Todos as Operações" : act}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 text-right">
          <span className="text-[10px] font-mono text-[#8b1010] bg-rose-500/5 px-2 py-1.5 rounded border border-rose-900/10 font-bold uppercase">
            🛡️ IMMUTABLE
          </span>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e] font-mono">
                <th className="p-4">{t("audit.table_user")}</th>
                <th className="p-4">{t("audit.table_action")}</th>
                <th className="p-4">Descrição da Atividade</th>
                <th className="p-4">{t("audit.table_object")}</th>
                <th className="p-4">Ambiente</th>
                <th className="p-4">{t("audit.table_ip")}</th>
                <th className="p-4 text-center">{t("audit.table_result")}</th>
                <th className="p-4 text-right">{t("audit.table_date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 font-mono">
                    Nenhum registro de auditoria coincide com a busca.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#21262d]/25 transition-colors text-zinc-300">
                    <td className="p-4 font-semibold text-white truncate max-w-[150px]">
                      {log.userName}
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-500">
                      {log.action}
                    </td>
                    <td className="p-4 italic max-w-xs truncate">
                      "{log.details}"
                    </td>
                    <td className="p-4 font-mono text-[11px] text-zinc-400">
                      {log.objectAffected}
                    </td>
                    <td className="p-4 font-bold font-display text-zinc-100">
                      {log.environmentName || "GLOBAL"}
                    </td>
                    <td className="p-4 font-mono text-zinc-500">
                      {log.ip}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium inline-block ${
                        log.result === "SUCCESS" 
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900" 
                          : "bg-rose-950/40 text-rose-400 border border-rose-900"
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[#8b949e] font-mono text-[10px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
