"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { useReactFlow } from "@xyflow/react";
import { Eye, Layers, Maximize, Plus, StickyNote, Trash2 } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { useCanvasStore } from "../../store/use-canvas-store";

interface CanvasContextMenuProps {
  children: React.ReactNode;
}

export function CanvasContextMenu({ children }: CanvasContextMenuProps) {
  const addNode = useCanvasStore((s) => s.addNode);
  const nodes = useCanvasStore((s) => s.nodes);
  const removeNode = useCanvasStore((s) => s.removeNode);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Capture the right-click position since ContextMenuItem onClick
  // doesn't provide the original pointer coordinates.
  const cursorRef = useRef({ x: 0, y: 0 });

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    cursorRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleAddTable = useCallback(() => {
    const position = screenToFlowPosition(cursorRef.current);
    addNode({
      id: crypto.randomUUID(),
      type: "table",
      position,
      data: {
        name: "new_table",
        columns: [
          { id: crypto.randomUUID(), name: "id", type: "uuid", isPk: true },
        ],
      },
    });
  }, [addNode, screenToFlowPosition]);

  const handleAddNote = useCallback(() => {
    const position = screenToFlowPosition(cursorRef.current);
    addNode({
      id: crypto.randomUUID(),
      type: "note",
      position,
      data: {
        content: "New sticky note...",
      },
    });
  }, [addNode, screenToFlowPosition]);

  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    selectedNodes.forEach((node) => removeNode(node.id));
  }, [nodes, removeNode]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="h-full w-full" onContextMenu={handleContextMenu}>
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={handleAddTable}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Table</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleAddNote}>
          <StickyNote className="mr-2 h-4 w-4" />
          <span>Add Note</span>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Plus className="mr-2 h-4 w-4" />
            <span>Advanced</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem disabled>
              <Eye className="mr-2 h-4 w-4" />
              <span>Add View</span>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              <Layers className="mr-2 h-4 w-4" />
              <span>Add Group</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => fitView()}>
          <Maximize className="mr-2 h-4 w-4" />
          <span>Fit View</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={handleDeleteSelected}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Selected</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
