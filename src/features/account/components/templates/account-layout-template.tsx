import React from "react";
import { AccountSidebar } from "../organisms/account-sidebar";

export function AccountLayoutTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-muted/10">
            <AccountSidebar />
            <main className="flex-1 overflow-y-auto bg-background rounded-tl-2xl border-t border-l border-border/50 shadow-sm mt-4 ml-4 lg:ml-0">
                <div className="max-w-4xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
