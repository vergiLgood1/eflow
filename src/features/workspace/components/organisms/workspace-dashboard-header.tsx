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
    const pathParts = path.split('/').filter(Boolean);

    return (
        <div className={cn("flex flex-col md:flex-row items-start justify-between gap-6 mb-10", className)}>
            <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-1 capitalize">
                    {title}
                </h1>
                <div className="text-sm font-medium text-muted-foreground/60 mb-6 flex items-center gap-2">
                    {pathParts.map((part, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span>/</span>}
                            <span className={cn(
                                "transition-colors cursor-pointer",
                                index === pathParts.length - 1 ? "text-muted-foreground" : "hover:text-primary"
                            )}>
                                {part}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
                        <Input
                            placeholder="Search data models..."
                            className="pl-10 pr-16 h-10 rounded-xl bg-background shadow-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <Kbd className="absolute right-3 top-1/2 -translate-y-1/2 h-5 text-[10px] bg-muted/50 border-border/50">
                            ⌘K
                        </Kbd>
                    </div>

                    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/40 backdrop-blur-sm">
                        <Button 
                            variant={viewMode === "grid" ? "secondary" : "ghost"} 
                            size="icon" 
                            className={cn("h-8 w-8 rounded-lg", viewMode === "grid" ? "shadow-sm" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => onViewModeChange("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant={viewMode === "list" ? "secondary" : "ghost"} 
                            size="icon" 
                            className={cn("h-8 w-8 rounded-lg", viewMode === "list" ? "shadow-sm" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => onViewModeChange("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-11 px-5 gap-2.5 border-border/60 hover:bg-accent hover:border-border font-bold text-[13px] rounded-xl transition-all"
                    onClick={() => router.push("/templates")}
                >
                    <LayoutTemplate className="h-4 w-4 text-primary" />
                    Templates
                </Button>
                <CreateDiagramDialog>
                    <Button size="lg" className="h-11 px-6 gap-2.5 shadow-lg shadow-primary/20 font-bold text-[13px] rounded-xl transition-all hover:scale-105 active:scale-95">
                        <Plus className="h-5 w-5" />
                        New Data Model
                    </Button>
                </CreateDiagramDialog>
            </div>
        </div>
    );
}
