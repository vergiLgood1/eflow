import { Plus, PenLine, Trash2 } from "lucide-react";
import { ActivityType } from "../../types/activity";

interface ActivityIconProps {
  type: ActivityType;
}

export function ActivityIcon({ type }: ActivityIconProps) {
  const configs = {
    create: {
      icon: <Plus className="h-3.5 w-3.5" />,
      classes:
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    update: {
      icon: <PenLine className="h-3.5 w-3.5" />,
      classes:
        "bg-sky-500/10 border-sky-500/20 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]",
    },
    delete: {
      icon: <Trash2 className="h-3.5 w-3.5" />,
      classes:
        "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    },
  };

  const { icon, classes } = configs[type];

  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border transition-transform group-hover:scale-105 ${classes}`}
    >
      {icon}
    </div>
  );
}
