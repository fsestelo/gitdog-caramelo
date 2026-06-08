import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dog, ShieldAlert, Key, UserCheck, Lock } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("SecretCarameloBcryptPassword99");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.error || "Credenciais inválidas");
      }
    } catch (err) {
      console.error(err);
      setError("Falha de conexão com o servidor local.");
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setError("");
  };

  return (
    <div id="login-container" className="min-h-screen bg-[#0d1117] flex font-sans items-center justify-center p-4">
      {/* Visual glowing layout */}
      <div className="absolute inset-0 bg-[#30363d] opacity-[0.05] pointer-events-none" style={{
        backgroundImage: "radial-gradient(#c9d1d9 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px"
      }}></div>

      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center text-black shadow-lg">
            <Dog className="w-9 h-9 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              gitdog <span className="text-amber-500 font-mono text-xs uppercase font-bold tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10 ml-1">caramelo</span>
            </h1>
            <p className="text-xs text-[#8b949e]">{t("login.subtitle")}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">{t("login.email")}</label>
            <input
              type="email"
              required
              placeholder="operator@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium text-xs focus:outline-none focus:border-amber-500 placeholder-zinc-600 focus:ring-1 focus:ring-amber-500/15"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-zinc-300">{t("login.password")}</label>
              <span className="text-[10px] font-mono text-zinc-500 select-none flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                Bcrypt
              </span>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-medium text-xs focus:outline-none focus:border-amber-500 placeholder-zinc-600 focus:ring-1 focus:ring-amber-500/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-extrabold font-display rounded-lg tracking-wide transition-all text-xs uppercase cursor-pointer"
          >
            {loading ? t("common.loading") : t("login.submit")}
          </button>
        </form>

        <hr className="border-[#30363d]" />

        {/* Quick RBAC Shortcuts Panel */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-mono font-bold text-amber-500 tracking-wider uppercase text-center flex items-center justify-center gap-1">
            <Key className="w-3.5 h-3.5" />
            Clique para Preencher Atalho (Demonstração)
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectDemoUser("fsestelo@gmail.com")}
              className="p-2.5 bg-[#0d1117] border border-[#30363d] hover:border-amber-500 rounded-lg text-left text-[10px] transition-all cursor-pointer group"
            >
              <span className="block font-bold text-zinc-100 uppercase font-display leading-none group-hover:text-amber-500">Administrator</span>
              <span className="block text-[#8b949e] font-mono mt-1 text-[9px] truncate">fsestelo@gmail.com</span>
            </button>

            <button
              onClick={() => selectDemoUser("jane@gitdog.com")}
              className="p-2.5 bg-[#0d1117] border border-[#30363d] hover:border-amber-500 rounded-lg text-left text-[10px] transition-all cursor-pointer group"
            >
              <span className="block font-bold text-zinc-100 uppercase font-display leading-none group-hover:text-amber-500 text-[9px]">Release Manager</span>
              <span className="block text-[#8b949e] font-mono mt-1 text-[9px] truncate">jane@gitdog.com</span>
            </button>

            <button
              onClick={() => selectDemoUser("thiago@gitdog.com")}
              className="p-2.5 bg-[#0d1117] border border-[#30363d] hover:border-amber-500 rounded-lg text-left text-[10px] transition-all cursor-pointer group"
            >
              <span className="block font-bold text-zinc-100 uppercase font-display leading-none group-hover:text-amber-500">Developer</span>
              <span className="block text-[#8b949e] font-mono mt-1 text-[9px] truncate">thiago@gitdog.com</span>
            </button>

            <button
              onClick={() => selectDemoUser("alice@gitdog.com")}
              className="p-2.5 bg-[#0d1117] border border-[#30363d] hover:border-amber-500 rounded-lg text-left text-[10px] transition-all cursor-pointer group"
            >
              <span className="block font-bold text-zinc-100 uppercase font-display leading-none group-hover:text-amber-500 font-display">Viewer</span>
              <span className="block text-[#8b949e] font-mono mt-1 text-[9px] truncate">alice@gitdog.com</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
