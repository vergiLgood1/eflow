import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

interface ModelUserAvatarProps {
  name: string;
  image?: string;
  color?: string;
}

export function ModelUserAvatar({
  name,
  image,
  color = "rgb(249, 115, 22)",
}: ModelUserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ml-1 flex items-center -space-x-2">
      <Avatar className="border-background ring-background h-8 w-8 border-2 ring-2 select-none">
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
