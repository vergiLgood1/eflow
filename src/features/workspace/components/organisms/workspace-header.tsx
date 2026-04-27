"use client";

import { signOut } from "@/features/authentication/applications/auth.action";
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
import {
    Bell,
    CreditCard,
    LifeBuoy,
    LogOut,
    Moon,
    PanelRight,
    Settings,
    Sparkles,
    Sun,
    User as UserIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { useWorkspaceStore } from "../../store/use-workspace-store";
import { WorkspaceModelToolbarButton } from "../atoms/workspace-model-toolbar-button";
import { WorkspaceDataModelSelector } from "../molecules/workspace-data-model-selector";
import { WorkspaceNotificationPopover } from "../molecules/workspace-notification-popover";
import { WorkspaceSupportDialog } from "../molecules/workspace-support-dialog";
import { WorkspaceSwitcher } from "../molecules/workspace-switcher";

interface WorkspaceHeaderProps {
    userName: string;
    workspaces: Workspace[];
    models: DataModel[];
}

export function WorkspaceHeader({
    userName,
    workspaces,
    models,
}: WorkspaceHeaderProps) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string;
    const modelId = params?.id as string;

    const { toggleChat } = useWorkspaceStore();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <header className="h-12 border-b border-border bg-card/70 backdrop-blur-md flex items-center px-4 sticky top-0 z-50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Workspaces"
                    className="h-9 w-auto px-1.5 hover:bg-accent rounded-lg"
                    onClick={() => handleNavigation(`/workspaces/${slug}`)}
                >
                    {/* Mock Brand logo */}
                    <span className="font-bold tracking-tight text-primary px-2">EFLOW</span>
                </Button>

                <div className="h-4 w-px bg-border mx-1" />

                <WorkspaceSwitcher 
                    slug={slug} 
                    initialData={workspaces} 
                />

                <WorkspaceDataModelSelector 
                    slug={slug} 
                    modelId={modelId}
                    initialData={models} 
                />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <div className="hidden lg:flex items-center gap-1 mr-2">
                    <WorkspaceSupportDialog>
                        <WorkspaceModelToolbarButton
                            tooltip="Contact Support / Report Bug"
                            icon={<LifeBuoy className="h-4 w-4 text-muted-foreground" />}
                        />
                    </WorkspaceSupportDialog>

                    <WorkspaceNotificationPopover>
                        <WorkspaceModelToolbarButton
                            tooltip="Notifications"
                            icon={<Bell className="h-4 w-4 text-muted-foreground" />}
                        />
                    </WorkspaceNotificationPopover>

                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex h-8 gap-2 text-xs font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary transition-all px-3 rounded-full"
                        onClick={() => handleNavigation(`/account/billing`)}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Upgrade
                    </Button>


                </div>

                <div className="h-4 w-px bg-border mx-1" />

                <WorkspaceModelToolbarButton 
                    tooltip="Toggle Chat" 
                    icon={<PanelRight className="h-4 w-4 text-muted-foreground" />} 
                    onClick={toggleChat}
                />

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
                            <DropdownMenuItem onClick={() => handleNavigation(`/account/profile`)}>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigation(`/account/billing`)}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNavigation(`/account/settings`)}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

