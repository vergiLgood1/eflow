import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { ArrowRight, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkspaceUpgradeBannerProps {
  modelCount: number;
  maxModels: number;
  onDismiss?: () => void;
}

export function WorkspaceUpgradeBanner({
  modelCount,
  maxModels,
  onDismiss,
}: WorkspaceUpgradeBannerProps) {
  const router = useRouter();
  const progress = (modelCount / maxModels) * 100;

  const handleUpgrade = () => {
    router.push("/account/billing");
  };

  return (
    <div className="group animate-in fade-in slide-in-from-top-4 relative mb-8 overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 p-5 duration-500">
      {/* Animated Background Decorative Elements */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[80px]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500 shadow-inner">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground mb-1 text-lg font-bold">
              Unlock unlimited diagrams
            </h3>
            <p className="text-muted-foreground mb-4 max-w-xl text-sm leading-relaxed">
              You're currently using{" "}
              <span className="text-foreground font-semibold">
                {modelCount}/{maxModels}
              </span>{" "}
              diagrams in the free tier. Upgrade to{" "}
              <span className="text-primary font-bold">PRO</span> for private
              workspaces, real-time collaboration, and unlimited projects.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Button
                size="sm"
                className="shadow-primary/20 h-9 gap-2 rounded-full px-5 font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                onClick={handleUpgrade}
              >
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="w-full space-y-1.5 sm:w-48">
                <div className="text-muted-foreground flex justify-between text-[10px] font-bold tracking-wider uppercase">
                  <span>Usage</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-blue-500/10" />
              </div>
            </div>
          </div>
        </div>
        <Button
          size="icon"
          aria-label="Dismiss"
          variant="outline"
          className="text-primary h-8 w-8 rounded-full transition-all"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
