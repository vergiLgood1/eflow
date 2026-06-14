"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Camera, FileCode, History, Plus } from "lucide-react";
import { useEffect, useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import {
  createCheckpoint,
  generateMigration,
  getCheckpoints,
} from "../../applications/checkpoint.action";
import { ModelToolbarButton } from "../atoms/model-toolbar-button";
import { Textarea } from "@/shared/components/ui/textarea";

interface Checkpoint {
  id: string;
  name: string;
  createdAt: Date;
}

export function CheckpointDialog({ dataModelId }: { dataModelId: string }) {
  const [open, setOpen] = useState(false);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [isPending, startTransition] = useTransition();

  // New checkpoint form
  const [newCpName, setNewCpName] = useState("");

  // Migration state
  const [migrationSql, setMigrationSql] = useState<string | null>(null);

  const loadCheckpoints = useCallback(() => {
    startTransition(async () => {
      const res = await getCheckpoints(dataModelId);
      if (res.success && res.data) {
        setCheckpoints(res.data);
      }
    });
  }, [dataModelId]);

  useEffect(() => {
    if (open) {
      loadCheckpoints();
    }
  }, [open, loadCheckpoints]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setMigrationSql(null);
      setNewCpName("");
    }
  };

  const handleCreateCheckpoint = () => {
    if (!newCpName.trim()) {
      toast.error("Please enter a checkpoint name");
      return;
    }

    startTransition(async () => {
      const res = await createCheckpoint(dataModelId, newCpName);
      if (res.success) {
        toast.success("Checkpoint created successfully");
        setNewCpName("");
        loadCheckpoints();
      } else {
        toast.error(res.error || "Failed to create checkpoint");
      }
    });
  };

  const handleGenerateMigration = (cpId?: string) => {
    startTransition(async () => {
      const res = await generateMigration(dataModelId, cpId);
      if (res.success && res.data) {
        setMigrationSql(res.data.sql);
        toast.success("Migration generated");
      } else if (!res.success) {
        toast.error(res.error || "Failed to generate migration");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ModelToolbarButton
          tooltip="Checkpoints & Migrations"
          icon={<History className="h-4 w-4" />}
        />
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Checkpoints & Migrations
          </DialogTitle>
          <DialogDescription>
            Save snapshots of your data model and generate SQL migrations
            against them.
          </DialogDescription>
        </DialogHeader>

        <div className="grid flex-1 gap-6 overflow-hidden py-4">
          <div className="flex flex-col gap-2">
            <Label>Create New Checkpoint</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Added User Auth tables"
                value={newCpName}
                onChange={(e) => setNewCpName(e.target.value)}
                disabled={isPending}
              />
              <Button
                onClick={handleCreateCheckpoint}
                disabled={isPending || !newCpName.trim()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Snapshot
              </Button>
            </div>
          </div>

          <div className="flex h-full min-h-0 gap-4">
            {/* Checkpoint List */}
            <div className="bg-muted/10 flex w-1/2 flex-col gap-2 rounded-md border p-2">
              <h4 className="mb-1 text-sm font-semibold">History</h4>
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  <div className="bg-background flex items-center justify-between rounded-md border p-2 text-sm">
                    <span className="font-medium">Current State (Unsaved)</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateMigration(undefined)}
                      disabled={isPending}
                    >
                      <FileCode className="mr-1 h-3 w-3" /> SQL
                    </Button>
                  </div>
                  {checkpoints.map((cp) => (
                    <div
                      key={cp.id}
                      className="bg-background flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div>
                        <div className="font-medium">{cp.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(cp.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <ModelToolbarButton
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerateMigration(cp.id)}
                        disabled={isPending}
                        tooltip="Diff with Current"
                        className="h-8 w-8"
                      >
                        <FileCode className="h-3 w-3" />
                      </ModelToolbarButton>
                    </div>
                  ))}
                  {checkpoints.length === 0 && (
                    <div className="text-muted-foreground py-4 text-center text-xs">
                      No checkpoints found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Migration View */}
            <div className="bg-muted/10 flex w-1/2 flex-col gap-2 rounded-md border p-2">
              <h4 className="mb-1 text-sm font-semibold">
                Generated Migration
              </h4>
              {migrationSql ? (
                <Textarea
                  className="bg-background flex-1 resize-none font-mono text-xs"
                  readOnly
                  value={migrationSql}
                />
              ) : (
                <div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-center text-xs italic">
                  Select a checkpoint to generate a migration script from that
                  point to the current state.
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
