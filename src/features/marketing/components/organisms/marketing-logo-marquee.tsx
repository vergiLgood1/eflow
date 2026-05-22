"use client";

import { Marquee } from "@/shared/components/ui/marquee";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="mx-auto mt-8 w-full max-w-[1200px] px-6 opacity-90 transition-opacity duration-500 hover:opacity-100"
      id="logo-section"
    >
      <div className="flex flex-col items-center gap-12 border-t border-white/5 pt-8 lg:flex-row">
        <div className="min-w-[280px] shrink-0 text-center lg:text-left">
          <h4 className="text-lg font-medium tracking-tight text-white">
            Empowering industries worldwide
          </h4>
        </div>
        <div className="relative h-[40px] w-full flex-1 overflow-hidden">
          <Marquee duration="veryFast" className="[--gap:84px]" pauseOnHover>
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-lg font-medium tracking-tight whitespace-nowrap text-white"
              >
                {logo}
              </span>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-linear-to-r from-[rgb(12,12,14)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/4 bg-linear-to-l from-[rgb(12,12,14)] to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};
