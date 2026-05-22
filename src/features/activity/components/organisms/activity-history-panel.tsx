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
  selectedId,
}: ActivityHistoryPanelProps) {
  return (
    <div className="bg-card border-border flex h-full w-80 flex-col border-l">
      <div className="border-border bg-muted/20 border-b p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="h-4 w-4" />
          Version History
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Track and restore previous versions
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-border/50 divide-y">
          {versions.length === 0 ? (
            <ActivityEmptyState />
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className={`group hover:bg-muted/30 cursor-pointer p-4 transition-colors ${
                  selectedId === version.id
                    ? "bg-primary/5 border-primary border-l-2"
                    : ""
                }`}
                onClick={() => onSelect(version)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold">
                        v{version.version}
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {formatDistanceToNow(new Date(version.createdAt), {
                          addSuffix: true,
                          locale: enUS,
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Modified by{" "}
                      <span className="text-foreground">
                        {version.userName || "Unknown User"}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
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
