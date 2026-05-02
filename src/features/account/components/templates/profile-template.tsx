import React from "react";
import { ProfileForm } from "../organisms/profile-form";

interface ProfileTemplateProps {
    user: {
        name: string | null;
        email: string | null;
    };
}

export function ProfileTemplate({ user }: ProfileTemplateProps) {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your public profile and personal information.
                </p>
            </div>
            <ProfileForm user={user} />
        </div>
    );
}
