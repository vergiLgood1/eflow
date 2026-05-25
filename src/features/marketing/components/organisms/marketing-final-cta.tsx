"use client";

import { motion } from "framer-motion";
import { MarketingButton } from "../atoms/marketing-button";

export const MarketingFinalCta = () => {
  return (
    <section className="border-b border-white/10" id="start">
      <div className="mx-auto max-w-[1200px] border-x border-white/10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center shadow-[0_0_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <p className="text-xs font-medium tracking-[0.24em] text-white/45 uppercase">
              Start with structure
            </p>
            <h2 className="mt-5 text-3xl leading-tight font-medium tracking-[-0.04em] text-white sm:text-5xl">
              Give your next database change a clear visual model.
            </h2>
            <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Use Eflow to sketch the tables, relationships, and DBML behind a
              product idea before the migration becomes the plan.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <MarketingButton href="/auth/sign-up" showArrow variant="primary">
                Create your first model
              </MarketingButton>
              <MarketingButton href="#features" variant="secondary">
                Review features
              </MarketingButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
