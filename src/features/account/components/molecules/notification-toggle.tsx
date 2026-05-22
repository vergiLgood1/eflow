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
  defaultChecked,
}: NotificationToggleProps) {
  return (
    <div className="border-border flex items-center justify-between rounded-xl border p-4">
      <div className="space-y-0.5">
        <Label className="text-base">{title}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
