import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface WorkspaceDashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export function WorkspaceDashboardCard({
  icon,
  title,
  description,
  onClick,
  className,
}: WorkspaceDashboardCardProps) {
  return (
    <button
      className="w-full text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
      type="button"
    >
      <Card
        className={cn(
          "hover:border-primary/40 hover:bg-card/80 transition-colors",
          className,
        )}
      >
        <CardContent className="p-6">
          <div className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
            {icon}
          </div>
          <div className="text-foreground mb-1 text-base font-semibold">
            {title}
          </div>
          <div className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
