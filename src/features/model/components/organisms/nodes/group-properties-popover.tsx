"use client";

import { GroupNodeData } from "@/features/model/types/canvas";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { PopoverHeader } from "../../atoms/popover-header";
import { useState, useEffect } from "react";

export function GroupPropertiesPopover({
  nodeId,
  data,
  onClose,
}: {
  nodeId: string;
  data: GroupNodeData;
  onClose: () => void;
}) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description || "");

  // Real-time synchronization
  useEffect(() => {
    if (name !== data.name || description !== (data.description || "")) {
      updateNodeData(nodeId, { name, description });
    }
  }, [name, description, data.name, data.description, nodeId, updateNodeData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="p-1">
      <PopoverHeader
        title="Group Properties"
        description="Configure group settings"
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Group Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-muted/20 border-border/50 focus-visible:ring-primary h-9 text-sm"
            placeholder="Group name..."
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Description
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-muted/20 border-border/50 focus-visible:ring-primary min-h-[80px] resize-none text-sm"
            placeholder="Add a description for this group..."
          />
        </div>

        <Button
          type="submit"
          className="h-9 w-full text-xs font-bold tracking-widest uppercase"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
