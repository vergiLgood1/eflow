import { MarketingGridBackground } from "../atoms/marketing-grid-background";
import { Footer } from "../organisms/footer";
import { MarketingBentoGrid } from "../organisms/marketing-bento-grid";
import { MarketingDashboardShowcase } from "../organisms/marketing-dashboard-showcase";
import MarketingFaq from "../organisms/marketing-faq";
import { MarketingHero } from "../organisms/marketing-hero";
import { MarketingLogoMarquee } from "../organisms/marketing-logo-marquee";
import { MarketingNavbar } from "../organisms/marketing-navbar";

export const MarketingTemplate = () => {
  return (
    <div className="bg-background text-foreground overflow-x-hidden min-h-screen flex flex-col w-full relative">
      <MarketingGridBackground />

      <main className="relative z-10 flex-grow">
        <section
          className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden py-32 px-10"
          id="home"
        >
          <MarketingNavbar />

          <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center gap-10 pt-6">
            <MarketingHero />
            <MarketingDashboardShowcase />
            <MarketingLogoMarquee />
          </div>
        </section>

        <MarketingBentoGrid />
        <MarketingFaq />

      </main>

      <Footer />

    </div>
  );
};
