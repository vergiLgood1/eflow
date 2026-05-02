import React from "react";
import { SettingsSection } from "../organisms/settings-section";

export function SettingsTemplate() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account preferences and notifications.
                </p>
            </div>
            <SettingsSection />
        </div>
    );
}
