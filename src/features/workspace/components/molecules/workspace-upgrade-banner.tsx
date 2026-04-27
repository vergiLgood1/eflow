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
    onDismiss
}: WorkspaceUpgradeBannerProps) {
    const router = useRouter();
    const progress = (modelCount / maxModels) * 100;

    const handleUpgrade = () => {
        router.push("/account/billing");
    };

    return (
        <div className="bg-linear-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-5 mb-8 relative group overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Animated Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 shadow-inner">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-foreground font-bold text-lg mb-1">
                            Unlock unlimited diagrams
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xl leading-relaxed">
                            You're currently using <span className="text-foreground font-semibold">{modelCount}/{maxModels}</span> diagrams in the free tier.
                            Upgrade to <span className="text-primary font-bold">PRO</span> for private workspaces, real-time collaboration, and unlimited projects.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                size="sm"
                                className="h-9 px-5 gap-2 shadow-lg shadow-primary/20 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
                                onClick={handleUpgrade}
                            >
                                Upgrade to Pro
                                <ArrowRight className="h-4 w-4" />
                            </Button>

                            <div className="w-full sm:w-48 space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                    className="h-8 w-8 text-primary rounded-full transition-all"
                    onClick={onDismiss}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
