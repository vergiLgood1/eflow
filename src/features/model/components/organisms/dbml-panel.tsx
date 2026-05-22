"use client";

import { useCanvasStore } from "../../store/use-canvas-store";
import { generateDBML } from "../../lib/dbml-converter";
import { dbmlToCanvas, syncCanvasData } from "../../lib/import-utils";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Copy, X, Download, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CanvasNode, RelationshipEdge } from "../../types/canvas";
import { DbmlEditor } from "./dbml-editor";

export function DbmlPanel() {
  const { nodes, edges, isDbmlModeOpen, toggleDbmlMode, setNodes, setEdges } =
    useCanvasStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const syncedCode = useMemo(() => {
    if (!isDbmlModeOpen) return "";
    return generateDBML(nodes as CanvasNode[], edges as RelationshipEdge[]);
  }, [nodes, edges, isDbmlModeOpen]);

  const displayCode = isDirty ? code : syncedCode;

  const handleApply = useCallback(
    (silent = false) => {
      try {
        const { nodes: newNodes, edges: newEdges } = dbmlToCanvas(code);
        const synced = syncCanvasData(
          nodes as CanvasNode[],
          edges as RelationshipEdge[],
          newNodes,
          newEdges,
        );

        setNodes(synced.nodes);
        setEdges(synced.edges);
        setIsDirty(false);
        setError(null);
        if (!silent) toast.success("Changes applied to diagram");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Invalid DBML syntax";
        setError(message);
      }
    },
    [code, nodes, edges, setNodes, setEdges],
  );

  // Just-In-Time (JIT) Auto-apply with 800 ms debounce
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      handleApply(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [code, isDirty, handleApply]);

  if (!isDbmlModeOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
    toast.success("DBML copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([displayCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.dbml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChange = (value: string) => {
    setCode(value);
    setIsDirty(true);
  };

  return (
    <aside className="animate-in slide-in-from-left z-20 flex h-full w-[520px] flex-col border-r bg-[#282c34] shadow-sm duration-300">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-[#3b4048] bg-[#21252b] px-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold tracking-tight text-[#abb2bf]">
            DBML Editor
          </span>
          <span className="rounded bg-[#2c313a] px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-[#636d83] uppercase">
            PostgreSQL
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isDirty && !error && (
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Syncing…
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#636d83] hover:bg-[#2c313a] hover:text-[#abb2bf]"
            onClick={handleDownload}
            title="Download .dbml"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#636d83] hover:bg-[#2c313a] hover:text-[#abb2bf]"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#636d83] hover:bg-[#2c313a] hover:text-[#abb2bf]"
            onClick={toggleDbmlMode}
            title="Close editor"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* CodeMirror editor — fills all remaining space */}
      <div className="flex-1 overflow-hidden text-[13px]">
        <DbmlEditor value={displayCode} onChange={handleChange} />
      </div>

      {/* Status Bar */}
      {error ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 flex items-center gap-2 border-t border-red-900/40 bg-red-950/60 px-4 py-2 text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Syntax Error
            </span>
            <p className="text-[11px] leading-tight opacity-80">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-t border-[#3b4048] bg-[#21252b] px-4 py-1.5 text-[10px] tracking-widest text-[#636d83] uppercase">
          <span>Ready · JIT sync active</span>
          <span>Ctrl+Space for suggestions</span>
        </div>
      )}
    </aside>
  );
}
