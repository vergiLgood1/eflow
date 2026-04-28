"use client";

import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { PopoverHeader } from "./popover-header";
import { Button } from "@/shared/components/ui/button";

export function DeletePopover({ nodeId, tableName, onClose }: { nodeId: string; tableName: string; onClose: () => void }) {
    const removeNode = useCanvasStore((s) => s.removeNode);

    const handleDelete = () => {
        removeNode(nodeId);
        onClose();
    };

    return (
        <div className="p-1">
            <PopoverHeader title="Delete Table" description="This action cannot be undone" />
            <div className="space-y-3">
                <p className="text-sm">
                    Are you sure you want to delete table <span className="font-semibold text-destructive">{tableName}</span>?
                </p>
                <p className="text-xs text-muted-foreground">This will also remove all connected relationships in the diagram.</p>
                <div className="flex justify-end gap-2 pt-1 border-t border-border mt-2 pt-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={handleDelete}>
                        Confirm Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
