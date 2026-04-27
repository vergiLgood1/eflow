import { ActivityStats, ActivityItemData } from "../../types/activity";
import { ActivityHeader } from "../organisms/activity-header";
import { ActivityStatsGrid } from "../organisms/activity-stats-grid";
import { ActivityFilterTabs } from "../organisms/activity-filter-tabs";
import { ActivityTimeline } from "../organisms/activity-timeline";

interface ActivityTemplateProps {
    stats: ActivityStats;
    items: ActivityItemData[];
}

export function ActivityTemplate({ stats, items }: ActivityTemplateProps) {
    return (
        <div className="min-h-screen bg-background">
            <ActivityHeader />
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                <ActivityStatsGrid stats={stats} />
                <ActivityFilterTabs />
                <ActivityTimeline items={items} />
            </div>
        </div>
    );
}
