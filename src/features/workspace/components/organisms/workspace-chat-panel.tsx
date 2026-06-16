"use client";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useResizeObserver } from "@/shared/hooks/use-resize-observer";
import {
  ChevronDown,
  Database,
  Sparkles,
  MessageSquare,
  Send,
} from "lucide-react";
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
      className="border-border bg-background relative z-20 flex h-full shrink-0 flex-col overflow-hidden border-l"
    >
      {/* Resize Handle - Draggable left edge */}
      <div
        className="hover:bg-primary/40 group absolute top-0 bottom-0 left-0 z-50 w-1.5 cursor-col-resize transition-colors"
        onMouseDown={startResizing}
      >
        <div className="bg-border group-hover:bg-primary/50 absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors" />
      </div>

      <div className="bg-background flex h-full w-full flex-col overflow-hidden">
        {/* Header */}
        <div className="border-border flex items-center justify-between gap-2 border-b p-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 px-3 text-xs font-normal"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="max-w-[200px] truncate">New Chat</span>
              <ChevronDown className="h-4 w-4 transition-transform" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground max-w-[150px] truncate text-xs">
              My Workspace
            </span>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mx-3 mt-3 flex items-center justify-between gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Workspace chat is coming soon.</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 rounded-md px-3 text-xs"
            disabled
          >
            Preview
          </Button>
        </div>

        {/* Chat Area / Empty State */}
        <ScrollArea className="min-h-0 w-full flex-1">
          <div className="w-full max-w-full space-y-4 p-4">
            <div className="mt-10 py-12 text-center">
              <div className="mb-6">
                <div className="bg-accent/10 mb-4 inline-block rounded-full p-4">
                  <Database className="text-accent h-12 w-12" />
                </div>
                <h3 className="mb-2 text-sm font-medium">
                  Chat assistant coming soon
                </h3>
                <p className="text-muted-foreground mx-auto mb-8 max-w-[280px] text-xs leading-relaxed">
                  Soon you will be able to ask questions, generate schema ideas,
                  and refine your data model directly from this workspace.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer / Input */}
        <div className="border-border bg-card border-t p-4">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                className="placeholder:text-muted-foreground focus-visible:ring-ring bg-muted/50 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 flex max-h-[200px] min-h-[44px] w-full resize-none rounded-md border px-3 py-3 pr-4 text-xs shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ask something..."
                rows={1}
                style={{ height: "42px" }}
                disabled
              />
            </div>
            <Button
              aria-label="Send"
              size="icon"
              className="mb-1 h-10 w-10 shrink-0"
              title="Send"
              disabled
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-accent flex h-7 items-center gap-1.5 px-2">
                <Database className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Data Model</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                title="Refine your message before sending"
                disabled
              >
                Refine
              </Button>
              <p className="text-muted-foreground text-[11px]">
                Chat features are not available yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
