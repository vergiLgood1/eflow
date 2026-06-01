"use client";

import ShinyText from "@/shared/components/ShinyText";
import { motion } from "framer-motion";

const roadmapColumns = [
  {
    title: "Available now",
    eyebrow: "Now",
    items: [
      "Visual ERD canvas",
      "SQL import and export",
      "DBML panel",
      "Relationship cardinality tools",
      "Schema checkpoints",
    ],
  },
  {
    title: "Being refined",
    eyebrow: "Next",
    items: [
      "Migration diff quality",
      "Activity history clarity",
      "Workspace onboarding",
      "Larger schema ergonomics",
    ],
  },
  {
    title: "Planned next",
    eyebrow: "Later",
    items: [
      "Multiplayer collaboration",
      "AI-assisted schema review",
      "Team permissions",
      "Dialect-specific exports",
    ],
  },
];

export const MarketingRoadmapGrid = () => {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl text-start"
      >
        <ShinyText
          className="text-xs font-medium tracking-[0.24em] uppercase"
          text="Open roadmap"
        />
        <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
          Clear about what ships today.
        </h2>
        <p className="text-muted-foreground mt-4 leading-7">
          This is a new launch, so the roadmap is part of the product story.
          Real capabilities are separated from active work and planned bets.
        </p>
      </motion.div>

      <div className="relative grid gap-8">
        {roadmapColumns.map((column, index) => (
          <motion.div
            key={column.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[0.35fr_1fr]"
          >
            <div>
              <p className="font-mono text-xs text-emerald-300/80">
                {column.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.04em] text-white">
                {column.title}
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {column.items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/75"
                >
                  <span className="h-px w-6 bg-white/20" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
