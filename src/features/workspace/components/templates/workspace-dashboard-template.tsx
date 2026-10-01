"use client";

import { Center } from "@/shared/components/layout/Center";
import { Loader2 } from "lucide-react";
import { Suspense, use } from "react";
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription-access";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceDashboardEmptyState } from "../organisms/workspace-dashboard-empty-state";
import { WorkspaceDashboardContentTemplate } from "./workspace-dashboard-content-template";

interface WorkspaceDashboardTemplateProps {
  modelsPromise: Promise<DataModel[]>;
  workspacePromise: Promise<Workspace[]>;
  subscriptionAccessPromise: Promise<SubscriptionAccess>;
}

function DashboardContent({
  modelsPromise,
  workspacePromise,
  subscriptionAccessPromise,
}: {
  modelsPromise: Promise<DataModel[]>;
  workspacePromise: Promise<Workspace[]>;
  subscriptionAccessPromise: Promise<SubscriptionAccess>;
}) {
  const models = use(modelsPromise);
  const workspaces = use(workspacePromise);
  const subscriptionAccess = use(subscriptionAccessPromise);

  if (models.length === 0) {
    return <WorkspaceDashboardEmptyState />;
  }

  return (
    <WorkspaceDashboardContentTemplate
      models={models}
      workspaces={workspaces}
      subscriptionAccess={subscriptionAccess}
    />
  );
}

function DashboardLoading() {
  return (
    <Center className="h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="text-primary/50 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">
          Loading workspace...
        </p>
      </div>
    </Center>
  );
}

export function WorkspaceDashboardTemplate({
  modelsPromise,
  workspacePromise,
  subscriptionAccessPromise,
}: WorkspaceDashboardTemplateProps) {
  return (
    <div className="bg-background flex min-w-0 flex-1 flex-col">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent
          modelsPromise={modelsPromise}
          workspacePromise={workspacePromise}
          subscriptionAccessPromise={subscriptionAccessPromise}
        />
      </Suspense>
    </div>
  );
}
