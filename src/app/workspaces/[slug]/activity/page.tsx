import { ActivityTemplate } from "@/features/activity/components/templates/activity-template";
import {
  getActivityLogs,
  getActivityStats,
} from "@/features/activity/applications/activity.action";

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string; time?: string }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;

  const [stats, items] = await Promise.all([
    getActivityStats(slug, filters),
    getActivityLogs(slug, filters),
  ]);

  return <ActivityTemplate stats={stats} items={items} />;
}
