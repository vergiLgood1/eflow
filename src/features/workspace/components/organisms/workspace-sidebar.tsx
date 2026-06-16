"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription.action";
import {
  Clock,
  Crown,
  Database,
  FileText,
  Layers,
  Link2,
  Sparkles,
} from "lucide-react";
import { WorkspaceSidebarItem } from "../molecules/workspace-sidebar-item";

import { useParams, useRouter } from "next/navigation";
import type { DataModel } from "../../../../../prisma/generated";

export function WorkspaceSidebar({
  models = [],
  subscriptionAccess,
}: {
  models?: DataModel[];
  subscriptionAccess?: SubscriptionAccess | null;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const entitlements = subscriptionAccess?.entitlements;
  const isPro = Boolean(entitlements?.isPro);
  const publicModelLimit = entitlements?.maxPublicModels ?? null;
  const publicModelCount = models.filter((model) => model.isPublic).length;
  const usagePercent = publicModelLimit
    ? Math.min(100, (publicModelCount / publicModelLimit) * 100)
    : 0;
  const hasReachedPublicModelLimit =
    publicModelLimit !== null && publicModelCount >= publicModelLimit;

  // Pinned models from the current workspace (server-side truth)
  const pinnedModels = models.filter((m) => m.isPinned);

  const allPinned = pinnedModels.map((m) => ({
    id: m.id,
    name: m.name,
    slug: slug,
  }));

  return (
    <aside className="border-border bg-card/20 sticky top-12 flex h-[calc(100vh-48px)] w-[260px] shrink-0 flex-col border-r backdrop-blur-sm">
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-8 p-4">
          {/* Primary Navigation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
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
                href={`/explore`}
              />
            </nav>
          </div>

          {/* Pinned Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
                Pinned
              </span>
              <Badge
                variant="secondary"
                className="bg-muted/40 text-muted-foreground border-border/40 h-5 rounded-md px-1.5 text-[10px] font-bold"
              >
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
                <div className="border-border/60 bg-muted/5 group hover:bg-muted/10 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center transition-all">
                  <div className="bg-muted/50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg transition-all group-hover:scale-110">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="text-muted-foreground text-[11px] font-medium">
                    Pin your favorite diagrams
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Sidebar Footer/Status */}
      <div className="border-border/50 border-t p-4">
        <div className="border-primary/10 bg-primary/5 rounded-xl border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-lg">
                {isPro ? (
                  <Crown className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
              </div>
              <div>
                <span className="text-foreground block text-[11px] font-semibold">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {isPro ? "Unlimited diagrams" : "Public diagram usage"}
                </span>
              </div>
            </div>

            {!isPro && publicModelLimit !== null && (
              <Badge
                variant={hasReachedPublicModelLimit ? "destructive" : "secondary"}
                className="h-5 rounded-md px-1.5 text-[10px] font-bold"
              >
                {publicModelCount}/{publicModelLimit}
              </Badge>
            )}
          </div>

          {isPro ? (
            <p className="text-muted-foreground text-[10px] leading-relaxed">
              Private diagrams and unlimited creation are enabled for this
              workspace.
            </p>
          ) : (
            <>
              {publicModelLimit !== null && (
                <div className="bg-primary/10 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              )}
              <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
                {hasReachedPublicModelLimit
                  ? "Free limit reached. Upgrade to create more public or private diagrams."
                  : "Free includes 3 public diagrams. Upgrade for private and unlimited diagrams."}
              </p>
              <Button
                size="sm"
                className="mt-3 h-8 w-full rounded-lg text-xs font-semibold"
                onClick={() => router.push("/account/billing")}
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {hasReachedPublicModelLimit ? "Upgrade Required" : "Upgrade"}
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
