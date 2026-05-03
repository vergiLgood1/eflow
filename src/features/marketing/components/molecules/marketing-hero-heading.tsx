import { cn } from "@/shared/lib/utils";

interface MarketingHeroHeadingProps {
  title: string;
  description: string;
  className?: string;
}

export const MarketingHeroHeading = ({
  title,
  description,
  className,
}: MarketingHeroHeadingProps) => {
  return (
    <div
      className={cn(
        "relative z-20 flex flex-col items-center text-center gap-6 max-w-[850px]",
        className
      )}
      data-animation-on-scroll=""
    >
      <h1 className="text-4xl lg:text-[58px] font-medium leading-[1.1] tracking-[-0.04em] text-white">
        {title}
      </h1>
      <p className="text-lg lg:text-[18px] text-muted-foreground max-w-[500px] leading-[1.6]">
        {description}
      </p>
    </div>
  );
};
