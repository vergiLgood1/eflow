"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Bell, Check, Clock, Info } from "lucide-react";
import React from "react";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  // {
  //     id: "1",
  //     title: "Welcome to EFlow",
  //     description: "Start building your entity flow diagram now.",
  //     time: "2 mins ago",
  //     read: false,
  //     type: "info",
  // },
  // {
  //     id: "2",
  //     title: "Database Connected",
  //     description: "Your PGLite database is ready to use.",
  //     time: "1 hour ago",
  //     read: true,
  //     type: "success",
  // },
  // {
  //     id: "3",
  //     title: "New Feature Available",
  //     description: "Check out the new AI chat improvements.",
  //     time: "5 hours ago",
  //     read: false,
  //     type: "info",
  // },
];

interface WorkspaceNotificationPopoverProps {
  children?: React.ReactNode;
}

export function WorkspaceNotificationPopover({
  children,
}: WorkspaceNotificationPopoverProps) {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative h-8 w-8"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="bg-primary absolute top-1 right-1 h-2 w-2 rounded-full" />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-border/50 w-80 p-0 shadow-lg"
      >
        <div className="border-border flex items-center justify-between border-b p-4">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary h-auto p-0 text-xs font-medium hover:bg-transparent"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "border-border/50 hover:bg-accent/50 flex cursor-pointer gap-3 border-b p-4 transition-colors last:border-0",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      notification.type === "info" &&
                        "bg-blue-500/10 text-blue-500",
                      notification.type === "success" &&
                        "bg-green-500/10 text-green-500",
                      notification.type === "warning" &&
                        "bg-amber-500/10 text-amber-500",
                    )}
                  >
                    {notification.type === "info" && (
                      <Info className="h-4 w-4" />
                    )}
                    {notification.type === "success" && (
                      <Check className="h-4 w-4" />
                    )}
                    {notification.type === "warning" && (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold">
                        {notification.title}
                      </span>
                      <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center">
              <Bell className="text-muted-foreground/30 mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No new notifications
              </p>
            </div>
          )}
        </ScrollArea>
        <div className="border-border border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-full text-xs font-medium"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
