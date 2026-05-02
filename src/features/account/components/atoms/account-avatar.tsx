import React from "react";

interface AccountAvatarProps {
    name: string;
}

export function AccountAvatar({ name }: AccountAvatarProps) {
    return (
        <div className="h-24 w-24 rounded-full bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center text-4xl text-white font-bold shrink-0">
            {name.charAt(0).toUpperCase() || "U"}
        </div>
    );
}
