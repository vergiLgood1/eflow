import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowRight, Check, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export function WorkspaceProUpsellCard() {
    const router = useRouter();
    const features = [
        "Unlimited workspaces & diagrams",
        "Private diagrams & security",
        "Real-time collaboration",
        "SQL Migration generation",
        "AI integration (MCP)",
        "Priority 24/7 support"
    ];

    const handleUpgrade = () => {
        router.push("/account/billing");
    };

    return (
        <Card className="mt-12 overflow-hidden border bg-card/40 backdrop-blur-sm relative group">
            <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Crown className="h-8 w-8 fill-current" />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                            Unlock the full power of ER Flow
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px]">
                                Recommended
                            </Badge>
                        </h3>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Elevate your workflow with professional tools designed for power users and scaling teams.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-8">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground/80 group/feat">
                                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover/feat:bg-emerald-500 group-hover/feat:text-white transition-colors">
                                        <Check className="h-3 w-3 stroke-[3px]" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 border-t border-border/50">
                            <Button
                                size="lg"
                                className="h-12 px-8 gap-3 shadow-xl shadow-primary/30 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95"
                                onClick={handleUpgrade}
                            >
                                Upgrade to Pro
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                    Starting at <span className="text-primary text-lg">$9.97</span> / month
                                </span>
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Billed annually • Save 20%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
