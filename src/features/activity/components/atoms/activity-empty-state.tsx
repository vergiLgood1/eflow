import { Activity } from "lucide-react";

export function ActivityEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-50" />
                <div className="relative h-20 w-20 rounded-3xl bg-card border border-border/50 shadow-2xl flex items-center justify-center -rotate-6">
                    <Activity className="h-10 w-10 text-muted-foreground/40" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-foreground">Quiet in the workspace</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                No activity recorded yet. Start building your data model to see changes appear here.
            </p>
        </div>
    );
}
