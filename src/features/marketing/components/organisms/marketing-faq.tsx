"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What stage is Eflow in?",
    answer:
      "Eflow is a new product focused on the core schema planning workflow first: visual modeling, SQL import/export, DBML inspection, and checkpoints.",
  },
  {
    question: "Can I import SQL or DBML?",
    answer:
      "Yes. The current workspace includes SQL import, DBML import, a DBML panel, and SQL export for turning visual models back into a draft schema.",
  },
  {
    question: "Does Eflow replace migrations?",
    answer:
      "No. Eflow helps you plan and review schema structure before migration work. Checkpoints and migration drafts are useful context, but your migration tool should remain the source of production changes.",
  },
  {
    question: "Is collaboration available today?",
    answer:
      "Workspace structure exists, but multiplayer live cursors and full real-time collaboration should be treated as planned work, not a shipped promise.",
  },
  {
    question: "Is AI schema review included?",
    answer:
      "Not as a core shipped claim on this page. AI-assisted schema review is a planned direction and should only be promoted once it is reliable inside the product.",
  },
  {
    question: "Who is Eflow for right now?",
    answer:
      "Early product teams, indie builders, and engineers who want a clearer schema planning surface before committing to database migrations.",
  },
];

export default function MarketingFaq() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mb-16 flex flex-col items-center justify-center gap-2">
          <h2 className="mt-5 max-w-4xl text-4xl leading-[1.1] font-medium tracking-[-0.04em] text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2 text-lg sm:text-xl">
            Straight answers for a new product launch.
          </p>
        </div>

      <div className="border-border/75 bg-muted mt-8 grid grid-cols-1 gap-1 rounded-lg border p-0.75 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div
            className={cn(
              "border-border/90 bg-background relative overflow-hidden border text-start",
              "first:rounded-t-md last:rounded-b-md md:first:rounded-tr-none md:last:rounded-bl-none md:nth-[2]:rounded-tr-md md:nth-last-[2]:rounded-bl-md",
            )}
            key={index}
          >
            <div className="isolate">
              <span className="border-border/50 bg-muted absolute top-0 left-0 rounded-br-md border-e border-b px-2 py-0.75 font-mono text-[11px]">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2 border-b border-dashed px-6 py-3 ps-11 text-base font-medium">
                {faq.question}
              </div>
              <div className="text-foreground/70 px-6 py-5 ps-11 text-start text-sm">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
