"use client"

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useResizeObserver } from "@/shared/hooks/use-resize-observer";
import { ChevronDown, Coins, Database, MessageSquare, Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWorkspaceStore } from "../../store/use-workspace-store";

export function WorkspaceChatPanel() {
    const { isChatOpen } = useWorkspaceStore();
    const [width, setWidth] = useState(380);
    const panelRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);

    // Observe size changes via the requested hook
    useResizeObserver({
        ref: panelRef,
    });

    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing.current) {
            const newWidth = window.innerWidth - e.clientX;
            // Min width 300, Max 40% of window
            if (newWidth > 300 && newWidth < window.innerWidth * 0.5) {
                setWidth(newWidth);
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    if (!isChatOpen) return null;

    return (
        <aside
            ref={panelRef}
            style={{ width: `${width}px` }}
            className="shrink-0 border-l border-border bg-background flex flex-col overflow-hidden z-20 h-full relative"
        >
            {/* Resize Handle - Draggable left edge */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/40 transition-colors z-50 group"
                onMouseDown={startResizing}
            >
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-border group-hover:bg-primary/50 transition-colors" />
            </div>

            <div className="h-full w-full flex flex-col bg-background overflow-hidden">
                {/* Header */}
                <div className="border-b border-border p-3 flex items-center justify-between gap-2">
                    <div className="relative">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2 text-xs font-normal h-8 px-3"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="max-w-[200px] truncate">New Chat</span>
                            <ChevronDown className="h-4 w-4 transition-transform" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            My Workspace
                        </span>
                    </div>
                </div>

                {/* Warning / Limit */}
                <div className="mx-3 mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        <span>You have reached the message limit of the free plan.</span>
                    </div>
                    <Button
                        size="sm"
                        className="h-8 rounded-md px-3 text-xs"
                    >
                        Upgrade plan
                    </Button>
                </div>

                {/* Chat Area / Empty State */}
                <ScrollArea className="flex-1 min-h-0 w-full">
                    <div className="p-4 space-y-4 w-full max-w-full">
                        <div className="text-center py-12 mt-10">
                            <div className="mb-6">
                                <div className="inline-block p-4 rounded-full bg-accent/10 mb-4">
                                    <Database className="h-12 w-12 text-accent" />
                                </div>
                                <h3 className="text-sm font-medium mb-2">Data Model Mode</h3>
                                <p className="text-xs text-muted-foreground mb-8">
                                    Create tables, add columns, define relationships
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer / Input */}
                <div className="border-t border-border bg-card p-4">
                    <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                className="flex w-full rounded-md border px-3 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[200px] resize-none py-3 pr-4 text-xs bg-muted/50 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20"
                                placeholder="Ask something..."
                                rows={1}
                                style={{ height: "42px" }}
                            />
                        </div>
                        <Button
                            aria-label="Send"
                            size="icon"
                            className="shrink-0 mb-1 h-10 w-10"
                            title="Send"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <div className="h-7 gap-1.5 px-2 flex items-center text-accent">
                                <Database className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Data Model</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-muted-foreground hover:text-foreground text-xs"
                                title="Refine your message before sending"
                            >
                                Refine
                            </Button>
                            <p className="text-[11px] text-muted-foreground">
                                Enter to send · Shift+Enter new line
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
