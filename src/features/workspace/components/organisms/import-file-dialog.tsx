"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/shared/components/ui/dropzone";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Columns3,
  FileCode,
  Table2,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { Accept } from "react-dropzone";
import { toast } from "sonner";
import { dbmlToCanvas, sqlToCanvas } from "@/features/model/lib/import-utils";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import type { CanvasNode } from "@/features/model/types/canvas";

// ------------------------------------------------------------------ types ----

type ImportMode = "sql" | "dbml";
type InputTab = "file" | "text";

interface DetectedTable {
  name: string;
  columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
}

// ----------------------------------------------------------------- helpers ---

function parseContent(
  content: string,
  mode: ImportMode,
): { nodes: CanvasNode[]; error: string | null } {
  if (!content.trim()) return { nodes: [], error: null };
  try {
    const { nodes } =
      mode === "dbml" ? dbmlToCanvas(content) : sqlToCanvas(content);
    return { nodes, error: null };
  } catch (err) {
    return {
      nodes: [],
      error: err instanceof Error ? err.message : "Unknown parse error",
    };
  }
}

function nodesToTables(nodes: CanvasNode[]): DetectedTable[] {
  return nodes
    .filter((n) => n.type === "table")
    .map((n) => ({
      name: (n.data as any).name as string,
      columns: ((n.data as any).columns ?? []).map((c: any) => ({
        name: c.name,
        type: c.type,
        isPk: c.isPk,
        isFk: c.isFk,
      })),
    }));
}

// --------------------------------------------------------------- sub-comps ---

