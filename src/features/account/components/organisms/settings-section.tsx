import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { NotificationToggle } from "../molecules/notification-toggle";

export function SettingsSection() {
  return (
    <div className="space-y-8 pt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="space-y-4">
          <NotificationToggle
            title="Email Notifications"
            description="Receive email updates about your workspace activity."
            defaultChecked={true}
          />
          <NotificationToggle
            title="Marketing Emails"
            description="Receive emails about new features and updates."
            defaultChecked={false}
          />
        </div>
      </div>

      <div className="border-border space-y-4 border-t pt-6">
        <h3 className="text-destructive text-lg font-semibold">Danger Zone</h3>
        <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-4">
          <div className="space-y-0.5">
            <Label className="text-destructive text-base font-semibold">
              Delete Account
            </Label>
            <p className="text-muted-foreground mt-1 text-sm">
              Permanently delete your account and all of your workspaces. This
              action cannot be undone.
            </p>
          </div>
          <div className="mt-4">
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
