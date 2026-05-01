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
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createCheckpoint, generateMigration, getCheckpoints } from "../../applications/checkpoint.action";
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

    const loadCheckpoints = () => {
        startTransition(async () => {
            const res = await getCheckpoints(dataModelId);
            if (res.success && res.data) {
                setCheckpoints(res.data);
            }
        });
    };

    useEffect(() => {
        if (open) {
            loadCheckpoints();
            setMigrationSql(null);
            setNewCpName("");
        }
    }, [open, dataModelId]);

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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ModelToolbarButton tooltip="Checkpoints & Migrations" icon={<History className="h-4 w-4" />} />
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Checkpoints & Migrations
                    </DialogTitle>
                    <DialogDescription>
                        Save snapshots of your data model and generate SQL migrations against them.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4 flex-1 overflow-hidden">
                    <div className="flex flex-col gap-2">
                        <Label>Create New Checkpoint</Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="e.g., Added User Auth tables" 
                                value={newCpName}
                                onChange={e => setNewCpName(e.target.value)}
                                disabled={isPending}
                            />
                            <Button onClick={handleCreateCheckpoint} disabled={isPending || !newCpName.trim()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Snapshot
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-4 h-full min-h-0">
                        {/* Checkpoint List */}
                        <div className="w-1/2 flex flex-col gap-2 border rounded-md p-2 bg-muted/10">
                            <h4 className="text-sm font-semibold mb-1">History</h4>
                            <ScrollArea className="flex-1">
                                <div className="space-y-2">
                                    <div className="p-2 text-sm border rounded-md flex justify-between items-center bg-background">
                                        <span className="font-medium">Current State (Unsaved)</span>
                                        <Button size="sm" variant="outline" onClick={() => handleGenerateMigration(undefined)} disabled={isPending}>
                                            <FileCode className="w-3 h-3 mr-1" /> SQL
                                        </Button>
                                    </div>
                                    {checkpoints.map(cp => (
                                        <div key={cp.id} className="p-2 text-sm border rounded-md flex justify-between items-center bg-background">
                                            <div>
                                                <div className="font-medium">{cp.name}</div>
                                                <div className="text-xs text-muted-foreground">{new Date(cp.createdAt).toLocaleString()}</div>
                                            </div>
                                            <ModelToolbarButton size="sm" variant="ghost" onClick={() => handleGenerateMigration(cp.id)} disabled={isPending} tooltip="Diff with Current" className="h-8 w-8">
                                                <FileCode className="w-3 h-3" />
                                            </ModelToolbarButton>
                                        </div>
                                    ))}
                                    {checkpoints.length === 0 && (
                                        <div className="text-center text-muted-foreground text-xs py-4">No checkpoints found</div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Migration View */}
                        <div className="w-1/2 flex flex-col gap-2 border rounded-md p-2 bg-muted/10">
                            <h4 className="text-sm font-semibold mb-1">Generated Migration</h4>
                            {migrationSql ? (
                                <Textarea 
                                    className="flex-1 font-mono text-xs resize-none bg-background" 
                                    readOnly 
                                    value={migrationSql} 
                                />
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground italic text-center p-4">
                                    Select a checkpoint to generate a migration script from that point to the current state.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
