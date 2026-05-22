"use client";

import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { GroupNodeData } from "@/features/model/types/canvas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import {
  NodeProps,
  NodeResizer,
  NodeResizeControl,
  type Node,
} from "@xyflow/react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  ArrowDownRight,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { GroupPropertiesPopover } from "./group-properties-popover";

export const GroupNodeComponent = memo(
  ({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as GroupNodeData;
    const { nodes, removeNode, removeNodes, updateNodeData, updateNode } =
      useCanvasStore();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const childNodes = nodes.filter((n) => n.parentId === id);

    // In-place editing state
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState(
      data.description || "",
    );

    // In-place editing name
    const [isEditingName, setIsEditingName] = useState(data.isEditing || false);
    const [editName, setEditName] = useState(data.name || "Group");

    // Sync local state when data changes externally (e.g., from properties popover)
    useEffect(() => {
      setEditName(data.name || "Group");
    }, [data.name]);

    useEffect(() => {
      setTempDescription(data.description || "");
    }, [data.description]);

    // Auto-focus logic for new groups
    useEffect(() => {
      if (data.isEditing) {
        setIsEditOpen(true);
        // Clear the flag after picking it up
        updateNodeData(id, { isEditing: false, isNew: false });
      }
    }, [data.isEditing, id, updateNodeData]);

    const handleNameSave = () => {
      if (!isEditingName) return;
      setIsEditingName(false);
      if (editName.trim() && editName !== data.name) {
        updateNodeData(id, { name: editName.trim() });
      } else {
        setEditName(data.name || "Group");
      }
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleNameSave();
      if (e.key === "Escape") {
        setIsEditingName(false);
        setEditName(data.name);
      }
    };

    const groupColor = data.color || "#a855f7"; // Default purple-500
    const isCollapsed = data.isCollapsed || false;
    const dragOverGroupId = useCanvasStore((s) => s.dragOverGroupId);
    const isDragOver = dragOverGroupId === id;

    const PRESET_COLORS = [
      { name: "Blue", value: "#3b82f6" },
      { name: "Green", value: "#22c55e" },
      { name: "Purple", value: "#a855f7" },
      { name: "Orange", value: "#f97316" },
      { name: "Red", value: "#ef4444" },
    ];

    const handleDescriptionSubmit = () => {
      if (!isEditingDescription) return;
      setIsEditingDescription(false);
      if (tempDescription !== data.description) {
        updateNodeData(id, { description: tempDescription });
      } else {
        setTempDescription(data.description || "");
      }
    };

    const handleDeleteOnlyGroup = () => {
      removeNode(id);
      setIsDeleteOpen(false);
    };

    const handleDeleteAll = () => {
      const idsToDelete = [id, ...childNodes.map((n) => n.id)];
      removeNodes(idsToDelete);
      setIsDeleteOpen(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (childNodes.length === 0) {
        removeNode(id);
      } else {
        setIsDeleteOpen(true);
      }
    };

    const handleToggleCollapse = (e: React.MouseEvent) => {
      e.stopPropagation();
      const node = nodes.find((n) => n.id === id);
      if (!node) return;

      const { batchUpdateNodes } = useCanvasStore.getState();
      const childNodes = nodes.filter((n) => n.parentId === id);

      if (!isCollapsed) {
        // Collapsing
        const currentHeight = (node.style?.height as number) || 400;

        updateNode(id, {
          style: { ...node.style, height: 90 },
        });

        updateNodeData(id, {
          isCollapsed: true,
          expandedHeight: currentHeight,
        });

        // Hide children
        const updates: Record<string, Partial<Node>> = {};
        childNodes.forEach((child) => {
          updates[child.id] = { hidden: true };
        });
        batchUpdateNodes(updates);
      } else {
        // Expanding
        const targetHeight = data.expandedHeight || 400;
        updateNode(id, {
          style: { ...node.style, height: targetHeight },
        });
        updateNodeData(id, {
          isCollapsed: false,
        });

        // Show children
        const updates: Record<string, Partial<Node>> = {};
        childNodes.forEach((child) => {
          updates[child.id] = { hidden: false };
        });
        batchUpdateNodes(updates);
      }
    };

    return (
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "group/node relative h-full w-full rounded-md border-2 transition-all duration-200",
            selected ? "border-primary ring-primary/20 ring-2" : "",
            isDragOver && "z-50 scale-[1.01] shadow-2xl ring-4",
          )}
          style={{
            borderColor: selected
              ? undefined
              : isDragOver
                ? groupColor
                : groupColor,
            backgroundColor: isDragOver ? `${groupColor}3d` : `${groupColor}1f`, // ~24% vs ~12% opacity
            boxShadow: isDragOver ? `0 0 20px ${groupColor}4d` : undefined,
          }}
        >
          {!isCollapsed && (
            <NodeResizer
              color={groupColor}
              isVisible={selected}
              minWidth={200}
              minHeight={100}
            />
          )}

          {/* Toolbar - Visible on hover or selected */}
          <div
            className={cn(
              "nopan nodrag absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900/95 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-opacity duration-200",
              selected || isEditOpen || isColorOpen
                ? "opacity-100"
                : "opacity-0 group-hover/node:opacity-100",
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggleCollapse}
                  className="rounded-sm p-1 transition-colors hover:bg-white/10"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isCollapsed ? "Expand" : "Collapse"}
              </TooltipContent>
            </Tooltip>

            <div className="mx-0.5 h-4 w-px bg-white/10" />

            <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "rounded-sm p-1 transition-colors hover:bg-white/10",
                        isColorOpen && "bg-white/10",
                      )}
                    >
                      <div
                        className="h-4 w-4 rounded-[3px] shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: groupColor }}
                      />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Change Color</TooltipContent>
              </Tooltip>
              <PopoverContent
                side="top"
                align="center"
                className="border-border/50 w-auto p-2 shadow-2xl"
              >
                <div className="flex gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      className={cn(
                        "h-6 w-6 rounded-full border-2 transition-all hover:scale-110",
                        groupColor === c.value
                          ? "border-white shadow-md"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: c.value }}
                      onClick={() => {
                        updateNodeData(id, { color: c.value });
                        setIsColorOpen(false);
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={isEditOpen} onOpenChange={setIsEditOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "rounded-sm p-1 transition-colors hover:bg-white/10",
                        isEditOpen && "bg-white/10",
                      )}
                    >
                      <Pencil className="h-4 w-4 text-zinc-400" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Edit Group</TooltipContent>
              </Tooltip>
              <PopoverContent
                side="right"
                align="start"
                className="border-border/50 w-[320px] shadow-2xl"
              >
                <GroupPropertiesPopover
                  nodeId={id}
                  data={data}
                  onClose={() => setIsEditOpen(false)}
                />
              </PopoverContent>
            </Popover>

            <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      onClick={handleDeleteClick}
                      className={cn(
                        "group rounded-sm p-1 transition-colors hover:bg-red-500/20",
                        isDeleteOpen && "bg-red-500/20",
                      )}
                    >
                      <Trash2 className="h-4 w-4 text-red-500/80 group-hover:text-red-500" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Delete</TooltipContent>
              </Tooltip>
              <PopoverContent
                side="top"
                align="end"
                className="w-[280px] border-red-500/20 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-foreground text-[14px] font-semibold">
                      Delete Group
                    </p>
                    <p className="text-muted-foreground text-[12px] leading-relaxed">
                      This group contains{" "}
                      <span className="text-foreground font-medium">
                        {childNodes.length} items
                      </span>
                      . How would you like to proceed?
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <button
                      onClick={handleDeleteAll}
                      className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-[12px] font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98]"
                    >
                      Delete Group & All Items
                    </button>
                    <button
                      onClick={handleDeleteOnlyGroup}
                      className="text-foreground flex w-full items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-medium transition-all hover:bg-white/10 active:scale-[0.98]"
                    >
                      Delete Only Group
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="group-box-title flex w-full items-start px-3 pt-3 select-none">
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "text-foreground cursor-move truncate font-semibold",
                  isCollapsed ? "text-[13px]" : "text-[14px]",
                )}
                title={data.name || "Group"}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                {isEditingName ? (
                  <input
                    autoFocus
                    className="text-foreground placeholder:text-foreground/50 nodrag flex h-auto w-full items-start border-none bg-transparent p-0 font-semibold outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={handleNameKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="line-clamp-2 flex cursor-text items-start">
                    {data.name || "Group"}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <>
                  {isEditingDescription ? (
                    <div className="nodrag mt-1">
                      <Textarea
                        autoFocus
                        className="bg-muted/20 flex h-20 w-full resize-none items-start text-[12px] focus-visible:ring-1"
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        onBlur={handleDescriptionSubmit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleDescriptionSubmit();
                          }
                          if (e.key === "Escape") {
                            setTempDescription(data.description || "");
                            setIsEditingDescription(false);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="text-muted-foreground hover:text-foreground mt-0.5 line-clamp-2 flex cursor-text items-start text-[12px] transition-colors"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setTempDescription(data.description || "");
                        setIsEditingDescription(true);
                      }}
                    >
                      {data.description || "Description (Double click to edit)"}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content area for nested nodes handled by React Flow */}
          {!isCollapsed && <div className="h-full w-full flex-1" />}
        </div>
      </TooltipProvider>
    );
  },
);

GroupNodeComponent.displayName = "GroupNode";
