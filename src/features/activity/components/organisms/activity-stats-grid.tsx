import { Layers } from "lucide-react";
import { ActivityStats } from "../../types/activity";
import { ActivityStatCard } from "../molecules/activity-stat-card";

interface ActivityStatsGridProps {
    stats: ActivityStats;
}

export function ActivityStatsGrid({ stats }: ActivityStatsGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <ActivityStatCard 
                label="Total Actions" 
                value={stats.total} 
                icon={Layers} 
            />
            <ActivityStatCard 
                label="Creations" 
                value={stats.creations} 
                icon={Layers} 
                colorClass="text-emerald-400"
            />
            <ActivityStatCard 
                label="Updates" 
                value={stats.updates} 
                icon={Layers} 
                colorClass="text-sky-400"
            />
            <ActivityStatCard 
                label="Deletions" 
                value={stats.deletions} 
                icon={Layers} 
                colorClass="text-rose-400"
            />
        </div>
    );
}
