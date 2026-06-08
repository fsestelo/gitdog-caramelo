import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  User, 
  Environment, 
  Workflow, 
  WorkflowVersion, 
  Release, 
  Deployment, 
  AuditLog, 
  Role 
} from "./types";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Workflows from "./pages/Workflows";
import Environments from "./pages/Environments";
import Releases from "./pages/Releases";
import Deploy from "./pages/Deploy";
import Audit from "./pages/Audit";
import UsersPage from "./pages/Users";
import Login from "./pages/Login";

export default function App() {
  const { t, i18n } = useTranslation();
  
  // Auth state
  const [sessionToken, setSessionToken] = useState<string | null>(() => localStorage.getItem("gitdog_token"));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("gitdog_user");
    return cached ? JSON.parse(cached) : null;
  });

  // Database application tables
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Fetch all entities from backend
  const fetchAllData = async () => {
    if (!sessionToken) return;
    try {
      const [wfRes, envRes, relRes, depRes, audRes, usrRes] = await Promise.all([
        fetch("/api/workflows"),
        fetch("/api/environments"),
        fetch("/api/releases"),
        fetch("/api/deployments"),
        fetch("/api/audit"),
        fetch("/api/users")
      ]);

      if (wfRes.ok) setWorkflows(await wfRes.json());
      if (envRes.ok) setEnvironments(await envRes.json());
      if (relRes.ok) setReleases(await relRes.json());
      if (depRes.ok) setDeployments(await depRes.json());
      if (audRes.ok) setAuditLogs(await audRes.json());
      if (usrRes.ok) setUsers(await usrRes.json());
    } catch (e) {
      console.error("Error reading backend data:", e);
    }
  };

  useEffect(() => {
    if (sessionToken) {
      fetchAllData();
    }
  }, [sessionToken]);

  // Handle successful login
  const handleLoginSuccess = (token: string, user: any) => {
    localStorage.setItem("gitdog_token", token);
    localStorage.setItem("gitdog_user", JSON.stringify(user));
    setSessionToken(token);
    setCurrentUser(user);
    if (user.preferred_language) {
      i18n.changeLanguage(user.preferred_language);
      localStorage.setItem("gitdog_lang", user.preferred_language);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("gitdog_token");
    localStorage.removeItem("gitdog_user");
    setSessionToken(null);
    setCurrentUser(null);
    setCurrentTab("dashboard");
  };

  // Language customization
  const handleLanguageChange = async (lang: "pt-BR" | "en-US" | "es-ES") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("gitdog_lang", lang);

    if (currentUser) {
      try {
        const res = await fetch("/api/auth/update_language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.id, language: lang })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("gitdog_user", JSON.stringify(data.user));
          setCurrentUser(data.user);
          // Refresh users list info on screen
          fetchAllData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Action methods to integrate components with Express API endpoints
  const addWorkflow = async (name: string, description: string) => {
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAllData();
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addVersion = async (workflowId: string, workflowData: any, comment: string) => {
    try {
      const res = await fetch(`/api/workflows/${workflowId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowData,
          comment,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        await fetchAllData();
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addRelease = async (name: string, description: string, items: any[]) => {
    try {
      const res = await fetch("/api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          items,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        await fetchAllData();
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeDeploy = async (deployData: any) => {
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...deployData,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAllData();
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeRollback = async (rollbackData: any) => {
    try {
      const res = await fetch("/api/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rollbackData,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAllData();
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addEnvironment = async (name: string, description: string, url: string, apiKey: string) => {
    try {
      const res = await fetch("/api/environments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          url,
          apiKey,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        await fetchAllData();
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEnvironment = async (id: string) => {
    try {
      const res = await fetch(`/api/environments/${id}?operatorId=${currentUser?.id}&operatorName=${currentUser?.name}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchAllData();
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addUser = async (name: string, email: string, role: Role) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          operatorId: currentUser?.id,
          operatorName: currentUser?.name
        })
      });
      if (res.ok) {
        await fetchAllData();
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch rendered view element based on page control
  const renderCurrentPage = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard
            workflowsCount={workflows.length}
            versionsCount={deployments.length + 5} // simulated versions
            deployments={deployments}
            environments={environments}
            auditLogs={auditLogs}
          />
        );
      case "workflows":
        return (
          <Workflows
            workflows={workflows}
            onAddWorkflow={addWorkflow}
            onAddVersion={addVersion}
            currentUser={currentUser}
          />
        );
      case "environments":
        return (
          <Environments
            environments={environments}
            onAddEnvironment={addEnvironment}
            onDeleteEnvironment={deleteEnvironment}
            currentUser={currentUser}
          />
        );
      case "releases":
        return (
          <Releases
            releases={releases}
            workflows={workflows}
            onAddRelease={addRelease}
            currentUser={currentUser}
          />
        );
      case "deploy":
        return (
          <Deploy
            workflows={workflows}
            releases={releases}
            environments={environments}
            deployments={deployments}
            onExecuteDeploy={executeDeploy}
            onExecuteRollback={executeRollback}
            currentUser={currentUser}
          />
        );
      case "audit":
        return (
          <Audit
            auditLogs={auditLogs}
          />
        );
      case "users":
        return (
          <UsersPage
            users={users}
            onAddUser={addUser}
            currentUser={currentUser}
          />
        );
      default:
        return <div className="text-white text-center p-10">Página em construção.</div>;
    }
  };

  // Main login gate check
  if (!sessionToken || !currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="gitdog-app-shell" className="min-h-screen bg-[#0d1117] flex">
      {/* 1. SIDE BAR DRAWER */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
      />

      {/* 2. CHIEF CONTENT PANEL */}
      <main className="flex-1 p-8 px-10 h-screen overflow-y-auto bg-[#0d1117]">
        {renderCurrentPage()}
      </main>
    </div>
  );
}
