"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { useEffect, useState } from "react";

export function NotesPopover({ nodeId, data, onClose }: { nodeId: string; data: TableNodeData; onClose: () => void }) {
    const { updateTable } = useTableActions();
    const [notes, setNotes] = useState(data.notes ?? "");

    // Real-time synchronization
    useEffect(() => {
        if (notes !== data.notes) {
            updateTable(nodeId, { notes });
        }
    }, [notes, data.notes, nodeId, updateTable]);

    return (
        <div className="grid gap-2 min-w-[280px]">
            <div className="border-b border-border pb-2 mb-1">
                <div className="text-sm font-semibold text-foreground">Notes</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Table: {data.name}</div>
            </div>

            <div className="grid gap-1.5">
                <Label className="text-xs font-semibold text-foreground/80">Table Documentation</Label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[140px] w-full resize-y rounded border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 transition-colors focus:border-primary/50"
                    placeholder="Write notes about this table…"
                    autoFocus
                />
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-border mt-2 pt-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}
