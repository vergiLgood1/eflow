import React from "react";
import { WorkspaceDashboardEmptyState } from "../organisms/workspace-dashboard-empty-state";

export function WorkspaceDashboardTemplate() {
    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* If we had actual diagrams, we would render them here. 
                For now, we only have the empty state. */}
            <WorkspaceDashboardEmptyState />
        </div>
    );
}
