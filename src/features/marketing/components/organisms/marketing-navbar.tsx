import { MarketingButton } from "../atoms/marketing-button";
import { MarketingLogo } from "../atoms/marketing-logo";
import { MarketingNavLink } from "../atoms/marketing-nav-link";

export const MarketingNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex justify-center items-center px-10 border-b border-white/10 backdrop-blur-md bg-background/95">
      <div className="w-full max-w-[1200px] h-full flex items-center justify-between border-x border-white/10 px-6 relative">
        <MarketingLogo />
        <div className="hidden md:flex items-center gap-4 h-full">
          <MarketingNavLink href="#hero">Hero</MarketingNavLink>
          <MarketingNavLink href="#features">Features</MarketingNavLink>
          <MarketingNavLink href="#faqs">FAQs</MarketingNavLink>
        </div>
        <div className="flex items-center gap-4">
          <MarketingButton href="/login" size="sm" variant="secondary">
            Get started
          </MarketingButton>
        </div>
      </div>
    </nav>
  );
};
