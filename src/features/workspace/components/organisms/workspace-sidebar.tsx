"use client"

import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
    Clock,
    Database,
    FileText,
    Layers,
    Link2
} from "lucide-react";
import { WorkspaceSidebarItem } from "../molecules/workspace-sidebar-item";

import { useParams } from "next/navigation";
import type { DataModel } from "../../../../../prisma/generated";

export function WorkspaceSidebar({ models = [] }: { models?: DataModel[] }) {
    const params = useParams();
    const slug = params?.slug as string;

    // Pinned models from the current workspace (server-side truth)
    const pinnedModels = models.filter(m => m.isPinned);
    
    const allPinned = pinnedModels.map(m => ({ id: m.id, name: m.name, slug: slug }));

    return (
        <aside className="w-[260px] shrink-0 border-r border-border bg-card/20 backdrop-blur-sm flex flex-col sticky top-12 h-[calc(100vh-48px)]">
            <ScrollArea className="flex-1 ">
                <div className="p-4 flex flex-col gap-8">
                    {/* Primary Navigation */}
                    <div className="space-y-3">
                        <div className="px-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                Main Menu
                            </span>
                        </div>
                        <nav className="space-y-1">
                            <WorkspaceSidebarItem 
                                icon={<Database className="h-4 w-4" />} 
                                label="Dashboard" 
                                isActive 
                            />
                            <WorkspaceSidebarItem 
                                icon={<Clock className="h-4 w-4" />} 
                                label="Activity" 
                                href={`/workspaces/${slug}/activity`}
                            />
                            <WorkspaceSidebarItem 
                                icon={<Link2 className="h-4 w-4" />} 
                                label="Explore" 
                                href={`/workspaces/${slug}/explore`}
                            />
                        </nav>
                    </div>

                    {/* Pinned Items Section */}
                    <div className="space-y-3">
                        <div className="px-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                Pinned
                            </span>
                            <Badge variant="secondary" className="h-5 px-1.5 rounded-md font-bold text-[10px] bg-muted/40 text-muted-foreground border-border/40">
                                {allPinned.length}
                            </Badge>
                        </div>
                        
                        <div className="space-y-1">
                            {allPinned.length > 0 ? (
                                allPinned.map((diagram) => (
                                    <WorkspaceSidebarItem 
                                        key={diagram.id}
                                        icon={<FileText className="h-4 w-4" />} 
                                        label={diagram.name}
                                        href={`/workspaces/${diagram.slug}/model/${diagram.id}`}
                                    />
                                ))
                            ) : (
                                <div className="px-4 py-8 border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center text-center gap-2 bg-muted/5 group transition-all hover:bg-muted/10">
                                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground transition-all group-hover:scale-110 group-hover:bg-primary/5 group-hover:text-primary">
                                        <Layers className="h-4 w-4" />
                                    </div>
                                    <div className="text-[11px] text-muted-foreground font-medium">
                                        Pin your favorite diagrams
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                  
                </div>
            </ScrollArea>
            
            {/* Sidebar Footer/Status */}
            <div className="p-4 border-t border-border/50">
                <div className="rounded-xl bg-primary/5 p-3 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[11px] font-semibold text-primary">Free Plan</span>
                    </div>
                    <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[40%]" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                        4 of 10 diagrams used
                    </p>
                </div>
            </div>
        </aside>
    );
}
