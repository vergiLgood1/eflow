"use client";

import { Center } from "@/shared/components/layout/Center";
import { Loader2 } from "lucide-react";
import { Suspense, use } from "react";
import type { DataModel } from "../../../../../prisma/generated";
import { WorkspaceDashboardEmptyState } from "../organisms/workspace-dashboard-empty-state";
import { WorkspaceDashboardContentTemplate } from "./workspace-dashboard-content-template";

interface WorkspaceDashboardTemplateProps {
    modelsPromise: Promise<DataModel[]>;
}

function DashboardContent({ modelsPromise }: { modelsPromise: Promise<DataModel[]> }) {
    const models = use(modelsPromise);

    if (models.length === 0) {
        return <WorkspaceDashboardEmptyState />;
    }

    return <WorkspaceDashboardContentTemplate modelsPromise={modelsPromise} />;
}

function DashboardLoading() {
    return (
        <Center className="h-screen">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
            </div>
        </Center>
    );
}

export function WorkspaceDashboardTemplate({
    modelsPromise,
}: WorkspaceDashboardTemplateProps) {
    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background">
            <Suspense fallback={<DashboardLoading />}>
                <DashboardContent modelsPromise={modelsPromise} />
            </Suspense>
        </div>
    );
}
