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
    "Priority 24/7 support",
  ];

  const handleUpgrade = () => {
    router.push("/account/billing");
  };

  return (
    <Card className="bg-card/40 group relative mt-12 overflow-hidden border backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 text-white shadow-xl shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110">
            <Crown className="h-8 w-8 fill-current" />
          </div>

          <div className="flex-1">
            <h3 className="text-foreground mb-2 flex items-center gap-3 text-2xl font-bold">
              Unlock the full power of ER Flow
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] tracking-widest uppercase"
              >
                Recommended
              </Badge>
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Elevate your workflow with professional tools designed for power
              users and scaling teams.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="text-foreground/80 group/feat flex items-center gap-3 text-sm font-medium"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 transition-colors group-hover/feat:bg-emerald-500 group-hover/feat:text-white">
                    <Check className="h-3 w-3 stroke-[3px]" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="border-border/50 flex flex-col items-center gap-6 border-t pt-6 sm:flex-row">
              <Button
                size="lg"
                className="shadow-primary/30 h-12 gap-3 rounded-full px-8 text-base font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                onClick={handleUpgrade}
              >
                Upgrade to Pro
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-semibold">
                  Starting at{" "}
                  <span className="text-primary text-lg">$9.97</span> / month
                </span>
                <span className="text-muted-foreground text-xs font-medium tracking-tighter uppercase">
                  Billed annually • Save 20%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
