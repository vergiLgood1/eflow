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
        <button className="text-left w-full transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={onClick} type="button">
            <Card className={cn("hover:border-primary/40 hover:bg-card/80 transition-colors", className)}>
                <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        {icon}
                    </div>
                    <div className="text-base font-semibold text-foreground mb-1">
                        {title}
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </div>
                </CardContent>
            </Card>
        </button>
    );
}
