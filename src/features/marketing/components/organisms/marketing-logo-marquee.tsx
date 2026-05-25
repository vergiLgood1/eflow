"use client";

import ShinyText from "@/shared/components/ShinyText";
import { motion } from "framer-motion";

const launchItems = [
  { label: "Available now", value: "Visual ERD canvas" },
  { label: "Available now", value: "SQL import/export" },
  { label: "Available now", value: "DBML workflow" },
  { label: "Available now", value: "Schema checkpoints" },
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
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <ShinyText
            className="text-xs font-medium tracking-[0.24em] uppercase"
            text="Launch notes"
          />
          <h4 className="mt-3 text-xl font-medium tracking-tight text-white">
            A focused first version for visual schema planning.
          </h4>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Eflow is starting with the core workflow: map your database shape,
            inspect it as DBML, and export a SQL draft when the model is clear.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {launchItems.map((item) => (
            <div
              key={item.value}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md"
            >
              <p className="font-mono text-[11px] text-emerald-300/80">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
