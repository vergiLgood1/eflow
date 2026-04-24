"use client"

import React from "react";
import { 
    LifeBuoy, 
    Bell, 
    Sun, 
    Moon, 
    Sparkles, 
    PanelRight, 
    User as UserIcon,
    LogOut,
    Settings,
    CreditCard
} from "lucide-react";
import { WorkspaceSwitcher } from "../molecules/workspace-switcher";
import { WorkspaceDataModelSelector } from "../molecules/workspace-data-model-selector";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface WorkspaceHeaderProps {
    userName: string;
}

export function WorkspaceHeader({ userName }: WorkspaceHeaderProps) {
    return (
        <header className="h-12 border-b border-border bg-card/70 backdrop-blur-md flex items-center px-4 sticky top-0 z-50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Workspaces"
                    className="h-9 w-auto px-1.5 hover:bg-accent rounded-lg"
                >
                    <img
                        alt="ERFlow logo"
                        className="h-7 w-auto object-contain dark:hidden"
                        src="/erflow-logo-black.png"
                    />
                    <img
                        alt="ERFlow logo"
                        className="h-7 w-auto object-contain hidden dark:block"
                        src="/erflow-logo-white.png"
                    />
                </Button>
                
                <div className="h-4 w-px bg-border mx-1" />
                
                <WorkspaceSwitcher workspaceName="My Workspace" />
                <WorkspaceDataModelSelector />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
                <div className="hidden lg:flex items-center gap-1 mr-2">
                    <Button variant="ghost" size="icon" aria-label="Support" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <LifeBuoy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Notifications" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary border-2 border-background" />
                    </Button>
                </div>

                <Button variant="ghost" size="icon" aria-label="Toggle theme" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Button variant="outline" size="sm" className="hidden sm:flex h-8 gap-2 text-xs font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary transition-all px-3 rounded-full">
                    <Sparkles className="h-3.5 w-3.5" />
                    Upgrade
                </Button>

                <div className="h-4 w-px bg-border mx-1" />

                <Button variant="ghost" size="icon" aria-label="Toggle Chat" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <PanelRight className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 hover:bg-accent rounded-lg transition-all">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                {userName.charAt(0)}
                            </div>
                            <span className="hidden md:inline text-sm font-medium">
                                {userName}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
