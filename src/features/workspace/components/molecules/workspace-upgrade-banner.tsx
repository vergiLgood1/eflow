import React from "react";
import { Zap, ArrowRight, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";

export function WorkspaceUpgradeBanner() {
    return (
        <div className="bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-5 mb-8 relative group overflow-hidden">
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
                            You're currently using <span className="text-foreground font-semibold">1/3</span> diagrams in the free tier. 
                            Upgrade to <span className="text-primary font-bold">PRO</span> for private workspaces, real-time collaboration, and unlimited projects.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button size="sm" className="h-9 px-5 gap-2 shadow-lg shadow-primary/20 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
                                Upgrade to Pro
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 px-4 text-muted-foreground hover:text-foreground font-semibold">
                                View pricing
                            </Button>
                        </div>
                        
                        <div className="mt-5 max-w-xs">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                                <span className="text-muted-foreground">Free Tier Usage</span>
                                <span className="text-primary">33%</span>
                            </div>
                            <Progress value={33.33} className="h-2 bg-muted border border-border/50" />
                        </div>
                    </div>
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Dismiss"
                    className="h-8 w-8 text-muted-foreground/50 hover:text-foreground hover:bg-background/50 rounded-full transition-all"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
