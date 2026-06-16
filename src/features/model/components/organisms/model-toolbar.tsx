"use client";

import { ImportSchemaDialog } from "@/shared/components/ui/import-schema-dialog";
import { Separator } from "@/shared/components/ui/separator";
import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useReactFlow } from "@xyflow/react";
import {
  Activity,
  ChevronLeft,
  CodeXml,
  Download,
  FileCode,
  MousePointer2,
  Plus,
  Redo2,
  Square,
  Table2,
  Undo2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateSQL } from "../../lib/sql-generator";
import { useCanvasStore } from "../../store/use-canvas-store";
import { useWorkspaceStore } from "../../store/use-workspace-store";
import type {
  CanvasNode,
  CanvasTool,
  RelationshipEdge,
} from "../../types/canvas";
import { ModelRelationIcon } from "../atoms/model-relation-icon";
import { ModelToolbarButton } from "../atoms/model-toolbar-button";
import { CheckpointDialog } from "./checkpoint-dialog";
import { ModelSettingsDialog } from "./model-settings-dialog";

const ACTIVE_TOOL_CLASS =
  "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80";

export function ModelToolbar() {
  const activeTool = useCanvasStore((s) => s.activeTool);
  const setActiveTool = useCanvasStore((s) => s.setActiveTool);

  const { tabs, closeTab, addTab, renameTab } = useWorkspaceStore();

  const { zoomIn, zoomOut } = useReactFlow();
  const {
    undo,
    redo,
    toggleAnimation,
    isAnimated,
    history,
    future,
    nodes,
    edges,
    isDbmlModeOpen,
    toggleDbmlMode,
    dataModelId,
  } = useCanvasStore();

  const [importMode, setImportMode] = useState<"sql" | "dbml" | null>(null);

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleToolClick = (tool: CanvasTool) => {
    setActiveTool(activeTool === tool ? "select" : tool);
  };

  const handleRenameSubmit = (id: string) => {
    if (editingName.trim()) {
      renameTab(id, editingName.trim());
    }
    setEditingTabId(null);
  };

  const handleExportSQL = () => {
    const sql = generateSQL(nodes as CanvasNode[], edges as RelationshipEdge[]);
    const blob = new Blob([sql], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.sql";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SQL Schema exported successfully");
  };

  return (
    <div className="bg-card flex flex-col">
      {/* ================= TAB BAR ================= */}
      <div className="bg-muted/10 flex h-10 items-end gap-1 overflow-hidden border-b px-2 py-1 select-none">
        <ModelToolbarButton
          tooltip="Back"
          icon={<ChevronLeft className="h-4 w-4" />}
        />

        <ModelToolbarButton
          tooltip="Add new workspace"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => addTab({ name: "new_tab", type: "diagram" })}
        />

        <TabsList className="no-scrollbar h-full items-end gap-1 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onDoubleClick={() => {
                setEditingTabId(tab.id);
                setEditingName(tab.name);
              }}
              className="group no-scrollbar relative rounded-b-none border-0 bg-transparent"
            >
              {/* Tab Label */}
              {editingTabId === tab.id ? (
                <input
                  autoFocus
                  className="border-primary bg-background h-6 w-24 rounded border px-1 text-[12px] focus:outline-none"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRenameSubmit(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit(tab.id);
                    if (e.key === "Escape") setEditingTabId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="max-w-[120px] truncate text-[12px] font-semibold">
                  {tab.name}
                </span>
              )}

              {/* Close Button */}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="hover:bg-foreground/10 cursor-pointer rounded-sm p-0.5 opacity-0 transition-all group-hover:opacity-100 group-data-[state=active]:opacity-100"
              >
                <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
              </span>

              {/* Active underline indicator */}
              <div className="bg-primary absolute right-0 bottom-0 left-0 h-[2.5px] opacity-0 transition-opacity group-data-[state=active]:opacity-100" />
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="bg-background text-foreground no-scrollbar flex h-12 items-center gap-2 overflow-x-auto px-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <ModelSettingsDialog />
          {dataModelId && <CheckpointDialog dataModelId={dataModelId} />}
          <Separator
            orientation="vertical"
            className="mx-1 my-2 flex items-center"
          />

          <ModelToolbarButton
            tooltip="Cursor"
            icon={<MousePointer2 className="h-4 w-4" />}
            className={activeTool === "select" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => setActiveTool("select")}
          />
          {/* <ModelToolbarButton
            tooltip="Selection (drag to select multiple)"
            icon={<Square className="h-4 w-4" />}
            className={
              activeTool === "selection" ? ACTIVE_TOOL_CLASS : undefined
            }
            onClick={() => setActiveTool("selection")}
          /> */}
          <ModelToolbarButton
            tooltip="Add Table (click canvas to place)"
            icon={<Table2 className="h-4 w-4" />}
            className={activeTool === "table" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("table")}
          />

          <ModelToolbarButton
            tooltip="One to One"
            label="1:1"
            className={activeTool === "rel-1-1" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("rel-1-1")}
          >
            <ModelRelationIcon type="1:1" />
          </ModelToolbarButton>
          <ModelToolbarButton
            tooltip="One to Many"
            label="1:n"
            className={activeTool === "rel-1-n" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("rel-1-n")}
          >
            <ModelRelationIcon type="1:n" />
          </ModelToolbarButton>
          <ModelToolbarButton
            tooltip="One to One (optional)"
            label="0..1"
            className={activeTool === "rel-0-1" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("rel-0-1")}
          >
            <ModelRelationIcon type="0..1" />
          </ModelToolbarButton>
          <ModelToolbarButton
            tooltip="One to Many (optional)"
            label="0..n"
            className={activeTool === "rel-0-n" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("rel-0-n")}
          >
            <ModelRelationIcon type="0..n" />
          </ModelToolbarButton>
          <ModelToolbarButton
            tooltip="Many to Many"
            label="n:m"
            className={activeTool === "rel-n-m" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("rel-n-m")}
          >
            <ModelRelationIcon type="n:m" />
          </ModelToolbarButton>

          <ModelToolbarButton
            tooltip="Note (click canvas to place)"
            icon={<Square className="h-4 w-4" />}
            className={activeTool === "note" ? ACTIVE_TOOL_CLASS : undefined}
            onClick={() => handleToolClick("note")}
          />
          {/* <ModelToolbarButton
                        tooltip="Group (click canvas to place)"
                        icon={<Layers className="h-4 w-4" />}
                        className={activeTool === "group" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("group")}
                    /> */}

          <Separator
            orientation="vertical"
            className="mx-1 my-2 flex items-center"
          />

          <ModelToolbarButton
            tooltip="Import SQL"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => setImportMode("sql")}
          />

          <ModelToolbarButton
            tooltip="Export SQL"
            icon={<Download className="h-4 w-4" />}
            onClick={handleExportSQL}
          />
          <ModelToolbarButton
            tooltip="Import DBML"
            icon={<FileCode className="h-4 w-4" />}
            onClick={() => setImportMode("dbml")}
          />
          <ModelToolbarButton
            tooltip="DBML Panel"
            icon={<CodeXml className="h-4 w-4" />}
            onClick={toggleDbmlMode}
            className={isDbmlModeOpen ? ACTIVE_TOOL_CLASS : undefined}
          />

          <Separator
            orientation="vertical"
            className="mx-1 my-2 flex items-center"
          />

          <ModelToolbarButton
            tooltip="Undo (Ctrl+Z)"
            icon={<Undo2 className="h-4 w-4" />}
            onClick={undo}
            disabled={history.length === 0}
          />
          <ModelToolbarButton
            tooltip="Redo (Ctrl+Y)"
            icon={<Redo2 className="h-4 w-4" />}
            onClick={redo}
            disabled={future.length === 0}
          />

          <Separator
            orientation="vertical"
            className="mx-1 my-2 flex items-center"
          />

          <ModelToolbarButton
            tooltip="Zoom In"
            icon={<ZoomIn className="h-4 w-4" />}
            onClick={() => zoomIn()}
          />
          <ModelToolbarButton
            tooltip="Zoom Out"
            icon={<ZoomOut className="h-4 w-4" />}
            onClick={() => zoomOut()}
          />

          <Separator
            orientation="vertical"
            className="mx-1 my-2 flex items-center"
          />

          <ModelToolbarButton
            tooltip="Animated Relationships"
            icon={<Activity className="h-4 w-4" />}
            onClick={toggleAnimation}
            className={isAnimated ? ACTIVE_TOOL_CLASS : undefined}
          />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {/* <Separator orientation="vertical" className="flex items-center mx-1 my-2" />
                    <ModelToolbarButton tooltip="Share" icon={<Users className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="Activity" icon={<Clock className="h-4 w-4" />} /> */}
          {/* <ModelUserAvatar name="Diyo Anggara" /> */}
        </div>
      </div>

      {/* ================= IMPORT DIALOG ================= */}
      <ImportSchemaDialog
        key={importMode}
        open={importMode !== null}
        defaultMode={importMode ?? "sql"}
        onClose={() => setImportMode(null)}
      />
    </div>
  );
}
