"use client";

import ShinyText from "@/shared/components/ShinyText";
import { motion } from "framer-motion";
import { MarketingButton } from "../atoms/marketing-button";

export const MarketingFinalCta = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden px-6 py-24 shadow-[0_0_80px_rgba(0,0,0,0.28)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />

      <div className="relative z-10 mx-auto grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div className="text-start">
          <ShinyText
            className="text-xs font-medium tracking-[0.24em] uppercase"
            text="Start with structure"
          />
          <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-white sm:text-5xl">
            Give your next database change a clear visual model.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7 sm:text-lg">
            Use Eflow to sketch the tables, relationships, and DBML behind a
            product idea before the migration becomes the plan.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MarketingButton href="/auth/sign-up" showArrow variant="primary">
              Create your first model
            </MarketingButton>
            <MarketingButton href="#features" variant="secondary">
              Review features
            </MarketingButton>
          </div>
        </div>
        <div className="border border-white/10 bg-black/35 p-5 font-mono text-sm text-white/70 shadow-2xl backdrop-blur-md">
          <div className="mb-5 flex gap-2 border-b border-white/10 pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="space-y-3">
            <p className="text-white/35">$ eflow model create</p>
            <p>&gt; tables mapped</p>
            <p>&gt; relationships reviewed</p>
            <p>&gt; dbml generated</p>
            <p className="text-emerald-300/80">ready for migration planning</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
