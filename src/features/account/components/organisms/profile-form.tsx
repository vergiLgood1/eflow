import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { AccountAvatar } from "../atoms/account-avatar";

interface ProfileFormProps {
    user: {
        name: string | null;
        email: string | null;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    return (
        <div className="space-y-4 pt-6">
            <div className="flex items-center gap-6">
                <AccountAvatar name={user.name || "U"} />
                <div className="space-y-1">
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        JPG, GIF or PNG. 1MB max.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 pt-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" defaultValue={user.name || ""} placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">
                        Your email address cannot be changed.
                    </p>
                </div>
            </div>

            <div className="pt-6">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
