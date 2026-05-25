import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Bell,
  Database,
  FolderKanban,
  LayoutGrid,
  LayoutTemplate,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
  Zap,
} from "lucide-react";

const dashboardModels = [
  {
    title: "Core product schema",
    workspace: "Launch Lab",
    database: "postgresql",
    updatedAt: "12 min ago",
    visibility: "Private",
    isPinned: true,
  },
  {
    title: "Billing model",
    workspace: "Launch Lab",
    database: "mysql",
    updatedAt: "1h ago",
    visibility: "Private",
    isPinned: false,
  },
  {
    title: "Content workflow",
    workspace: "Launch Lab",
    database: "postgresql",
    updatedAt: "Yesterday",
    visibility: "Public",
    isPinned: false,
  },
  {
    title: "Analytics events",
    workspace: "Launch Lab",
    database: "sqlite",
    updatedAt: "2d ago",
    visibility: "Private",
    isPinned: false,
  },
];

const sidebarItems = ["Dashboard", "Models", "Activity", "Settings"];

export const MarketingWorkspaceDashboardMock = () => {
  return (
    <div className="pointer-events-none h-full w-full overflow-hidden bg-background text-foreground">
      <div className="flex h-full min-h-[520px] flex-col">
        <div className="flex h-14 items-center justify-between border-b border-white/10 bg-card/70 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Eflow</p>
              <p className="text-[10px] text-muted-foreground">Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-muted-foreground">
              Launch Lab
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-52 shrink-0 border-r border-white/10 bg-card/40 p-3 md:block">
            <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Current workspace
              </p>
              <p className="mt-2 text-sm font-semibold">Launch Lab</p>
            </div>
            <div className="space-y-1">
              {sidebarItems.map((item, index) => (
                <div
                  key={item}
                  className={
                    index === 0
                      ? "flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
                      : "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground"
                  }
                >
                  {index === 0 ? (
                    <FolderKanban className="h-3.5 w-3.5" />
                  ) : (
                    <Settings className="h-3.5 w-3.5" />
                  )}
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-hidden p-5 md:p-8">
            <div className="mb-7 flex flex-col items-start justify-between gap-5 lg:flex-row">
              <div className="min-w-0 flex-1">
                <h1 className="mb-1 text-3xl font-extrabold tracking-tight">
                  Launch Lab
                </h1>
                <div className="mb-5 flex items-center gap-2 text-xs font-medium text-muted-foreground/70">
                  <span>workspaces</span>
                  <span>/</span>
                  <span className="text-muted-foreground">launch-lab</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[240px] flex-1 max-w-md">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      readOnly
                      value=""
                      placeholder="Search data models..."
                      className="h-10 rounded-xl border-border/60 bg-background pl-10"
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      K
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-muted/30 p-1">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Button variant="outline" className="h-10 gap-2 rounded-xl px-4 text-xs font-bold">
                  <LayoutTemplate className="h-4 w-4 text-primary" />
                  Templates
                </Button>
                <Button className="h-10 gap-2 rounded-xl px-4 text-xs font-bold">
                  <Plus className="h-4 w-4" />
                  New Data Model
                </Button>
              </div>
            </div>

            <div className="mb-7 overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold">Workspace snapshot</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Four active schema drafts, checkpoints enabled, SQL export ready.
                  </p>
                </div>
                <div className="hidden w-32 space-y-1 md:block">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                    <span>Models</span>
                    <span>4/8</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-blue-500/10">
                    <div className="h-full w-1/2 rounded-full bg-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            <section>
              <div className="mb-5">
                <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                  Data Models
                  <Badge variant="secondary" className="text-[10px] font-bold tracking-widest uppercase">
                    4 Total
                  </Badge>
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  Manage ER diagrams and schema drafts from one workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardModels.map((model) => (
                  <div
                    key={model.title}
                    className="overflow-hidden rounded-xl border border-border bg-card/50 text-left"
                  >
                    <div className="relative h-28 bg-background bg-[radial-gradient(circle,rgba(63,63,70,0.18)_1px,transparent_1px)] bg-size-[12px_12px]">
                      <div className="absolute inset-4 flex items-center justify-center gap-2 opacity-40">
                        <div className="h-11 w-16 rounded border border-border border-t-primary bg-muted border-t-[3px]" />
                        <div className="h-9 w-16 rounded border border-border border-t-primary bg-muted border-t-[3px]" />
                      </div>
                      <Star
                        className={
                          model.isPinned
                            ? "absolute top-3 right-3 h-4 w-4 fill-yellow-500 text-yellow-500"
                            : "absolute top-3 right-3 h-4 w-4 text-muted-foreground/50"
                        }
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-[11px]">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="truncate font-semibold tracking-wider text-muted-foreground uppercase">
                          {model.workspace}
                        </span>
                        <span className="ml-auto rounded-md border border-border bg-muted px-1.5 py-0.5 font-medium text-muted-foreground">
                          {model.visibility}
                        </span>
                      </div>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="truncate font-semibold">{model.title}</h3>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-auto flex items-center justify-between text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                        <span>{model.database}</span>
                        <span>{model.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
