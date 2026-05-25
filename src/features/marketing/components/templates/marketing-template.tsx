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
    <main className="relative z-10 grow">
      <MarketingNavbar />
      <section className="border-b border-white/10" id="home">
        <div className="mx-auto max-w-300 border-x border-white/10 px-6 py-24">
          <MarketingHero />
        </div>
      </section>

      <section className="border-b border-white/10" id="showcase">
        <div className="mx-auto max-w-300 border-x border-white/10">
          <MarketingDashboardShowcase />
        </div>
      </section>

      <section className="border-b border-white/10" id="launch-notes">
        <div className="mx-auto max-w-300 border-x border-white/10 px-6 py-16">
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

      <section className="border-b border-white/10" id="story">
        <div className="mx-auto max-w-300 border-x border-white/10 px-6 py-24">
          <MarketingStoryGrid />
        </div>
      </section>

      <section className="border-b border-white/10" id="features">
        <div className="mx-auto max-w-300 border-x border-white/10 px-6 py-24">
          <MarketingBentoGrid />
        </div>
      </section>

      <section className="border-b border-white/10" id="roadmap">
        <div className="mx-auto max-w-300 border-x border-white/10 px-6 py-24">
          <MarketingRoadmapGrid />
        </div>
      </section>

      <section className="border-b border-white/10" id="faqs">
        <div className="mx-auto max-w-300 border-x border-white/10 px-6 py-14">
          <MarketingFaq />
        </div>
      </section>

      <section className="border-b border-white/10" id="start">
        <div className="mx-auto max-w-300 border-x border-white/10">
          <MarketingFinalCta />
        </div>
      </section>
      <Footer />
    </main>
  );
};
