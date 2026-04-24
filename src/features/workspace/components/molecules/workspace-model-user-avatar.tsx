import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

interface WorkspaceModelUserAvatarProps {
    name: string;
    image?: string;
    color?: string;
}

export function WorkspaceModelUserAvatar({
    name,
    image,
    color = "rgb(249, 115, 22)",
}: WorkspaceModelUserAvatarProps) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex items-center -space-x-2 ml-1">
            <Avatar className="h-8 w-8 border-2 border-background ring-2 ring-background select-none">
                <AvatarImage src={image} />
                <AvatarFallback
                    style={{ backgroundColor: color }}
                    className="text-[11px] font-medium text-white"
                >
                    {initials}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}
