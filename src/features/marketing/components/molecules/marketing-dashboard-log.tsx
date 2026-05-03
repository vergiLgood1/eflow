import { cn } from "@/shared/lib/utils";

interface LogEntryProps {
  type: "SYSTEM" | "AGENT" | "LOGIC";
  time: string;
  message: string;
  italic?: boolean;
}

const LogEntry = ({ type, time, message, italic }: LogEntryProps) => (
  <div className="text-[11px] flex gap-2">
    <span className="text-primary">[{type}]</span>
    <span className="text-white/40">{time}</span>
    <span className={cn(italic ? "text-muted-foreground italic" : "text-white")}>
      {message}
    </span>
  </div>
);

export const MarketingDashboardLog = () => {
  return (
    <div className="bg-[rgb(18,18,20)] rounded-xl p-5 border border-white/5 font-mono">
      <h3 className="text-white text-xs uppercase tracking-[2px] font-semibold opacity-60 mb-3">
        Live Execution Log
      </h3>
      <div className="space-y-1.5 overflow-hidden">
        <LogEntry
          message="Initializing neural gateway..."
          time="14:02:11"
          type="SYSTEM"
        />
        <LogEntry
          message="Analyzing token set #4412... Success."
          time="14:02:14"
          type="AGENT"
        />
        <LogEntry
          italic
          message="Applying predictive model: V3-Stable"
          time="14:02:18"
          type="LOGIC"
        />
        <LogEntry
          message="Memory allocation at 14% capacity"
          time="14:02:22"
          type="SYSTEM"
        />
      </div>
    </div>
  );
};
