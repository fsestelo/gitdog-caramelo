import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Edit2, Play, GitFork, Save, Info } from "lucide-react";
import { WorkflowNode, WorkflowData } from "../types";

interface WorkflowEditorMiniProps {
  workflowId: string;
  workflowName: string;
  initialNodes: WorkflowNode[];
  onSaveVersion: (workflowData: WorkflowData, comment: string) => Promise<void>;
  isSaving: boolean;
}

const AVAILABLE_NODE_TYPES = [
  { type: "n8n-nodes-base.webhook", label: "Stripe Webhook Trigger", icon: "🌐" },
  { type: "n8n-nodes-base.hubspot", label: "HubSpot CRM Sync", icon: "🧡" },
  { type: "n8n-nodes-base.slack", label: "Slack Chat Alerter", icon: "💬" },
  { type: "n8n-nodes-base.postgres", label: "PostgreSQL Database Query", icon: "🐘" },
  { type: "n8n-nodes-base.emailSend", label: "Email SMTP Send", icon: "✉️" },
  { type: "n8n-nodes-base.if", label: "IF Conditional filter", icon: "🔀" }
];

export default function WorkflowEditorMini({
  workflowId,
  workflowName,
  initialNodes,
  onSaveVersion,
  isSaving
}: WorkflowEditorMiniProps) {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<WorkflowNode[]>(() => {
    // Clone nodes so we do not mutate inputs
    return initialNodes.length ? JSON.parse(JSON.stringify(initialNodes)) : [
      { id: "n-1", name: "Start Hook", type: "n8n-nodes-base.webhook", position: [100, 200], parameters: { path: "/trigger" } }
    ];
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [comment, setComment] = useState("");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeType, setNewNodeType] = useState(AVAILABLE_NODE_TYPES[0].type);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleAddNode = () => {
    if (!newNodeName.trim()) return;
    const item = AVAILABLE_NODE_TYPES.find(t => t.type === newNodeType);
    const node: WorkflowNode = {
      id: `n-${Date.now()}`,
      name: newNodeName,
      type: newNodeType,
      position: [nodes.length * 150 + 100, 200],
      parameters: item?.type === "n8n-nodes-base.webhook" 
        ? { path: "/custom-endpoint" } 
        : item?.type === "n8n-nodes-base.slack" 
        ? { channel: "#general", text: "Alert: System active" }
        : { action: "process" }
    };

    setNodes([...nodes, node]);
    setSelectedNodeId(node.id);
    setNewNodeName("");
  };

  const handleDeleteNode = (id: string) => {
    const updated = nodes.filter(n => n.id !== id);
    setNodes(updated);
    if (selectedNodeId === id) {
      setSelectedNodeId(updated[0]?.id || null);
    }
  };

  const handleUpdateParameter = (key: string, value: any) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          parameters: {
            ...n.parameters,
            [key]: value
          }
        };
      }
      return n;
    }));
  };

  const handleUpdateName = (value: string) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          name: value
        };
      }
      return n;
    }));
  };

  const handleSave = () => {
    if (!comment.trim()) {
      alert("Por favor, digite um comentário explicativo para a nova versão (Commit Message)");
      return;
    }
    const flowData: WorkflowData = {
      nodes,
      connections: {}
    };
    onSaveVersion(flowData, comment).then(() => {
      setComment("");
    });
  };

  return (
    <div id="visual-editor-container" className="grid grid-cols-12 gap-6 p-4 bg-[#161b22] border border-[#30363d] rounded-xl">
      
      {/* 1. NODE CANVAS LIST */}
      <div className="col-span-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-semibold text-white font-display flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-amber-500" />
              {workflowName}
            </h5>
            <p className="text-xs text-[#8b949e]">Modelagem visual e injeção em banco de dados</p>
          </div>
          
          <div className="flex gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 bg-[#21262d] border border-[#30363d] rounded text-[#8b949e]">
              Nodes: {nodes.length}
            </span>
          </div>
        </div>

        {/* Visual Simulated Canvas */}
        <div className="h-80 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 relative overflow-hidden flex flex-wrap gap-4 items-center justify-center">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: "radial-gradient(#c9d1d9 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}></div>

          {nodes.length === 0 ? (
            <p className="text-xs font-mono text-[#8b949e]">Tela vazia. Adicione um nó n8n para começar.</p>
          ) : (
            nodes.map((node, i) => {
              const info = AVAILABLE_NODE_TYPES.find(t => t.type === node.type);
              const isSelected = node.id === selectedNodeId;
              return (
                <div key={node.id} className="flex items-center">
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-44 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-[#21262d] border-amber-500 ring-2 ring-amber-500/15 text-white" 
                        : "bg-[#161b22] border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{info?.icon || "⚙️"}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                        className="text-[#8b949e] hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h6 className="text-xs font-bold font-display mt-2 truncate">{node.name}</h6>
                    <p className="text-[9px] font-mono text-[#8b949e] truncate mt-0.5">{node.type.split(".").pop()}</p>
                  </div>
                  {i < nodes.length - 1 && (
                    <div className="w-6 h-0.5 bg-dashed border-[#30363d] flex items-center justify-center relative">
                      <ArrowRightIcon />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Node Creation Control */}
        <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center gap-3">
          <input
            type="text"
            placeholder={t("workflows.node_name")}
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-amber-500"
          />
          <select
            value={newNodeType}
            onChange={(e) => setNewNodeType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#161b22] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:border-amber-500"
          >
            {AVAILABLE_NODE_TYPES.map((t) => (
              <option key={t.type} value={t.type}>{t.label}</option>
            ))}
          </select>
          <button
            onClick={handleAddNode}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 font-bold text-black font-display text-xs rounded-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("workflows.add_node")}
          </button>
        </div>
      </div>

      {/* 2. NODE PROPERTIES & COMMIT DIALOG */}
      <div className="col-span-4 border-l border-[#30363d] pl-4 space-y-4">
        {selectedNode ? (
          <div className="space-y-3">
            <h6 className="text-xs font-bold text-white font-display uppercase tracking-wider text-amber-500">
              Propriedades do Nó
            </h6>
            
            <div>
              <label className="block text-[10px] font-mono text-[#8b949e] mb-1">NÓ N8N NOME</label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => handleUpdateName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {selectedNode.parameters && Object.keys(selectedNode.parameters).map((key) => (
              <div key={key}>
                <label className="block text-[10px] font-mono text-[#8b949e] mb-1">PARÂMETRO: {key.toUpperCase()}</label>
                <input
                  type="text"
                  value={selectedNode.parameters[key]}
                  onChange={(e) => handleUpdateParameter(key, e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            ))}
            
            <div className="pt-2">
              <span className="text-[10px] text-[#8b949e] font-mono block">Node Type Class:</span>
              <span className="text-[10px] text-zinc-500 font-mono block truncate">{selectedNode.type}</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 text-[#8b949e]">
            <Info className="w-6 h-6 mx-auto mb-2 text-[#30363d]" />
            <p className="text-xs">Selecione um nó para gerenciar parâmetros da API n8n.</p>
          </div>
        )}

        <hr className="border-[#30363d] my-4" />

        {/* COMMIT COMPONENT */}
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg space-y-3.5">
          <h6 className="text-xs font-bold text-amber-400 font-display flex items-center gap-1">
            <Save className="w-3.5 h-3.5" />
            {t("workflows.save_changes")}
          </h6>
          
          <textarea
            placeholder={t("workflows.version_comment")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-16 p-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-md text-white focus:outline-none focus:border-amber-500"
          ></textarea>

          <button
            onClick={handleSave}
            disabled={isSaving || nodes.length === 0}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 text-white font-bold font-display text-xs rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSaving ? t("common.loading") : t("workflows.create_version_btn")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Arrow component for n8n representation
function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 text-[#30363d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
