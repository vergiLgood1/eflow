import React from "react";
import { WorkspaceDiagramCard } from "../molecules/workspace-diagram-card";
import { Badge } from "@/shared/components/ui/badge";

export function WorkspaceDiagramList() {
    // Mock data for initial implementation
    const diagrams = [
        { title: "a", workspaceName: "workspace", dbType: "postgresql", updatedAt: "now ago", isStarred: true },
        { title: "E-commerce System", workspaceName: "workspace", dbType: "mysql", updatedAt: "2h ago", isPublic: false },
        { title: "Auth Service", workspaceName: "workspace", dbType: "mongodb", updatedAt: "1d ago" },
        { title: "CRM Schema", workspaceName: "workspace", dbType: "postgresql", updatedAt: "3d ago" },
    ];

    return (
        <section className="mb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Data Models
                    <Badge variant="secondary" className="uppercase tracking-widest text-[10px] font-bold">
                        {diagrams.length} Total
                    </Badge>
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                    Manage your ER diagrams and database schemas with ease
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {diagrams.map((diagram, idx) => (
                    <WorkspaceDiagramCard key={idx} {...diagram} />
                ))}
            </div>
        </section>
    );
}
