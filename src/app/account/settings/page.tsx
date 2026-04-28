import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account preferences and notifications.
                </p>
            </div>

            <div className="space-y-8 pt-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border border-border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email updates about your workspace activity.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails about new features and updates.
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                    <div className="rounded-xl border border-destructive/20 p-4 bg-destructive/5">
                        <div className="space-y-0.5">
                            <Label className="text-base font-semibold text-destructive">Delete Account</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                Permanently delete your account and all of your workspaces. This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-4">
                            <Button variant="destructive">Delete Account</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
