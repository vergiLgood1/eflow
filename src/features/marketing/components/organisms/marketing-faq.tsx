"use client";

import ShinyText from "@/shared/components/ShinyText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
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
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="text-start">
          <ShinyText
            className="text-xs font-medium tracking-[0.24em] uppercase"
            text="FAQs"
          />
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md leading-7">
            Straight answers for a new product launch.
          </p>
        </div>

        <Accordion
          className="border-y border-white/10"
          collapsible
          type="single"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              className="border-white/10"
              key={faq.question}
              value={faq.question}
            >
              <AccordionTrigger className="grid gap-3 rounded-none py-6 text-start hover:no-underline md:grid-cols-[4rem_1fr_auto]">
                <span className="font-mono text-xs text-white/35">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-base font-medium text-white">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 text-start text-sm leading-6 md:pl-16">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
}
