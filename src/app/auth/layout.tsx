import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">EFlow</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right Column: Cover Image & Marketing */}
      <div className="hidden lg:relative lg:flex lg:flex-col lg:justify-between p-12 overflow-hidden bg-muted">
        <div className="absolute inset-0 z-0">
          <Image
            src="/auth-cover.png"
            alt="Database Visualization"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover brightness-[0.4] scale-105 animate-in fade-in zoom-in duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white/90">
          <div className="size-6 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-bold">✨</span>
          </div>
          <span className="text-sm font-medium">Trusted by 50,000+ engineers</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Design the future of your <br /> 
            <span className="text-primary italic">data infrastructure.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-md">
            The enterprise-grade visual editor for database schemas, 
            workflows, and real-time collaboration.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-white/40 text-xs">
          <span>&copy; 2026 EFlow Inc.</span>
          <span>&bull;</span>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <span>&bull;</span>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  );
}
