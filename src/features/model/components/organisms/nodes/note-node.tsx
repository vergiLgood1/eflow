"use client";

import { memo, useState, useRef, useEffect } from "react";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { NoteNodeData } from "@/features/model/types/canvas";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { cn } from "@/shared/lib/utils";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Trash2, Palette } from "lucide-react";

const NOTE_COLORS = [
    { name: "Yellow", bg: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-900", hex: "#fef08a" },
    { name: "Blue", bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-900", hex: "#bfdbfe" },
    { name: "Green", bg: "bg-green-100", border: "border-green-200", text: "text-green-900", hex: "#bbf7d0" },
    { name: "Pink", bg: "bg-pink-100", border: "border-pink-200", text: "text-pink-900", hex: "#fbcfe8" },
    { name: "Orange", bg: "bg-orange-100", border: "border-orange-200", text: "text-orange-900", hex: "#fed7aa" },
    { name: "Purple", bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-900", hex: "#e9d5ff" },
];

export const NoteNodeComponent = memo(({ id, data: rawData, selected }: NodeProps) => {
    const data = rawData as NoteNodeData;
    const { nodes, updateNodeData, removeNode } = useCanvasStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Auto-enter edit mode if the note is newly created
    const [isEditing, setIsEditing] = useState(!!data.isNew);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [tempContent, setTempContent] = useState(data.content || "");

    const activeColor = NOTE_COLORS.find(c => c.hex === data.color) || NOTE_COLORS[0];

    // Handle transient isNew flag cleanup
    useEffect(() => {
        if (data.isNew) {
            updateNodeData(id, { isNew: false });
        }
    }, [id, data.isNew, updateNodeData]);

    // Reliable focus management
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(tempContent.length, tempContent.length);
        }
    }, [isEditing]);

    const handleContentSubmit = () => {
        updateNodeData(id, { content: tempContent });
        setIsEditing(false);
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "group/note relative flex h-full w-full flex-col rounded-md border-2 p-4 shadow-sm transition-all duration-200 min-h-[100px] min-w-[150px]",
                    selected ? "ring-2 ring-primary ring-offset-2 border-primary" : activeColor.border,
                    activeColor.bg,
                    activeColor.text
                )}
            >
                <NodeResizer
                    color={activeColor.hex}
                    isVisible={selected}
                    minWidth={150}
                    minHeight={100}
                />

                {/* Toolbar */}
                <div className={cn(
                    "nodrag nopan absolute -top-12 right-0 z-[100] flex items-center gap-1 rounded-md bg-zinc-900 p-1 shadow-xl border border-white/10 opacity-0 transition-opacity group-hover/note:opacity-100",
                    (selected || isColorOpen) && "opacity-100"
                )}>
                    <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                    <button className="rounded p-1 hover:bg-white/10 transition-colors">
                                        <Palette className="h-3.5 w-3.5 text-zinc-400" />
                                    </button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Change Color</TooltipContent>
                        </Tooltip>
                        <PopoverContent side="top" align="end" className="w-auto p-2">
                            <div className="flex gap-2">
                                {NOTE_COLORS.map((c) => (
                                    <button
                                        key={c.hex}
                                        className={cn(
                                            "h-6 w-6 rounded-full border-2 transition-all hover:scale-110",
                                            data.color === c.hex ? "border-zinc-400" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => {
                                            updateNodeData(id, { color: c.hex });
                                            setIsColorOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="h-3 w-px bg-white/10 mx-0.5" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => removeNode(id)}
                                className="rounded p-1 hover:bg-red-500/20 transition-colors group/del"
                            >
                                <Trash2 className="h-3.5 w-3.5 text-zinc-400 group-hover/del:text-red-500" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete Note</TooltipContent>
                    </Tooltip>
                </div>

                {isEditing ? (
                    <div className="flex-1 nodrag h-full">
                        <Textarea
                            ref={textareaRef}
                            placeholder="Type your note here..."
                            className={cn(
                                "h-full w-full resize-none border-none bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-zinc-500/50 break-all",
                                activeColor.text
                            )}
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            onBlur={handleContentSubmit}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setTempContent(data.content || "");
                                    setIsEditing(false);
                                }
                                // Submit on Cmd+Enter / Ctrl+Enter
                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    handleContentSubmit();
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className="flex-1 cursor-text whitespace-pre-wrap break-all text-sm leading-relaxed overflow-hidden"
                        onDoubleClick={() => {
                            setIsEditing(true);
                            setTempContent(data.content || "");
                        }}
                    >
                        {data.content || <span className="opacity-40 italic">Double-click to edit...</span>}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
});

NoteNodeComponent.displayName = "NoteNode";
