import React from "react";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";

interface NotificationToggleProps {
    title: string;
    description: string;
    defaultChecked?: boolean;
}

export function NotificationToggle({
    title,
    description,
    defaultChecked
}: NotificationToggleProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">{title}</Label>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Switch defaultChecked={defaultChecked} />
        </div>
    );
}
