import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Kbd } from "@/shared/components/ui/kbd";
import { cn } from "@/shared/lib/utils";
import { LayoutGrid, LayoutTemplate, List, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { CreateDiagramDialog } from "./create-diagram-dialog";

interface WorkspaceDashboardHeaderProps {
  title: string;
  path: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}

export function WorkspaceDashboardHeader({
  title,
  path,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  className,
}: WorkspaceDashboardHeaderProps) {
  const router = useRouter();
  const pathParts = path.split("/").filter(Boolean);

  return (
    <div
      className={cn(
        "mb-10 flex flex-col items-start justify-between gap-6 md:flex-row",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-foreground mb-1 text-3xl font-extrabold tracking-tight capitalize">
          {title}
        </h1>
        <div className="text-muted-foreground/60 mb-6 flex items-center gap-2 text-sm font-medium">
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <span
                className={cn(
                  "cursor-pointer transition-colors",
                  index === pathParts.length - 1
                    ? "text-muted-foreground"
                    : "hover:text-primary",
                )}
              >
                {part}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="group relative max-w-md flex-1">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
              placeholder="Search data models..."
              className="bg-background border-border/60 focus-visible:ring-primary/20 h-10 rounded-xl pr-16 pl-10 shadow-sm focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Kbd className="bg-muted/50 border-border/50 absolute top-1/2 right-3 h-5 -translate-y-1/2 text-[10px]">
              ⌘K
            </Kbd>
          </div>

          <div className="bg-muted/30 border-border/40 flex items-center gap-1 rounded-xl border p-1 backdrop-blur-sm">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg",
                viewMode === "grid"
                  ? "shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onViewModeChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg",
                viewMode === "list"
                  ? "shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className="border-border/60 hover:bg-accent hover:border-border h-11 gap-2.5 rounded-xl px-5 text-[13px] font-bold transition-all"
          onClick={() => router.push("/templates")}
        >
          <LayoutTemplate className="text-primary h-4 w-4" />
          Templates
        </Button>
        <CreateDiagramDialog>
          <Button
            size="lg"
            className="shadow-primary/20 h-11 gap-2.5 rounded-xl px-6 text-[13px] font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            New Data Model
          </Button>
        </CreateDiagramDialog>
      </div>
    </div>
  );
}
