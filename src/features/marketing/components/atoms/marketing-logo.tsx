import { cn } from "@/shared/lib/utils";
import { EflowLogoIcon } from "../../../../shared/components/eflow-logo-icon";

interface MarketingLogoProps {
  className?: string;
}

export const MarketingLogo = ({ className }: MarketingLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <EflowLogoIcon className="text-foreground" />
      <span className="text-foreground text-2xl font-medium tracking-tighter">
        Eflow
      </span>
    </div>
  );
};
