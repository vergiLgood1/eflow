"use client";

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
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/shared/components/ui/dropzone";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  Columns3,
  FileCode,
  Table2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import type { Accept } from "react-dropzone";
import { toast } from "sonner";
import { dbmlToCanvas, sqlToCanvas } from "@/features/model/lib/import-utils";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import type { CanvasNode } from "@/features/model/types/canvas";

// ------------------------------------------------------------------ types ----

export type ImportMode = "sql" | "dbml";
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
        <ScrollArea className="max-h-[160px] border-t">
          <div className="divide-y">
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
        </ScrollArea>
      )}
    </div>
  );
}

function SchemaPreview({
  nodes,
  error,
}: {
  nodes: CanvasNode[];
  error: string | null;
}) {
  const tables = useMemo(() => nodesToTables(nodes), [nodes]);

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
      <div className="text-muted-foreground flex items-center justify-center py-5 text-xs">
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
      <ScrollArea className="h-[220px]">
        <div className="flex flex-col gap-1 pr-1">
          {tables.map((t) => (
            <TablePreviewRow key={t.name} table={t} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ---------------------------------------------------------------- constants --

const FILE_ACCEPT: Record<ImportMode, Accept> = {
  sql: { "text/plain": [".sql"], "application/sql": [".sql"] },
  dbml: { "text/plain": [".dbml"] },
};

const TEXT_PLACEHOLDER: Record<ImportMode, string> = {
  dbml: "Table users {\n  id integer [pk]\n  email varchar\n  created_at timestamp\n}\n",
  sql: "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255)\n);\n",
};

// ---------------------------------------------------------------- main comp --

export interface ImportSchemaDialogProps {
  /**
   * Controlled open state. Pair with `onClose`.
   * When provided, no internal trigger is rendered.
   */
  open?: boolean;
  /** Called when the dialog requests closing (controlled mode). */
  onClose?: () => void;
  /**
   * Uncontrolled trigger. When provided the dialog manages its own open state.
   * Can be combined with `defaultMode`.
   */
  children?: ReactNode;
  /** Which parser is active when the dialog opens. Defaults to "dbml". */
  defaultMode?: ImportMode;
}

export function ImportSchemaDialog({
  open: controlledOpen,
  onClose,
  children,
  defaultMode = "dbml",
}: ImportSchemaDialogProps) {
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

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
    acceptedFiles[0]?.text().then((content) => {
      const ext = acceptedFiles[0].name.split(".").pop()?.toLowerCase();
      const detectedMode: ImportMode = ext === "sql" ? "sql" : "dbml";
      setMode(detectedMode);
      const { nodes, error } = parseContent(content, detectedMode);
      setPreviewNodes(nodes);
      setPreviewError(error);
    });
  }, []);

  // ---- import ----
  const handleImport = async () => {
    setIsProcessing(true);
    try {
      if (inputTab === "file") {
        if (!files || files.length === 0) {
          toast.error("Please select a file first");
          return;
        }
        const content = await files[0].text();
        const ext = files[0].name.split(".").pop()?.toLowerCase();
        const detectedMode: ImportMode = ext === "sql" ? "sql" : "dbml";
        const { nodes: newNodes, edges: newEdges } =
          detectedMode === "dbml"
            ? dbmlToCanvas(content)
            : sqlToCanvas(content);

        if (newNodes.length === 0) {
          toast.error("No tables found. Please check the file contents.");
          return;
        }
        setNodes(newNodes);
        setEdges(newEdges);
        toast.success(
          `Imported ${newNodes.length} table${newNodes.length > 1 ? "s" : ""} from ${files[0].name}`,
        );
      } else {
        if (!textContent.trim()) {
          toast.error("Please paste some DBML or SQL first");
          return;
        }
        const { nodes: newNodes, edges: newEdges } =
          mode === "dbml"
            ? dbmlToCanvas(textContent)
            : sqlToCanvas(textContent);

        if (newNodes.length === 0) {
          toast.error("No tables found. Please check the content.");
          return;
        }
        setNodes(newNodes);
        setEdges(newEdges);
        toast.success(
          `Imported ${newNodes.length} table${newNodes.length > 1 ? "s" : ""} successfully`,
        );
      }

      handleClose();
    } catch (err) {
      toast.error(
        `Import failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
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
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) handleClose();
    else if (!isControlled) setInternalOpen(true);
  };

  const hasContent =
    inputTab === "file" ? !!files && files.length > 0 : !!textContent.trim();

  const label = mode.toUpperCase();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-4xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Import Schema
          </DialogTitle>
          <DialogDescription>
            Upload a <code className="font-mono text-xs">.dbml</code> or{" "}
            <code className="font-mono text-xs">.sql</code> file, or paste your
            schema directly. This will replace the current canvas.
          </DialogDescription>
        </DialogHeader>

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
              accept={{ ...FILE_ACCEPT.sql, ...FILE_ACCEPT.dbml }}
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
                <Badge
                  variant="outline"
                  className="ml-auto shrink-0 text-[10px]"
                >
                  {files[0].name.split(".").pop()?.toUpperCase()}
                </Badge>
              </div>
            )}
          </TabsContent>

          {/* ---- Text tab ---- */}
          <TabsContent value="text" className="mt-3 flex flex-col gap-2">
            <div className="mb-1 flex gap-1">
              {(["dbml", "sql"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    if (textContent) {
                      const { nodes, error } = parseContent(textContent, m);
                      setPreviewNodes(nodes);
                      setPreviewError(error);
                    }
                  }}
                  className={`rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                    mode === m
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-border hover:border-foreground/40 bg-transparent"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
            <ScrollArea className="h-[200px] rounded-md border">
              <Textarea
                placeholder={TEXT_PLACEHOLDER[mode]}
                className="min-h-[200px] resize-none rounded-none border-0 font-mono text-xs focus-visible:ring-0"
                value={textContent}
                onChange={(e) => handleTextChange(e.target.value)}
                spellCheck={false}
              />
            </ScrollArea>
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
            {isProcessing ? "Importing…" : `Import ${label}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
