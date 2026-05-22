import React from "react";

interface AccountAvatarProps {
  name: string;
}

export function AccountAvatar({ name }: AccountAvatarProps) {
  return (
    <div className="from-primary flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-linear-to-tr to-purple-500 text-4xl font-bold text-white">
      {name.charAt(0).toUpperCase() || "U"}
    </div>
  );
}
