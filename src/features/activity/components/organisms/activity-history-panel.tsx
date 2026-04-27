"use client";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Clock, RotateCcw } from "lucide-react";
import { ActivityEmptyState } from "../atoms/activity-empty-state";


interface VersionHistoryItem {
    id: string;
    version: number;
    createdAt: Date | string;
    userName?: string;
    snapshot: any;
}

interface ActivityHistoryPanelProps {
    versions: VersionHistoryItem[];
    onRestore: (version: VersionHistoryItem) => void;
    onSelect: (version: VersionHistoryItem) => void;
    selectedId?: string;
}

export function ActivityHistoryPanel({
    versions,
    onRestore,
    onSelect,
    selectedId
}: ActivityHistoryPanelProps) {
    return (
        <div className="flex flex-col h-full bg-card border-l border-border w-80">
            <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Version History
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Track and restore previous versions
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="divide-y divide-border/50">
                    {versions.length === 0 ? (
                        <ActivityEmptyState />
                    ) : (
                        versions.map((version) => (
                            <div
                                key={version.id}
                                className={`group p-4 hover:bg-muted/30 transition-colors cursor-pointer ${selectedId === version.id ? 'bg-primary/5 border-l-2 border-primary' : ''
                                    }`}
                                onClick={() => onSelect(version)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold font-mono">
                                                v{version.version}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(version.createdAt), {
                                                    addSuffix: true,
                                                    locale: enUS
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            Modified by <span className="text-foreground">{version.userName || "Unknown User"}</span>
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRestore(version);
                                        }}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
