import React from "react";
import { AccountSidebar } from "../organisms/account-sidebar";

export function AccountLayoutTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/10 flex min-h-screen w-full">
      <AccountSidebar />
      <main className="bg-background border-border/50 mt-4 ml-4 flex-1 overflow-y-auto rounded-tl-2xl border-t border-l shadow-sm lg:ml-0">
        <div className="mx-auto max-w-4xl p-8">{children}</div>
      </main>
    </div>
  );
}
