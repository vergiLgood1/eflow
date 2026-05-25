import { MarketingGridBackground } from "../atoms/marketing-grid-background";
import { Footer } from "../organisms/footer";
import { MarketingBentoGrid } from "../organisms/marketing-bento-grid";
import { MarketingDashboardShowcase } from "../organisms/marketing-dashboard-showcase";
import MarketingFaq from "../organisms/marketing-faq";
import { MarketingFinalCta } from "../organisms/marketing-final-cta";
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
          className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden border-y border-white/10"
          id="home"
        >
          <MarketingNavbar />

          <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center border-x border-white/10 px-6 py-32 space-y-12">
            <MarketingHero />

            <MarketingDashboardShowcase />
          </div>
        </section>

        <section className="border-b border-white/10" id="launch-notes">
          <div className="mx-auto max-w-[1200px] border-x border-white/10 px-6 py-16">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-xs font-medium tracking-[0.24em] text-white/45 uppercase">
                Launch notes
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
                Core capabilities available in this launch phase.
              </h2>
            </div>
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
