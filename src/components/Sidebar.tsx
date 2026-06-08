import React from "react";
import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard, 
  GitBranch, 
  Server, 
  Tag, 
  Send, 
  ShieldAlert, 
  Users, 
  LogOut, 
  Languages, 
  Settings, 
  Dog 
} from "lucide-react";
import { User } from "../types";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onLanguageChange: (lang: "pt-BR" | "en-US" | "es-ES") => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onLogout, 
  onLanguageChange 
}: SidebarProps) {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "workflows", label: t("nav.workflows"), icon: GitBranch },
    { id: "environments", label: t("nav.environments"), icon: Server },
    { id: "releases", label: t("nav.releases"), icon: Tag },
    { id: "deploy", label: t("nav.deploy"), icon: Send },
    { id: "audit", label: t("nav.audit"), icon: ShieldAlert },
    { id: "users", label: t("nav.users"), icon: Users }
  ];

  const handleLangToggle = (lang: "pt-BR" | "en-US" | "es-ES") => {
    onLanguageChange(lang);
  };

  return (
    <aside id="app-sidebar" className="w-68 bg-[#0d1117] border-r border-[#30363d] flex flex-col justify-between h-screen sticky top-0">
      {/* Upper Brand Section */}
      <div>
        <div className="p-5 border-b border-[#30363d] flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg text-black">
            <Dog className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white leading-none tracking-tight">
              gitdog
            </h1>
            <span className="text-[10px] font-mono text-amber-500 font-semibold tracking-widest uppercase">
              caramelo
            </span>
          </div>
        </div>

        {/* Navigation Elements */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 font-medium ${
                  isActive 
                    ? "bg-[#21262d] text-white border-l-4 border-amber-500" 
                    : "text-[#8b949e] hover:bg-[#161b22] hover:text-white"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? "text-amber-500" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Information & Settings */}
      <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
        {currentUser && (
          <div className="mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs border-2 border-amber-600">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-semibold text-white truncate">{currentUser.name}</h4>
                <p className="text-[10px] font-mono text-amber-400 font-medium">{currentUser.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Language Selection Bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-1.5 text-[#8b949e]">
            <Languages className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{t("nav.language")}:</span>
          </div>
          <div className="flex gap-1">
            {(["pt-BR", "en-US", "es-ES"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangToggle(lang)}
                className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${
                  i18n.language === lang 
                    ? "bg-amber-500 text-black border-amber-600" 
                    : "bg-[#21262d] text-[#8b949e] border-[#30363d] hover:bg-zinc-800"
                }`}
              >
                {lang.split("-")[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-[#21262d] hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-[#30363d] hover:border-rose-900 rounded-md text-xs font-medium cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          {t("common.logout")}
        </button>
      </div>
    </aside>
  );
}
