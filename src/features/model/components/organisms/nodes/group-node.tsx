"use client"

import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { GroupNodeData } from "@/features/model/types/canvas";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { GroupPropertiesPopover } from "./group-properties-popover";

export const GroupNodeComponent = memo(({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as GroupNodeData;
    const { nodes, removeNode, updateNodeData, updateNode } = useCanvasStore();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);

    // In-place editing state
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState(data.description || "");

    const groupColor = data.color || "#a855f7"; // Default purple-500
    const isCollapsed = data.isCollapsed || false;

    const PRESET_COLORS = [
        { name: "Blue", value: "#3b82f6" },
        { name: "Green", value: "#22c55e" },
        { name: "Purple", value: "#a855f7" },
        { name: "Orange", value: "#f97316" },
        { name: "Red", value: "#ef4444" },
    ];

    const handleDescriptionSubmit = () => {
        updateNodeData(id, { description: tempDescription });
        setIsEditingDescription(false);
    };

    const handleToggleCollapse = (e: React.MouseEvent) => {
        e.stopPropagation();
        const node = nodes.find((n) => n.id === id);
        if (!node) return;

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
        } else {
            // Expanding
            const targetHeight = data.expandedHeight || 400;
            updateNode(id, {
                style: { ...node.style, height: targetHeight },
            });
            updateNodeData(id, {
                isCollapsed: false,
            });
        }
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "group/node relative h-full w-full overflow-hidden rounded-md border-2 transition-all duration-200",
                    selected ? "border-primary ring-2 ring-primary/20" : ""
                )}
                style={{
                    borderColor: selected ? undefined : groupColor,
                    backgroundColor: `${groupColor}1f` // ~12% opacity in hex (1f is 31/255)
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
                <div className={cn(
                    "nopan nodrag absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md bg-zinc-900/95 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-md transition-opacity duration-200",
                    (selected || isEditOpen || isColorOpen) ? "opacity-100" : "opacity-0 group-hover/node:opacity-100"
                )}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleToggleCollapse}
                                className="rounded-sm p-1 hover:bg-white/10 transition-colors"
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

                    <div className="mx-0.5 h-4 w-[1px] bg-white/10" />

                    <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                    <button className={cn(
                                        "rounded-sm p-1 hover:bg-white/10 transition-colors",
                                        isColorOpen && "bg-white/10"
                                    )}>
                                        <div
                                            className="h-4 w-4 rounded-[3px] shadow-sm transition-transform hover:scale-110"
                                            style={{ backgroundColor: groupColor }}
                                        />
                                    </button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Change Color</TooltipContent>
                        </Tooltip>
                        <PopoverContent side="top" align="center" className="w-auto p-2 shadow-2xl border-border/50">
                            <div className="flex gap-2">
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        className={cn(
                                            "h-6 w-6 rounded-full border-2 transition-all hover:scale-110",
                                            groupColor === c.value ? "border-white shadow-md" : "border-transparent"
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
                                    <button className={cn(
                                        "rounded-sm p-1 hover:bg-white/10 transition-colors",
                                        isEditOpen && "bg-white/10"
                                    )}>
                                        <Pencil className="h-4 w-4 text-zinc-400" />
                                    </button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Edit Group</TooltipContent>
                        </Tooltip>
                        <PopoverContent side="right" align="start" className="w-[320px] shadow-2xl border-border/50">
                            <GroupPropertiesPopover
                                nodeId={id}
                                data={data}
                                onClose={() => setIsEditOpen(false)}
                            />
                        </PopoverContent>
                    </Popover>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeNode(id);
                                }}
                                className="rounded-sm p-1 hover:bg-red-500/20 group transition-colors"
                            >
                                <Trash2 className="h-4 w-4 text-red-500/80 group-hover:text-red-500" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete</TooltipContent>
                    </Tooltip>
                </div>

                <div className="group-box-title px-3 pt-3 select-none flex items-start">
                    <div className="min-w-0">
                        <div
                            className={cn(
                                "cursor-move truncate font-semibold text-foreground",
                                isCollapsed ? "text-[13px]" : "text-[14px]"
                            )}
                            title={data.name || "Group"}
                        >
                            <span className="cursor-text line-clamp-2 items-start flex">{data.name || "Group"}</span>
                        </div>

                        {!isCollapsed && (
                            <>
                                {isEditingDescription ? (
                                    <div className="mt-1 nodrag">
                                        <Textarea
                                            autoFocus
                                            className="h-20 w-full resize-none bg-muted/20 text-[12px] focus-visible:ring-1"
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
                                        className="mt-0.5 line-clamp-2 cursor-text text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingDescription(true);
                                            setTempDescription(data.description || "");
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
                {!isCollapsed && <div className="flex-1 h-full w-full" />}
            </div>
        </TooltipProvider>
    );
});

GroupNodeComponent.displayName = "GroupNode";
