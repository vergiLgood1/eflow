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
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-start lg:sticky lg:top-28 lg:self-start"
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

      <div className="relative border-l border-white/10 pl-6 sm:pl-10">
        {storyCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative pb-12 last:pb-0"
          >
            <div className="bg-background absolute top-1 -left-[31px] h-3 w-3 rounded-full border border-white/30 shadow-[0_0_0_8px_rgba(255,255,255,0.03)] sm:-left-[47px]" />
            <p className="font-mono text-xs text-white/40 transition-colors group-hover:text-white/70">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-start text-2xl font-medium tracking-[-0.04em] text-white">
              {card.title}
            </h3>
            <p className="text-muted-foreground mt-3 max-w-2xl text-start leading-7">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
