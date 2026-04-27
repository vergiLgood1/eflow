import { ActivityTemplate } from "@/features/activity/components/templates/activity-template";
import { getActivityLogs, getActivityStats } from "@/features/activity/applications/activity.action";

export default async function ActivityPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const [stats, items] = await Promise.all([
        getActivityStats(slug),
        getActivityLogs(slug)
    ]);

    return (
        <ActivityTemplate 
            stats={stats} 
            items={items} 
        />
    );
}