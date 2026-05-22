import { Activity } from "lucide-react";

export function ActivityEmptyState() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center py-24 text-center duration-700">
      <div className="relative mb-6">
        <div className="bg-primary/20 absolute inset-0 scale-150 rounded-full opacity-50 blur-3xl" />
        <div className="bg-card border-border/50 relative flex h-20 w-20 -rotate-6 items-center justify-center rounded-3xl border shadow-2xl">
          <Activity className="text-muted-foreground/40 h-10 w-10" />
        </div>
      </div>
      <h3 className="text-foreground text-xl font-bold">
        Quiet in the workspace
      </h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm">
        No activity recorded yet. Start building your data model to see changes
        appear here.
      </p>
    </div>
  );
}