function TablePreviewRow({ table }: { table: DetectedTable }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-md border">
      <button
        type="button"
        className="bg-muted/40 hover:bg-muted/60 flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? (
          <ChevronDown className="text-muted-foreground h-3 w-3 shrink-0" />
        ) : (
          <ChevronRight className="text-muted-foreground h-3 w-3 shrink-0" />
        )}
        <Table2 className="text-primary h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{table.name}</span>
        <Badge
          variant="secondary"
          className="ml-auto h-4 shrink-0 px-1.5 text-[10px]"
        >
          {table.columns.length} col{table.columns.length !== 1 ? "s" : ""}
        </Badge>
      </button>

      {expanded && (
        <div className="divide-y border-t">
          {table.columns.map((col) => (
            <div
              key={col.name}
              className="flex items-center gap-2 px-4 py-1.5 text-[11px]"
            >
              <Columns3 className="text-muted-foreground h-3 w-3 shrink-0" />
              <span className="truncate font-medium">{col.name}</span>
              <span className="text-muted-foreground ml-auto shrink-0">
                {col.type}
              </span>
              {col.isPk && (
                <Badge
                  variant="outline"
                  className="h-3.5 border-amber-500 px-1 text-[9px] text-amber-600"
                >
                  PK
                </Badge>
              )}
              {col.isFk && (
                <Badge
                  variant="outline"
                  className="h-3.5 border-blue-500 px-1 text-[9px] text-blue-600"
                >
                  FK
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SchemaPreview({
  nodes,
  error,
  isLoading,
}: {
  nodes: CanvasNode[];
  error: string | null;
  isLoading?: boolean;
}) {
  const tables = useMemo(() => nodesToTables(nodes), [nodes]);

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-6 text-xs">
        Parsing…
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/5 text-destructive rounded-md border px-3 py-2.5 text-xs">
        <span className="font-semibold">Parse error: </span>
        {error}
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-6 text-xs">
        No tables detected yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-foreground text-xs font-semibold">
          Detected schema
        </span>
        <Badge variant="secondary" className="text-[10px]">
          {tables.length} table{tables.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      <ScrollArea className="max-h-[200px]">
        <div className="flex flex-col gap-1 pr-1">
          {tables.map((t) => (
            <TablePreviewRow key={t.name} table={t} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ---------------------------------------------------------------- main comp --

const FILE_ACCEPT: Record<ImportMode, Accept> = {
  sql: { "text/plain": [".sql"], "application/sql": [".sql"] },
  dbml: { "text/plain": [".dbml"] },
};

interface ImportFileDialogProps {
  /** If provided, renders as a controlled trigger */
  children?: React.ReactNode;
  /** Which parser to use. Defaults to auto-detect from file extension or "dbml" for text tab */
  defaultMode?: ImportMode;
}

export function ImportFileDialog({
  children,
  defaultMode = "dbml",
}: ImportFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ImportMode>(defaultMode);
  const [inputTab, setInputTab] = useState<InputTab>("file");
  const [files, setFiles] = useState<File[]>();
  const [textContent, setTextContent] = useState("");
  const [previewNodes, setPreviewNodes] = useState<CanvasNode[]>([]);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { setNodes, setEdges } = useCanvasStore();

  // ---- live preview for text tab ----
  const handleTextChange = useCallback(
    (value: string) => {
      setTextContent(value);
      const { nodes, error } = parseContent(value, mode);
      setPreviewNodes(nodes);
      setPreviewError(error);
    },
    [mode],
  );

  // ---- file drop ----
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    // Auto-detect mode from extension
    const ext = acceptedFiles[0]?.name.split(".").pop()?.toLowerCase();
    if (ext === "sql") setMode("sql");
    else if (ext === "dbml") setMode("dbml");

    // Read file and update preview
    acceptedFiles[0]?.text().then((content) => {
      const detectedMode = ext === "sql" ? "sql" : "dbml";
      const { nodes, error } = parseContent(content, detectedMode);
      setPreviewNodes(nodes);
      setPreviewError(error);
    });
  }, []);

  // ---- import ----
  const handleImport = async () => {
    setIsProcessing(true);
    try {
      let content = "";

      if (inputTab === "file") {
        if (!files || files.length === 0) {
          toast.error("Please select a file first");
          return;
        }
        content = await files[0].text();
      } else {
        if (!textContent.trim()) {
          toast.error("Please paste some DBML or SQL first");
          return;
        }
        content = textContent;
      }

      const { nodes: newNodes, edges: newEdges } =
        mode === "dbml" ? dbmlToCanvas(content) : sqlToCanvas(content);

      if (newNodes.length === 0) {
        toast.error("No tables found. Please check the content.");
        return;
      }

      setNodes(newNodes);
      setEdges(newEdges);
      toast.success(
        `Imported ${newNodes.length} table${newNodes.length > 1 ? "s" : ""} successfully`,
      );
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Import failed: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFiles(undefined);
    setTextContent("");
    setPreviewNodes([]);
    setPreviewError(null);
    setIsProcessing(false);
    setOpen(false);
  };

  const hasContent =
    inputTab === "file" ? !!files && files.length > 0 : !!textContent.trim();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Import Schema
          </DialogTitle>
          <DialogDescription>
            Import from a <code className="font-mono text-xs">.dbml</code> or{" "}
            <code className="font-mono text-xs">.sql</code> file, or paste your
            schema directly.
          </DialogDescription>
        </DialogHeader>

        {/* Format selector */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-xs">
            Format:
          </span>
          <div className="flex gap-1">
            {(["dbml", "sql"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  // Re-parse if text is already present
                  if (textContent) handleTextChange(textContent);
                }}
                className={cn(
                  "rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                  mode === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground border-border hover:border-foreground/40 bg-transparent",
                )}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Input tabs */}
        <Tabs
          value={inputTab}
          onValueChange={(v) => setInputTab(v as InputTab)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="file" className="flex-1 text-xs">
              File
            </TabsTrigger>
            <TabsTrigger value="text" className="flex-1 text-xs">
              Paste text
            </TabsTrigger>
          </TabsList>

          {/* ---- File tab ---- */}
          <TabsContent value="file" className="mt-3 flex flex-col gap-3">
            <Dropzone
              accept={FILE_ACCEPT[mode]}
              maxFiles={1}
              maxSize={10 * 1024 * 1024}
              src={files}
              onDrop={handleDrop}
              onError={(err) => toast.error(err.message)}
              className="min-h-[140px]"
            >
              <DropzoneContent />
              <DropzoneEmptyState />
            </Dropzone>

            {files && files.length > 0 && (
              <div className="bg-muted/30 text-muted-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-xs">
                <span className="text-foreground truncate font-semibold">
                  {files[0].name}
                </span>
                <span className="shrink-0">·</span>
                <span className="shrink-0">
                  {(files[0].size / 1024).toFixed(1)} KB
                </span>
              </div>
            )}
          </TabsContent>

          {/* ---- Text tab ---- */}
          <TabsContent value="text" className="mt-3 flex flex-col gap-2">
            <Textarea
              placeholder={
                mode === "dbml"
                  ? `Table users {\n  id integer [pk]\n  email varchar\n}`
                  : `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255)\n);`
              }
              className="min-h-[160px] resize-none font-mono text-xs"
              value={textContent}
              onChange={(e) => handleTextChange(e.target.value)}
              spellCheck={false}
            />
          </TabsContent>
        </Tabs>

        {/* ---- Schema preview ---- */}
        <div className="mt-1 shrink-0 border-t pt-3">
          <SchemaPreview nodes={previewNodes} error={previewError} />
        </div>

        {/* ---- Footer ---- */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!hasContent || isProcessing}
          >
            {isProcessing ? "Importing…" : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
