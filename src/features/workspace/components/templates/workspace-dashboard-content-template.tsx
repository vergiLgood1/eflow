import { useWorkspaceStore } from "@/features/workspace/store/use-workspace-store";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription-access";
import { WorkspaceProUpsellCard } from "../molecules/workspace-pro-upsell-card";
import { WorkspaceUpgradeBanner } from "../molecules/workspace-upgrade-banner";
import { WorkspaceDashboardHeader } from "../organisms/workspace-dashboard-header";
import { WorkspaceDiagramList } from "../organisms/workspace-diagram-list";

interface WorkspaceDashboardContentTemplateProps {
  models: DataModel[];
  workspaces: Workspace[];
  subscriptionAccess: SubscriptionAccess;
}

export function WorkspaceDashboardContentTemplate({
  models,
  workspaces,
  subscriptionAccess,
}: WorkspaceDashboardContentTemplateProps) {
  const params = useParams();
  const slug = params?.slug as string;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 300);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Hydration handling for persisted zustand store
  const [isMounted, setIsMounted] = useState(false);
  const { isBannerVisible, hideBanner } = useWorkspaceStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const currentWorkspace = workspaces.find((w) => w.slug === slug);
  const workspaceName = currentWorkspace?.name || "Workspace";

  const maxModels = subscriptionAccess.entitlements.maxPublicModels;

  return (
    <div className="mx-auto w-full p-6 pb-20 md:p-10">
      <WorkspaceDashboardHeader
        title={workspaceName}
        path={`workspaces/${slug}`}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isMounted && isBannerVisible && maxModels !== null && (
        <WorkspaceUpgradeBanner
          modelCount={models.filter((model) => model.isPublic).length}
          maxModels={maxModels}
          onDismiss={hideBanner}
        />
      )}

      <WorkspaceDiagramList
        models={filteredModels}
        workspaces={workspaces}
        viewMode={viewMode}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        subscriptionAccess={subscriptionAccess}
      />

      {!subscriptionAccess.entitlements.isPro && <WorkspaceProUpsellCard />}
    </div>
  );
}
