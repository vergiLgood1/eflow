"use client";

import { cn } from "@/shared/lib/utils";
import { CreditCard, Settings, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    {
        title: "Profile",
        href: "/account/profile",
        icon: User,
    },
    {
        title: "Billing",
        href: "/account/billing",
        icon: CreditCard,
    },
    {
        title: "Settings",
        href: "/account/settings",
        icon: Settings,
    },
];

export function AccountSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex flex-col gap-2 p-4 w-64 border-r border-border bg-card/50 h-screen sticky top-0 shrink-0">
            <div className="mb-6 px-4 pt-4 flex items-center gap-2">
                <Link 
                    href="/" 
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground -ml-2"
                    title="Back to Home"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">Account</h2>
                    <p className="text-xs text-muted-foreground">Manage your preferences</p>
                </div>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
                {items.map((item) => {
                    const isActive = pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                isActive 
                                    ? "bg-primary/10 text-primary" 
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
