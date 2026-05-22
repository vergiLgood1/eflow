import React from "react";
import { SettingsSection } from "../organisms/settings-section";

export function SettingsTemplate() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and notifications.
        </p>
      </div>
      <SettingsSection />
    </div>
  );
}
