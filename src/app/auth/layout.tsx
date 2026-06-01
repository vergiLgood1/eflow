import { AuthBrandPanel } from "@/features/authentication/components/organisms/auth-brand-panel";
import { EflowLogoIcon } from "@/shared/components/eflow-logo-icon";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Form */}
      <div className="bg-background flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="mb-8 flex items-center gap-2">
              <EflowLogoIcon />
              <span className="text-2xl font-bold tracking-tight">EFlow</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
