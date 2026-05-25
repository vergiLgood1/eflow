import { MarketingGridBackground } from "../atoms/marketing-grid-background";
import { Footer } from "../organisms/footer";
import { MarketingBentoGrid } from "../organisms/marketing-bento-grid";
import { MarketingDashboardShowcase } from "../organisms/marketing-dashboard-showcase";
import { MarketingFinalCta } from "../organisms/marketing-final-cta";
import MarketingFaq from "../organisms/marketing-faq";
import { MarketingHero } from "../organisms/marketing-hero";
import { MarketingLogoMarquee } from "../organisms/marketing-logo-marquee";
import { MarketingNavbar } from "../organisms/marketing-navbar";
import { MarketingRoadmapGrid } from "../organisms/marketing-roadmap-grid";
import { MarketingStoryGrid } from "../organisms/marketing-story-grid";

export const MarketingTemplate = () => {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <MarketingGridBackground />

      <main className="relative z-10 grow">
        <section
          className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-10 py-32"
          id="home"
        >
          <MarketingNavbar />

          <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-10 pt-6">
            <MarketingHero />
            <MarketingDashboardShowcase />
            <MarketingLogoMarquee />
          </div>
        </section>

        <MarketingStoryGrid />
        <MarketingBentoGrid />
        <MarketingRoadmapGrid />
        <MarketingFaq />
        <MarketingFinalCta />
      </main>

      <Footer />
    </div>
  );
};
