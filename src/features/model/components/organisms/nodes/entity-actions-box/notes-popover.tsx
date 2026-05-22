"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { TableNodeData } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { useEffect, useState } from "react";

export function NotesPopover({
  nodeId,
  data,
  onClose,
}: {
  nodeId: string;
  data: TableNodeData;
  onClose: () => void;
}) {
  const { updateTable } = useTableActions();
  const [notes, setNotes] = useState(data.notes ?? "");

  // Real-time synchronization
  useEffect(() => {
    if (notes !== data.notes) {
      updateTable(nodeId, { notes });
    }
  }, [notes, data.notes, nodeId, updateTable]);

  return (
    <div className="grid min-w-[280px] gap-2">
      <div className="border-border mb-1 border-b pb-2">
        <div className="text-foreground text-sm font-semibold">Notes</div>
        <div className="text-muted-foreground mt-0.5 text-[10px]">
          Table: {data.name}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label className="text-foreground/80 text-xs font-semibold">
          Table Documentation
        </Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 min-h-[140px] w-full resize-y rounded border px-3 py-2 text-[13px] transition-colors outline-none"
          placeholder="Write notes about this table…"
          autoFocus
        />
      </div>

      <div className="border-border mt-2 flex justify-end gap-2 border-t pt-1 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
