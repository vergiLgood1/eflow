import { Button } from "@/shared/components/ui/button";
import {
    FileCode,
    Link2,
    Plus,
    Sparkles,
    Upload
} from "lucide-react";
import { WorkspaceDashboardCard } from "../molecules/workspace-dashboard-card";
import { WorkspaceEmptyIllustration } from "../atoms/workspace-empty-illustration";

export function WorkspaceDashboardEmptyState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-gradient-to-b from-background to-background/50">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-12 flex justify-center">
                    <div className="relative w-72 h-48">
                        <WorkspaceEmptyIllustration />
                    </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                    Design your first diagram
                </h1>
                <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
                    Unleash your database architecture visually. Import from SQL, connect live, or start from scratch.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="h-5 w-5 mr-2" />
                        Create new diagram
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <WorkspaceDashboardCard
                        icon={<Upload className="h-6 w-6 text-blue-500" />}
                        title="Import SQL"
                        description="From .sql files"
                    />
                    <WorkspaceDashboardCard
                        icon={<Link2 className="h-6 w-6 text-purple-500" />}
                        title="Connect DB"
                        description="PostgreSQL, MySQL"
                    />
                    <WorkspaceDashboardCard
                        icon={<FileCode className="h-6 w-6 text-emerald-500" />}
                        title="Import file"
                        description=".dbml, .json"
                    />
                </div>

                <div className="mt-16 pt-10 border-t border-border/50">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium uppercase tracking-wider">Start with a template</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {["E-commerce", "SaaS", "Blog", "CRM"].map((template) => (
                            <Button
                                key={template}
                                variant="outline"
                                size="sm"
                                className="h-10 px-6 rounded-xl bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                {template}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
