"use client";

import ShinyText from "@/shared/components/ShinyText";
import { motion } from "framer-motion";

const launchItems = [
  "Visual ERD canvas",
  "SQL import/export",
  "DBML workflow",
  "Schema checkpoints",
];

export const MarketingLogoMarquee = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="mx-auto w-full opacity-90 transition-opacity duration-500 hover:opacity-100"
      id="logo-section"
    >
      <div className="grid overflow-hidden border-y border-white/10 lg:grid-cols-[0.8fr_1.2fr_1fr]">
        <div className="border-b border-white/10 p-6 lg:border-r lg:border-b-0 lg:p-8">
          <ShinyText
            className="text-xs font-medium tracking-[0.24em] uppercase"
            text="Launch notes"
          />
          <p className="mt-6 font-mono text-6xl leading-none tracking-[-0.08em] text-white sm:text-7xl">
            v0.1
          </p>
        </div>
        <div className="border-b border-white/10 p-6 lg:border-r lg:border-b-0 lg:p-8">
          <h4 className="max-w-xl text-2xl leading-tight font-medium tracking-[-0.04em] text-white sm:text-3xl">
            A focused first version for visual schema planning.
          </h4>
          <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-6 sm:text-base">
            Map your database shape, inspect it as DBML, and export a SQL draft
            when the model is clear enough to become migration work.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {launchItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-black/20 p-6 font-mono text-xs text-white/65 lg:p-8">
          <div className="flex items-center gap-2 text-emerald-300/80">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Available now
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-white/35">eflow init workspace</p>
            <p>&gt; import schema.sql</p>
            <p>&gt; review relationships</p>
            <p>&gt; checkpoint launch_model</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
