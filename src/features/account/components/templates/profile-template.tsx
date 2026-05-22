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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your public profile and personal information.
        </p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
