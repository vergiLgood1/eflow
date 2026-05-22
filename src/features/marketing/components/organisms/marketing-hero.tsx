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
      className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-10 pt-6"
      id="hero"
    >
      <MarketingHeroHeading
        description="Transform complex database requirements into elegant visual diagrams. Import SQL, collaborate in real-time, and generate production-ready schemas in seconds."
        title="Design your database schema with speed and precision"
      />
      <div className="mt-2">
        <MarketingButton href="/auth/sign-up" showArrow variant="primary">
          Get started
        </MarketingButton>
      </div>
    </motion.div>
  );
};
