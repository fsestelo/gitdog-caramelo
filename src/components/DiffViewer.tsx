import React from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, MinusCircle, HelpCircle, ArrowRight, GitCompare, CheckCircle2 } from "lucide-react";
import { WorkflowVersion } from "../types";

interface DiffViewerProps {
  versionLeft: WorkflowVersion | null;
  versionRight: WorkflowVersion | null;
}

export default function DiffViewer({ versionLeft, versionRight }: DiffViewerProps) {
  const { t } = useTranslation();

  if (!versionLeft || !versionRight) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#30363d] rounded-lg bg-[#161b22] text-[#8b949e]">
        <GitCompare className="w-12 h-12 mb-3 text-[#30363d] animate-bounce" />
        <p className="text-sm font-medium">{t("workflows.select_versions_compare")}</p>
      </div>
    );
  }

  const nodesLeft = versionLeft.workflowData?.nodes || [];
  const nodesRight = versionRight.workflowData?.nodes || [];

  // Compute analytics
  const nodesLeftMap = new Map(nodesLeft.map(n => [n.id, n]));
  const nodesRightMap = new Map(nodesRight.map(n => [n.id, n]));

  const added: any[] = [];
  const removed: any[] = [];
  const modified: any[] = [];
  const unchanged: any[] = [];

  nodesRight.forEach(node => {
    if (!nodesLeftMap.has(node.id)) {
      added.push(node);
    } else {
      const leftNode = nodesLeftMap.get(node.id)!;
      const isModified = JSON.stringify(leftNode.parameters) !== JSON.stringify(node.parameters) || leftNode.name !== node.name || leftNode.type !== node.type;
      if (isModified) {
        modified.push({ old: leftNode, new: node });
      } else {
        unchanged.push(node);
      }
    }
  });

  nodesLeft.forEach(node => {
    if (!nodesRightMap.has(node.id)) {
      removed.push(node);
    }
  });

  const totalChanges = added.length + removed.length + modified.length;

  return (
    <div id="diff-viewer-root" className="space-y-6">
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8b949e] uppercase font-mono">{t("workflows.diff_added")}</p>
            <h4 className="text-2xl font-bold text-emerald-500 font-display mt-1">+{added.length}</h4>
          </div>
          <PlusCircle className="w-8 h-8 text-emerald-500/20" />
        </div>

        <div className="p-4 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8b949e] uppercase font-mono">{t("workflows.diff_removed")}</p>
            <h4 className="text-2xl font-bold text-rose-500 font-display mt-1">-{removed.length}</h4>
          </div>
          <MinusCircle className="w-8 h-8 text-rose-500/20" />
        </div>

        <div className="p-4 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8b949e] uppercase font-mono">{t("workflows.diff_modified")}</p>
            <h4 className="text-2xl font-bold text-amber-500 font-display mt-1">{modified.length}</h4>
          </div>
          <HelpCircle className="w-8 h-8 text-amber-500/20" />
        </div>

        <div className="p-4 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8b949e] uppercase font-mono">Status</p>
            <span className={`px-2 py-0.5 rounded text-xs inline-block mt-2 ${totalChanges > 0 ? "bg-amber-950/40 text-amber-500 font-medium border border-amber-900" : "bg-emerald-950/40 text-emerald-400 font-medium border border-emerald-900"}`}>
              {totalChanges > 0 ? "Diferente" : "Idêntico"}
            </span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-sky-500/20" />
        </div>
      </div>

      {totalChanges === 0 ? (
        <div className="p-8 border border-[#30363d] rounded-lg bg-[#161b22] text-center text-[#8b949e]">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
          <p className="text-sm">{t("workflows.diff_no_changes")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side: OLD VERSION */}
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <span className="text-xs font-mono font-bold text-[#8b949e] uppercase">{t("workflows.v_left")}</span>
              <h5 className="text-sm font-semibold text-white mt-1">v{versionLeft.version}</h5>
              <p className="text-xs text-[#8b949e] truncate mt-0.5">"{versionLeft.comment}"</p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {removed.map((node) => (
                <div key={node.id} className="p-3 bg-rose-950/15 border border-rose-900/40 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 font-mono text-[10px] rounded border border-rose-800/40 uppercase">DELETED</span>
                    <h6 className="text-xs font-semibold text-rose-200 mt-1">{node.name}</h6>
                    <p className="text-[10px] text-rose-400 font-mono mt-0.5">{node.type}</p>
                  </div>
                </div>
              ))}

              {modified.map(({ old }) => (
                <div key={old.id} className="p-3 bg-amber-950/15 border border-amber-900/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] rounded border border-amber-800/40 uppercase">MODIFIED</span>
                    <span className="text-[10px] font-mono text-[#8b949e]">{old.id}</span>
                  </div>
                  <h6 className="text-xs font-semibold text-amber-200 mt-1">{old.name}</h6>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">{old.type}</p>
                  <pre className="mt-2 text-[10px] bg-black/40 p-2 rounded text-[#8b949e] font-mono overflow-x-auto max-h-24">
                    {JSON.stringify(old.parameters, null, 2)}
                  </pre>
                </div>
              ))}

              {unchanged.map((node) => (
                <div key={node.id} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg opacity-40">
                  <h6 className="text-xs font-semibold text-[#8b949e]">{node.name}</h6>
                  <p className="text-[10px] text-[#8b949e] font-mono">{node.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: NEW VERSION */}
          <div className="space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <span className="text-xs font-mono font-bold text-[#8b949e] uppercase">{t("workflows.v_right")}</span>
              <h5 className="text-sm font-semibold text-white mt-1">v{versionRight.version}</h5>
              <p className="text-xs text-[#8b949e] truncate mt-0.5">"{versionRight.comment}"</p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {added.map((node) => (
                <div key={node.id} className="p-3 bg-emerald-950/15 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded border border-emerald-800/40 uppercase">ADDED</span>
                    <h6 className="text-xs font-semibold text-emerald-200 mt-1">{node.name}</h6>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{node.type}</p>
                  </div>
                </div>
              ))}

              {modified.map(({ old, new: nNode }) => (
                <div key={nNode.id} className="p-3 bg-amber-950/15 border border-amber-900/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] rounded border border-amber-800/40 uppercase">MODIFIED</span>
                    <span className="text-[10px] font-mono text-[#8b949e]">{nNode.id}</span>
                  </div>
                  <h6 className="text-xs font-semibold text-amber-200 mt-1">{nNode.name}</h6>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">{nNode.type}</p>
                  <pre className="mt-2 text-[10px] bg-black/40 p-2 rounded text-[#c9d1d9] font-mono overflow-x-auto max-h-24">
                    {JSON.stringify(nNode.parameters, null, 2)}
                  </pre>
                </div>
              ))}

              {unchanged.map((node) => (
                <div key={node.id} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg opacity-40">
                  <h6 className="text-xs font-semibold text-[#8b949e]">{node.name}</h6>
                  <p className="text-[10px] text-[#8b949e] font-mono">{node.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
