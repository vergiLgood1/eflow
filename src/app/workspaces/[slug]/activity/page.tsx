import { ActivityTemplate } from "@/features/activity/components/templates/activity-template";
import {
  getActivityLogs,
  getActivityStats,
} from "@/features/activity/applications/activity.action";
import { AppError } from "@/shared/lib/error";
import { notFound, redirect } from "next/navigation";

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string; time?: string }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;

  try {
    const [stats, items] = await Promise.all([
      getActivityStats(slug, filters),
      getActivityLogs(slug, filters),
    ]);

    return <ActivityTemplate stats={stats} items={items} />;
  } catch (error) {
    // The feed is scoped to a workspace the visitor must belong to. A caller
    // without a session goes back to sign-in; anyone else — including a valid
    // session that is not a member — gets a 404, so the existence of the slug
    // is not leaked. Anything unexpected keeps propagating to the error
    // boundary rather than rendering an empty feed.
    if (error instanceof AppError) {
      if (error.statusCode === 401) redirect("/auth/sign-in");
      if (error.statusCode === 403 || error.statusCode === 404) notFound();
    }

    throw error;
  }
}
