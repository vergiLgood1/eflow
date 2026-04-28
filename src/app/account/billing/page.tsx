import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your billing information and subscription plan.
                </p>
            </div>

            <div className="grid gap-6 pt-6">
                <div className="p-6 border border-border rounded-2xl bg-card">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                Free Plan
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                                    <CheckCircle2 className="h-3 w-3" /> Active
                                </span>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                You are currently on the free plan. Perfect for individuals.
                            </p>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter">
                            $0<span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </h2>
                    </div>

                    <div className="mt-6">
                        <Button className="w-full sm:w-auto" variant="outline">View Features</Button>
                    </div>
                </div>

                <div className="p-6 border border-primary/20 rounded-2xl bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard className="h-24 w-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-primary">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            Upgrade to Pro to unlock unlimited workspaces, priority support, and advanced sharing features.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <h2 className="text-3xl font-bold tracking-tighter">
                                $12<span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </h2>
                            <Button className="ml-auto">Upgrade to Pro</Button>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border mt-4">
                    <h3 className="text-lg font-semibold">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        You have not added any payment methods yet.
                    </p>
                    <Button variant="outline" className="mt-4 gap-2">
                        <CreditCard className="h-4 w-4" />
                        Add Payment Method
                    </Button>
                </div>
            </div>
        </div>
    );
}
