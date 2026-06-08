import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Plus, ShieldCheck, Mail, Check, X, Shield, Lock, Info } from "lucide-react";
import { User, Role } from "../types";

interface UsersProps {
  users: User[];
  onAddUser: (name: string, email: string, role: Role) => Promise<any>;
  currentUser: any;
}

export default function UsersPage({
  users,
  onAddUser,
  currentUser
}: UsersProps) {
  const { t } = useTranslation();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(Role.Developer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RBAC Permission Grid Matrix Definition
  const permissionsMatrix = [
    { module: "Dashboard & Telemetria", admin: true, manager: true, developer: true, viewer: true },
    { module: "Modelar e Commitar Versões JSONB", admin: true, manager: false, developer: true, viewer: false },
    { module: "Criar Pacotes de Releases", admin: true, manager: true, developer: false, viewer: false },
    { module: "Deploy em DEV, QA, HOMOLOG", admin: true, manager: true, developer: true, viewer: false },
    { module: "Deploy de Alta Crise em PROD", admin: true, manager: true, developer: false, viewer: false },
    { module: "Rollback Emergencial em Produção", admin: true, manager: true, developer: false, viewer: false },
    { module: "Cadastrar/Remover Ambientes n8n", admin: true, manager: false, developer: false, viewer: false },
    { module: "Gerenciar Usuários e Perfis RBAC", admin: true, manager: false, developer: false, viewer: false }
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddUser(name, email, role);
      setShowAdd(false);
      setName("");
      setEmail("");
      setRole(Role.Developer);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = currentUser?.role === "Administrator";

  return (
    <div id="users-page-root" className="grid grid-cols-12 gap-6 animate-fadeIn">
      
      {/* 1. USERS LIST & ADMINISTRATION FORM (LEFT) */}
      <div className="col-span-12 md:col-span-6 space-y-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              {t("users.title")}
            </h3>
            {isAdmin && (
              <button
                onClick={() => setShowAdd(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 font-display font-bold text-black text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                Convidar
              </button>
            )}
          </div>

          {!isAdmin && (
            <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 text-[11px] font-mono text-amber-500 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Apenas administradores podem gerenciar novos operadores ou perfis de credencial.</span>
            </div>
          )}

          {/* User cards */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {users.map((u) => {
              const rootUsr = u.email === currentUser?.email;
              return (
                <div key={u.id} className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg hover:border-zinc-500 transition-all flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#21262d] text-white font-bold flex items-center justify-center text-xs border border-[#30363d]">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                        {u.name}
                        {rootUsr && (
                          <span className="px-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] uppercase tracking-wide rounded">
                            VOCÊ
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold inline-block border ${
                      u.role === "Administrator" 
                        ? "bg-rose-500/5 text-rose-400 border-rose-900/30" 
                        : u.role === "Release Manager"
                        ? "bg-[#1f6feb]/5 text-sky-400 border-[#1f6feb]/30"
                        : u.role === "Developer"
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}>
                      {u.role}
                    </span>
                    <span className="text-[9px] text-[#8b949e] font-mono block">ID: {u.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. RBAC VISUAL PERMISSIONS MATRIX (RIGHT) */}
      <div className="col-span-12 md:col-span-6 bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {t("users.permissions_matrix")}
          </h3>
          <p className="text-xs text-[#8b949e]">Visualização de políticas RBAC (Role-Based Access Control) seguras</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono text-zinc-300">
            <thead>
              <tr className="bg-[#0b0e14] text-[#8b949e]">
                <th className="p-2.5">Recurso do Módulo</th>
                <th className="p-2.5 text-center">Adm</th>
                <th className="p-2.5 text-center">Rel</th>
                <th className="p-2.5 text-center">Dev</th>
                <th className="p-2.5 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {permissionsMatrix.map((item) => (
                <tr key={item.module} className="hover:bg-[#21262d]/25 transition-colors">
                  <td className="p-2.5 font-sans text-xs text-zinc-200">{item.module}</td>
                  <td className="p-2.5 text-center">{item.admin ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-rose-500" />}</td>
                  <td className="p-2.5 text-center">{item.manager ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-rose-500" />}</td>
                  <td className="p-2.5 text-center">{item.developer ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-rose-500" />}</td>
                  <td className="p-2.5 text-center">{item.viewer ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-rose-500" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Convidar Operador de Sistemas</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Endereço de E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: carlos@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Perfil de Acesso (RBAC Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white"
                >
                  <option value={Role.Admin}>{Role.Admin}</option>
                  <option value={Role.ReleaseManager}>{Role.ReleaseManager}</option>
                  <option value={Role.Developer}>{Role.Developer}</option>
                  <option value={Role.Viewer}>{Role.Viewer}</option>
                </select>
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
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg cursor-pointer"
                >
                  {isSubmitting ? t("common.loading") : "Convidar Operador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
