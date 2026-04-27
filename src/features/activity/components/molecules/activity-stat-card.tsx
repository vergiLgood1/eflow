import { LucideIcon } from "lucide-react";

interface ActivityStatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    colorClass?: string;
}

export function ActivityStatCard({ label, value, icon: Icon, colorClass = "text-foreground" }: ActivityStatCardProps) {
    return (
        <div className="relative group overflow-hidden bg-card/50 border border-border rounded-lg p-5">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <Icon className="h-12 w-12" />
            </div>
            <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-1">
                {label}
            </p>
            <p className={`text-3xl font-bold tracking-tighter ${colorClass}`}>
                {value}
            </p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/40 group-hover:w-full transition-all duration-500" />
        </div>
    );
}
