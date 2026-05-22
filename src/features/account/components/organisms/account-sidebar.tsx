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
    <aside className="border-border bg-card/50 sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-2 border-r p-4">
      <div className="mb-6 flex items-center gap-2 px-4 pt-4">
        <Link
          href="/"
          className="hover:bg-muted text-muted-foreground hover:text-foreground -ml-2 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          title="Back to Home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-foreground text-lg font-bold tracking-tight">
            Account
          </h2>
          <p className="text-muted-foreground text-xs">
            Manage your preferences
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
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
