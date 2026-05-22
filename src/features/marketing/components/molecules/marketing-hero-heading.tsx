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
        "relative z-20 flex max-w-[850px] flex-col items-center gap-6 text-center",
        className,
      )}
      data-animation-on-scroll=""
    >
      <h1 className="text-4xl leading-[1.1] font-medium tracking-[-0.04em] text-white lg:text-[58px]">
        {title}
      </h1>
      <p className="text-muted-foreground max-w-[500px] text-lg leading-[1.6] lg:text-[18px]">
        {description}
      </p>
    </div>
  );
};
