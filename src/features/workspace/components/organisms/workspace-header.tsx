"use client";

import { signOut } from "@/features/authentication/applications/auth.action";
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription.action";
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
  PanelRight,
  Settings,
  Sparkles,
  User as UserIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { useWorkspaceStore } from "../../store/use-workspace-store";

import { ModelToolbarButton } from "@/features/model/components/atoms/model-toolbar-button";
import { EflowLogoIcon } from "@/shared/components/eflow-logo-icon";
import { WorkspaceDataModelSelector } from "../molecules/workspace-data-model-selector";
import { WorkspaceNotificationPopover } from "../molecules/workspace-notification-popover";
import { WorkspaceSupportDialog } from "../molecules/workspace-support-dialog";
import { WorkspaceSwitcher } from "../molecules/workspace-switcher";

interface WorkspaceHeaderProps {
  userName: string;
  workspaces: Workspace[];
  models: DataModel[];
  subscriptionAccess?: SubscriptionAccess | null;
}

export function WorkspaceHeader({
  userName,
  workspaces,
  models,
  subscriptionAccess,
}: WorkspaceHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const modelId = params?.id as string;

  const { toggleChat } = useWorkspaceStore();
  const entitlements = subscriptionAccess?.entitlements;
  const isPro = Boolean(entitlements?.isPro);
  const publicModelCount = models.filter((model) => model.isPublic).length;
  const publicModelLimit = entitlements?.maxPublicModels ?? null;
  const usagePercent = publicModelLimit
    ? Math.min(100, (publicModelCount / publicModelLimit) * 100)
    : 0;

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (!result.success) {
        toast.error(result.error || "Failed to log out");
        return;
      }

      // `replace` so the stale workspace shell cannot be restored with the back button.
      router.replace(result.redirectTo || "/auth/sign-in");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="border-border bg-card/70 sticky top-0 z-50 flex h-12 items-center border-b px-4 backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Workspaces"
          className="hover:bg-accent h-9 w-auto rounded-lg px-1.5"
          onClick={() => handleNavigation(`/workspaces/${slug}`)}
        >
          {/* Mock Brand logo */}
          <EflowLogoIcon className="size-4"/>
          <span className="text-primary px-2 font-bold tracking-tight">
            EFLOW
          </span>
        </Button>

        <div className="bg-border mx-1 h-4 w-px" />

        <WorkspaceSwitcher
          slug={slug}
          initialData={workspaces}
          subscriptionAccess={subscriptionAccess}
        />

        <WorkspaceDataModelSelector
          slug={slug}
          modelId={modelId}
          initialData={models}
          subscriptionAccess={subscriptionAccess}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="mr-2 hidden items-center gap-1 lg:flex">
          {/* {entitlements && (
            <button
              className={cn(
                "mr-1 flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-colors",
                isPro
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-500 hover:bg-violet-500/15"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-300",
              )}
              onClick={() => handleNavigation(`/account/billing`)}
              type="button"
            >
              {isPro ? (
                <Crown className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{isPro ? "Pro" : "Free"}</span>
              {!isPro && publicModelLimit !== null && (
                <span className="flex items-center gap-1.5 text-[10px] font-medium opacity-90">
                  <span>
                    {publicModelCount}/{publicModelLimit} public
                  </span>
                  <span className="h-1 w-10 overflow-hidden rounded-full bg-current/20">
                    <span
                      className="block h-full rounded-full bg-current"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </span>
                </span>
              )}
            </button>
          )} */}

          <WorkspaceSupportDialog>
            <ModelToolbarButton
              tooltip="Contact Support / Report Bug"
              icon={<LifeBuoy className="text-muted-foreground h-4 w-4" />}
            />
          </WorkspaceSupportDialog>

          <WorkspaceNotificationPopover>
            <ModelToolbarButton
              tooltip="Notifications"
              icon={<Bell className="text-muted-foreground h-4 w-4" />}
            />
          </WorkspaceNotificationPopover>

          {/* <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button> */}

          <Button
            variant="outline"
            size="sm"
            className="bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary hidden h-8 gap-2 rounded-full px-3 text-xs font-semibold transition-all sm:flex"
            onClick={() => handleNavigation(`/account/billing`)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isPro ? "Billing" : "Upgrade"}
          </Button>
        </div>

        <div className="bg-border mx-1 h-4 w-px" />

        <ModelToolbarButton
          tooltip="Toggle Chat"
          icon={<PanelRight className="text-muted-foreground h-4 w-4" />}
          onClick={toggleChat}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent h-8 gap-2 rounded-lg px-2 transition-all"
            >
              <div className="from-primary flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr to-purple-500 text-[10px] font-bold text-white">
                {userName.charAt(0)}
              </div>
              <span className="hidden text-sm font-medium md:inline">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userName === "Guest" ? (
              <>
                <DropdownMenuLabel>Guest Session</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleNavigation(`/auth/sign-in`)}
                >
                  <LogOut className="mr-2 h-4 w-4 rotate-180" />
                  <span>Sign In</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleNavigation(`/account/profile`)}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation(`/account/billing`)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation(`/account/settings`)}
                  >
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
