"use client";

import ShinyText from "@/shared/components/ShinyText";
import { motion } from "framer-motion";

const storyCards = [
  {
    title: "Relationships drift",
    description:
      "Foreign keys, optionality, and many-to-many joins often get decided in a rush. Eflow gives those decisions a visible place before code locks them in.",
  },
  {
    title: "DDL gets hard to review",
    description:
      "Raw SQL is precise, but it is not always the fastest way for a team to understand whether the model makes sense.",
  },
  {
    title: "Context disappears",
    description:
      "A schema is more than tables. Notes, checkpoints, and workspace context help keep the reasoning close to the structure.",
  },
];

export const MarketingStoryGrid = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-start backdrop-blur-md"
      >
        <ShinyText
          className="text-xs font-medium tracking-[0.24em] uppercase"
          text="Why it exists"
        />
        <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-white sm:text-4xl">
          Most schema mistakes start before the first migration.
        </h2>
        <p className="text-muted-foreground mt-4 leading-7">
          Eflow is built for the planning window where the product is still
          moving, the database shape is still negotiable, and everyone needs a
          shared picture of what is being designed.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {storyCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
          >
            <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-white/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="font-mono text-xs text-white/40">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-start text-lg font-medium text-white">
              {card.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-start text-sm leading-6">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
