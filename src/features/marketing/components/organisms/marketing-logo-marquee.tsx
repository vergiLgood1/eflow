import { Marquee } from "@/shared/components/ui/marquee";

const LOGOS = [
  "Vertex Core",
  "CloudPulse",
  "NeuralLink",
  "ApexSolutions",
  "ShieldFlow",
  "Quantas",
];

export const MarketingLogoMarquee = () => {
  return (
    <div
      className="w-full max-w-[1200px] mx-auto px-6 mt-8 opacity-90 hover:opacity-100 transition-opacity duration-500"
      id="logo-section"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12 border-t border-white/5 pt-8">
        <div className="shrink-0 text-center lg:text-left min-w-[280px]">
          <h4 className="text-white text-lg font-medium tracking-tight">
            Empowering industries worldwide
          </h4>
        </div>
        <div className="flex-1 w-full h-[40px] relative overflow-hidden">
          <Marquee duration="veryFast" className="[--gap:84px]" pauseOnHover>
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-white text-lg font-medium tracking-tight whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </Marquee>
          <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-[rgb(12,12,14)] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-[rgb(12,12,14)] to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
