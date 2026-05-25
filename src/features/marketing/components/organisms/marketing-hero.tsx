"use client";

import { motion } from "framer-motion";
import { MarketingButton } from "../atoms/marketing-button";
import { MarketingHeroHeading } from "../molecules/marketing-hero-heading";

export const MarketingHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-8 pt-6"
      id="hero"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-white/75">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
          New launch
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
          Early product preview
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
          Built for schema planning
        </span>
      </div>
      <MarketingHeroHeading
        description="Eflow is a visual ERD workspace for shaping tables, relationships, DBML, and SQL exports while your product is still changing fast."
        title="Design database schemas before they become production debt"
      />
      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
        <MarketingButton href="/auth/sign-up" showArrow variant="primary">
          Start modeling
        </MarketingButton>
        <MarketingButton href="#story" variant="secondary">
          See workflow
        </MarketingButton>
      </div>
    </motion.div>
  );
};
