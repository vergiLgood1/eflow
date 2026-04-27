import { Clock, ArrowRight } from "lucide-react";
import { ActivityItemData } from "../../types/activity";
import { ActivityIcon } from "../atoms/activity-icon";
import { ActivityDot } from "../atoms/activity-dot";

interface ActivityItemProps {
    data: ActivityItemData;
}

export function ActivityItem({ data }: ActivityItemProps) {
    const { user, action, category, target, type, relativeTime, timestamp, changes } = data;

    return (
        <div className="group relative pl-10 py-3 first:pt-0">
            <ActivityDot />
            <div className="relative bg-card/30 border border-transparent hover:border-border/60 hover:bg-card/50 rounded-lg p-3 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <ActivityIcon type={type} />
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-foreground tracking-tight">
                                        {user}
                                    </span>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground px-1.5 py-0.5 rounded border border-border/50 bg-muted/30">
                                        {action}
                                    </span>
                                    <span className="h-0.5 w-0.5 rounded-full bg-border" />
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                                        {category}
                                    </span>
                                </div>
                                <div className="text-base font-bold text-foreground tracking-tight group-hover:text-sky-400 transition-colors">
                                    "{target}"
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                                <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
                                    <Clock className="h-2.5 w-2.5" />
                                    {relativeTime}
                                </div>
                                <div className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-tighter">
                                    {timestamp}
                                </div>
                            </div>
                        </div>

                        {changes && changes.length > 0 && (
                            <div className="relative mt-2 overflow-hidden rounded border border-border/50 group-hover:border-border transition-colors bg-card/40">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-border" />
                                <div className="p-3 pl-4 text-xs">
                                    <div className="space-y-0">
                                        {changes.map((change, idx) => (
                                            <div key={idx} className="flex items-baseline gap-2 group/field border-b border-white/[0.03] py-1 last:border-0">
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-mono w-24 shrink-0">
                                                    {change.field}
                                                </span>
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {change.oldValue && (
                                                        <>
                                                            <span className="text-xs font-mono text-rose-400/50 line-through truncate max-w-[120px]">
                                                                {change.oldValue}
                                                            </span>
                                                            <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                                                        </>
                                                    )}
                                                    <span className="text-sm font-mono text-sky-400 truncate">
                                                        {change.newValue}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
