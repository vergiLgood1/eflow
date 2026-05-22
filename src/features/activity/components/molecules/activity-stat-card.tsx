import { LucideIcon } from "lucide-react";

interface ActivityStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass?: string;
}

export function ActivityStatCard({
  label,
  value,
  icon: Icon,
  colorClass = "text-foreground",
}: ActivityStatCardProps) {
  return (
    <div className="group bg-card/50 border-border relative overflow-hidden rounded-lg border p-5">
      <div className="absolute top-0 right-0 p-3 opacity-5">
        <Icon className="h-12 w-12" />
      </div>
      <p className="text-muted-foreground mb-1 font-mono text-[10px] tracking-widest uppercase">
        {label}
      </p>
      <p className={`text-3xl font-bold tracking-tighter ${colorClass}`}>
        {value}
      </p>
      <div className="bg-primary/40 absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
