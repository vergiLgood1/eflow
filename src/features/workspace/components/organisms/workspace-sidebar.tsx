"use client"

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
    Clock,
    Database,
    FileText,
    Layers,
    Link2,
    Plus,
    Settings,
    Users
} from "lucide-react";
import { WorkspaceSidebarItem } from "../molecules/workspace-sidebar-item";

export function WorkspaceSidebar() {
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
                            />
                            <WorkspaceSidebarItem 
                                icon={<Link2 className="h-4 w-4" />} 
                                label="Explore" 
                            />
                        </nav>
                    </div>

                    {/* Pinned Items Section */}
                    <div className="space-y-3">
                        <div className="px-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                Pinned
                            </span>
                            <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground">
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="px-4 py-10 border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center text-center gap-3 bg-muted/5 group transition-all hover:bg-muted/10">
                            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground transition-all group-hover:scale-110 group-hover:bg-primary/5 group-hover:text-primary">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div className="text-[12px] text-muted-foreground font-medium">
                                Pin your favorite <br/> diagrams here
                            </div>
                        </div>
                    </div>

                    {/* Workspace Management */}
                    <div className="space-y-3">
                        <div className="px-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                Administration
                            </span>
                        </div>
                        <nav className="space-y-1">
                            <WorkspaceSidebarItem 
                                icon={<Users className="h-4 w-4" />} 
                                label="Team Members" 
                            />
                            <WorkspaceSidebarItem 
                                icon={<Settings className="h-4 w-4" />} 
                                label="Workspace Settings" 
                            />
                            <WorkspaceSidebarItem 
                                icon={<FileText className="h-4 w-4" />} 
                                label="Resources" 
                            />
                        </nav>
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
