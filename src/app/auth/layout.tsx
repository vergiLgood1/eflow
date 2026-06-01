import { EflowLogoIcon } from "@/shared/components/eflow-logo-icon";
import Image from "next/image";
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

      {/* Right Column: Cover Image & Marketing */}
      <div className="bg-muted hidden overflow-hidden p-12 lg:relative lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 z-0">
          <Image
            src="/auth-cover.png"
            alt="Database Visualization"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="animate-in fade-in zoom-in scale-105 object-cover brightness-[0.4] duration-1000"
            priority
          />
          <div className="from-background/80 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/90">
          <div className="flex size-6 items-center justify-center rounded bg-white/20 backdrop-blur-sm">
            <span className="text-xs font-bold">✨</span>
          </div>
          <span className="text-sm font-medium">
            Trusted by 50,000+ engineers
          </span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl leading-tight font-bold tracking-tight text-white">
            Design the future of your <br />
            <span className="text-primary italic">data infrastructure.</span>
          </h2>
          <p className="max-w-md text-lg text-white/60">
            The enterprise-grade visual editor for database schemas, workflows,
            and real-time collaboration.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-white/40">
          <span>&copy; 2026 EFlow Inc.</span>
          <span>&bull;</span>
          <Link href="#" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <span>&bull;</span>
          <Link href="#" className="transition-colors hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
