"use client";

import { useCanvasStore } from "../../store/use-canvas-store";
import { generateDBML } from "../../lib/dbml-converter";
import { dbmlToCanvas, syncCanvasData } from "../../lib/import-utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { Copy, X, Download, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CanvasNode, RelationshipEdge } from "../../types/canvas";
import { DbmlEditor } from "./dbml-editor";

export function DbmlPanel() {
    const { nodes, edges, isDbmlModeOpen, toggleDbmlMode, setNodes, setEdges } = useCanvasStore();
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Internal flag to prevent recursive canvas→editor→canvas loops
    const isUpdatingFromCanvas = useRef(false);

    // Sync canvas → editor whenever the diagram changes (and user hasn't made unsaved edits)
    useEffect(() => {
        if (isDbmlModeOpen && !isDirty) {
            isUpdatingFromCanvas.current = true;
            const content = generateDBML(nodes as CanvasNode[], edges as RelationshipEdge[]);
            setCode(content);
            setError(null);
            setTimeout(() => { isUpdatingFromCanvas.current = false; }, 100);
        }
    }, [nodes, edges, isDbmlModeOpen, isDirty]);

    const handleApply = useCallback((silent = false) => {
        try {
            const { nodes: newNodes, edges: newEdges } = dbmlToCanvas(code);
            const synced = syncCanvasData(
                nodes as CanvasNode[],
                edges as RelationshipEdge[],
                newNodes,
                newEdges
            );

            setNodes(synced.nodes);
            setEdges(synced.edges);
            setIsDirty(false);
            setError(null);
            if (!silent) toast.success("Changes applied to diagram");
        } catch (e: any) {
            setError(e.message || "Invalid DBML syntax");
        }
    }, [code, nodes, edges, setNodes, setEdges]);

    // Just-In-Time (JIT) Auto-apply with 800 ms debounce
    useEffect(() => {
        if (!isDirty || isUpdatingFromCanvas.current) return;

        const timer = setTimeout(() => {
            handleApply(true);
        }, 800);

        return () => clearTimeout(timer);
    }, [code, isDirty, handleApply]);

    if (!isDbmlModeOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success("DBML copied to clipboard");
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "schema.dbml";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleChange = (value: string) => {
        if (isUpdatingFromCanvas.current) return;
        setCode(value);
        setIsDirty(true);
    };

    return (
        <aside className="w-[520px] border-r bg-[#282c34] flex flex-col h-full shadow-sm z-20 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex h-12 items-center justify-between px-4 border-b border-[#3b4048] bg-[#21252b]">
                <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-sm tracking-tight text-[#abb2bf]">DBML Editor</span>
                    <span className="text-[10px] text-[#636d83] bg-[#2c313a] px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">PostgreSQL</span>
                </div>
                <div className="flex items-center gap-1">
                    {isDirty && !error && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Syncing…
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#636d83] hover:text-[#abb2bf] hover:bg-[#2c313a]"
                        onClick={handleDownload}
                        title="Download .dbml"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#636d83] hover:text-[#abb2bf] hover:bg-[#2c313a]"
                        onClick={handleCopy}
                        title="Copy to clipboard"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#636d83] hover:text-[#abb2bf] hover:bg-[#2c313a]"
                        onClick={toggleDbmlMode}
                        title="Close editor"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* CodeMirror editor — fills all remaining space */}
            <div className="flex-1 overflow-hidden text-[13px]">
                <DbmlEditor value={code} onChange={handleChange} />
            </div>

            {/* Status Bar */}
            {error ? (
                <div className="px-4 py-2 bg-red-950/60 border-t border-red-900/40 flex items-center gap-2 text-red-400 animate-in fade-in slide-in-from-bottom-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Syntax Error</span>
                        <p className="text-[11px] opacity-80 leading-tight">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="px-4 py-1.5 bg-[#21252b] border-t border-[#3b4048] flex items-center justify-between text-[10px] text-[#636d83] uppercase tracking-widest">
                    <span>Ready · JIT sync active</span>
                    <span>Ctrl+Space for suggestions</span>
                </div>
            )}
        </aside>
    );
}
