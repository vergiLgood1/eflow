import { Button } from "@/shared/components/ui/button";
import { FileCode, Link2, Plus, Sparkles, Upload } from "lucide-react";
import { WorkspaceEmptyIllustration } from "../atoms/workspace-empty-illustration";
import { WorkspaceDashboardCard } from "../molecules/workspace-dashboard-card";
import { ImportSchemaDialog } from "@/shared/components/ui/import-schema-dialog";
import { ConnectDbDialog } from "./connect-db-dialog";
import { CreateDiagramDialog } from "./create-diagram-dialog";

const TEMPLATES = ["E-commerce", "SaaS", "Blog", "CRM"];

export function WorkspaceDashboardEmptyState() {
  return (
    <div className="from-background to-background/50 flex flex-1 flex-col items-center justify-center overflow-y-auto bg-linear-to-b p-8">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-12 flex justify-center">
          <div className="relative h-48 w-72">
            <WorkspaceEmptyIllustration />
          </div>
        </div>

        <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
          Design your first diagram
        </h1>
        <p className="text-muted-foreground mx-auto mb-10 max-w-md text-lg leading-relaxed">
          Unleash your database architecture visually. Import from SQL, connect
          live, or start from scratch.
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CreateDiagramDialog>
            <Button
              size="lg"
              className="shadow-primary/20 h-12 px-8 text-base shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create new diagram
            </Button>
          </CreateDiagramDialog>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-3">
          <ImportSchemaDialog defaultMode="sql">
            <WorkspaceDashboardCard
              icon={<Upload className="h-6 w-6 text-blue-500" />}
              title="Import SQL"
              description="From .sql files"
            />
          </ImportSchemaDialog>
          <ConnectDbDialog>
            <WorkspaceDashboardCard
              icon={<Link2 className="h-6 w-6 text-purple-500" />}
              title="Connect DB"
              description="PostgreSQL, MySQL"
            />
          </ConnectDbDialog>
          <ImportSchemaDialog defaultMode="dbml">
            <WorkspaceDashboardCard
              icon={<FileCode className="h-6 w-6 text-emerald-500" />}
              title="Import file"
              description=".dbml, .sql"
            />
          </ImportSchemaDialog>
        </div>

        <div className="border-border/50 mt-16 border-t pt-10">
          <div className="text-muted-foreground mb-6 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Start with a template
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {TEMPLATES.map((template) => (
              <Button
                key={template}
                variant="outline"
                size="sm"
                className="bg-card/50 border-border hover:border-primary/50 hover:bg-primary/5 h-10 rounded-xl px-6 backdrop-blur-sm transition-all"
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
