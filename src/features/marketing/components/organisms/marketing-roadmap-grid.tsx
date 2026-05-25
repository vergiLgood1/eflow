"use client";

import { motion } from "framer-motion";

const roadmapColumns = [
  {
    title: "Available now",
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
    items: [
      "Migration diff quality",
      "Activity history clarity",
      "Workspace onboarding",
      "Larger schema ergonomics",
    ],
  },
  {
    title: "Planned next",
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
    <section className="px-6 py-24" id="roadmap">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 max-w-2xl"
        >
          <p className="text-xs font-medium tracking-[0.24em] text-white/45 uppercase">
            Open roadmap
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
            Clear about what ships today.
          </h2>
          <p className="text-muted-foreground mt-4 leading-7">
            This is a new launch, so the roadmap is part of the product story.
            Real capabilities are separated from active work and planned bets.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {roadmapColumns.map((column, index) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
            >
              <h3 className="text-lg font-medium text-white">{column.title}</h3>
              <div className="mt-6 grid gap-3">
                {column.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
