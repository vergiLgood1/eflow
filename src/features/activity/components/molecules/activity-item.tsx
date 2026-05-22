import { Clock, ArrowRight } from "lucide-react";
import { ActivityItemData } from "../../types/activity";
import { ActivityIcon } from "../atoms/activity-icon";
import { ActivityDot } from "../atoms/activity-dot";

interface ActivityItemProps {
  data: ActivityItemData;
}

export function ActivityItem({ data }: ActivityItemProps) {
  const {
    user,
    action,
    category,
    target,
    type,
    relativeTime,
    timestamp,
    changes,
  } = data;

  return (
    <div className="group relative py-3 pl-10 first:pt-0">
      <ActivityDot />
      <div className="bg-card/30 hover:border-border/60 hover:bg-card/50 relative rounded-lg border border-transparent p-3 transition-all duration-300">
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          <ActivityIcon type={type} />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-foreground text-xs font-bold tracking-tight">
                    {user}
                  </span>
                  <span className="text-muted-foreground border-border/50 bg-muted/30 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-widest uppercase">
                    {action}
                  </span>
                  <span className="bg-border h-0.5 w-0.5 rounded-full" />
                  <span className="text-muted-foreground font-mono text-[9px] tracking-widest uppercase">
                    {category}
                  </span>
                </div>
                <div className="text-foreground text-base font-bold tracking-tight transition-colors group-hover:text-sky-400">
                  "{target}"
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <div className="text-muted-foreground flex items-center gap-1 font-mono text-[9px]">
                  <Clock className="h-2.5 w-2.5" />
                  {relativeTime}
                </div>
                <div className="text-muted-foreground/60 font-mono text-[8px] tracking-tighter uppercase">
                  {timestamp}
                </div>
              </div>
            </div>

            {changes && changes.length > 0 && (
              <div className="border-border/50 group-hover:border-border bg-card/40 relative mt-2 overflow-hidden rounded border transition-colors">
                <div className="bg-border absolute top-0 left-0 h-full w-0.5" />
                <div className="p-3 pl-4 text-xs">
                  <div className="space-y-0">
                    {changes.map((change, idx) => (
                      <div
                        key={idx}
                        className="group/field flex items-baseline gap-2 border-b border-white/3 py-1 last:border-0"
                      >
                        <span className="text-muted-foreground/60 w-24 shrink-0 font-mono text-[10px] tracking-wider uppercase">
                          {change.field}
                        </span>
                        <div className="flex items-center gap-2 overflow-hidden">
                          {change.oldValue && (
                            <>
                              <span className="max-w-[120px] truncate font-mono text-xs text-rose-400/50 line-through">
                                {change.oldValue}
                              </span>
                              <ArrowRight className="text-muted-foreground/40 h-3 w-3 shrink-0" />
                            </>
                          )}
                          <span className="truncate font-mono text-sm text-sky-400">
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
