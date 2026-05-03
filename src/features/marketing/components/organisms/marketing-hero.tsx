import { MarketingHeroHeading } from "../molecules/marketing-hero-heading";
import { MarketingButton } from "../atoms/marketing-button";

export const MarketingHero = () => {
  return (
    <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center gap-10 pt-6">
      <MarketingHeroHeading
        description="Deploy custom AI agents for complex workflows. Focus on strategy while Nova handles the execution."
        title="Scale your operations with autonomous AI agents"
      />
      <div className="mt-2">
        <MarketingButton href="/signup" showArrow variant="primary">
          Get started today
        </MarketingButton>
      </div>
    </div>
  );
};
