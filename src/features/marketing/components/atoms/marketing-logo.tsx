import { cn } from "@/shared/lib/utils";

interface MarketingLogoProps {
  className?: string;
}

export const MarketingLogo = ({ className }: MarketingLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-2xl font-medium tracking-tighter text-foreground">
        Eflow
      </span>
    </div>
  );
};
