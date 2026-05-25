import { MarketingButton } from "../atoms/marketing-button";
import { MarketingLogo } from "../atoms/marketing-logo";
import { MarketingNavLink } from "../atoms/marketing-nav-link";

export const MarketingNavbar = () => {
  return (
    <nav className="bg-background/95 fixed top-0 right-0 left-0 z-50 flex h-[72px] items-center justify-center border-b border-white/10 px-10 backdrop-blur-md">
      <div className="relative flex h-full w-full max-w-300 items-center justify-between px-6">
        <MarketingLogo />
        <div className="hidden h-full items-center gap-4 md:flex">
          <MarketingNavLink href="#story">Story</MarketingNavLink>
          <MarketingNavLink href="#features">Features</MarketingNavLink>
          <MarketingNavLink href="#roadmap">Roadmap</MarketingNavLink>
          <MarketingNavLink href="#faqs">FAQs</MarketingNavLink>
        </div>
        <div className="flex items-center gap-4">
          <MarketingButton href="/auth/sign-in" size="sm" variant="secondary">
            Sign In
          </MarketingButton>
        </div>
      </div>
    </nav>
  );
};
