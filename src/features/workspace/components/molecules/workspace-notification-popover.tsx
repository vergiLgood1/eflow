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

export function WorkspaceNotificationPopover({ children }: WorkspaceNotificationPopoverProps) {
    const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 shadow-lg border-border/50">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-xs font-medium text-primary hover:bg-transparent"
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
                                        "flex gap-3 p-4 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors cursor-pointer",
                                        !notification.read && "bg-primary/5"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-full shrink-0 flex items-center justify-center",
                                        notification.type === "info" && "bg-blue-500/10 text-blue-500",
                                        notification.type === "success" && "bg-green-500/10 text-green-500",
                                        notification.type === "warning" && "bg-amber-500/10 text-amber-500",
                                    )}>
                                        {notification.type === "info" && <Info className="h-4 w-4" />}
                                        {notification.type === "success" && <Check className="h-4 w-4" />}
                                        {notification.type === "warning" && <Clock className="h-4 w-4" />}
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold truncate">{notification.title}</span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notification.time}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                            <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">No new notifications</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-medium">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
