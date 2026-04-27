"use client";

import { Badge } from "@/shared/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceDiagramCard } from "../molecules/workspace-diagram-card";
import { WorkspaceDashboardEmptyState } from "../organisms/workspace-dashboard-empty-state";


interface WorkspaceDiagramListProps {
    models: DataModel[];
    workspaces: Workspace[];
}

function DiagramGrid({ models, workspaces }: { models: DataModel[], workspaces: Workspace[] }) {

    if (models.length === 0) {
        return <WorkspaceDashboardEmptyState />;
    }

    const workspaceMap = new Map(workspaces.map(w => [w.id, w]));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {models.map((model) => (
                <WorkspaceDiagramCard
                    key={model.id}
                    id={model.id}
                    title={model.name}
                    workspaceName={workspaceMap.get(model.workspaceId)?.name ?? ""}
                    workspaceSlug={workspaceMap.get(model.workspaceId)?.slug ?? ""}
                    dbType={model.dbType.toLowerCase()}
                    updatedAt={`${formatDistanceToNow(new Date(model.updatedAt))} ago`}
                    isStarred={false}
                />
            ))}
        </div>
    );
}

function DiagramGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[200px] w-full bg-muted/50 animate-pulse rounded-xl" />
            ))}
        </div>
    );
}

export function WorkspaceDiagramList({ models, workspaces }: WorkspaceDiagramListProps) {
    return (
        <section className="mb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Data Models
                    {/* <Suspense fallback={<Badge variant="secondary" className="animate-pulse">...</Badge>}> */}
                    <DiagramCount models={models} workspaces={workspaces} />
                    {/* </Suspense> */}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                    Manage your ER diagrams and database schemas with ease
                </p>
            </div>
            
            {/* <Suspense fallback={<DiagramGridSkeleton />}> */}
                <DiagramGrid models={models} workspaces={workspaces} />
            {/* </Suspense> */}
        </section>
    );
}

function DiagramCount({ models, workspaces }: { models: DataModel[], workspaces: Workspace[] }) {
    return (
        <Badge variant="secondary" className="uppercase tracking-widest text-[10px] font-bold">
            {models.length} Total
        </Badge>
    );
}
