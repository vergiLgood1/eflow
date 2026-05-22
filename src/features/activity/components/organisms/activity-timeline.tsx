import { ActivityItemData } from "../../types/activity";
import { ActivityItem } from "../molecules/activity-item";
import { ActivityEmptyState } from "../atoms/activity-empty-state";

interface ActivityTimelineProps {
  items: ActivityItemData[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (items.length === 0) {
    return <ActivityEmptyState />;
  }

  return (
    <div className="relative">
      <div className="from-border/50 via-border/30 absolute top-2 bottom-0 left-[18.5px] w-px bg-linear-to-b to-transparent" />
      <div className="space-y-1">
        {items.map((item) => (
          <ActivityItem key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
