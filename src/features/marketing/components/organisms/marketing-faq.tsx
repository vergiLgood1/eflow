"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Can I import my existing database?",
    answer:
      "Yes, EFlow supports importing SQL DDL and DBML files. Simply paste your code or upload a file to instantly visualize your entire schema.",
  },
  {
    question: "Does it support multiple SQL dialects?",
    answer:
      "Currently, we support PostgreSQL, MySQL, and SQLite dialects for both import and export, ensuring compatibility with your existing stack.",
  },
  {
    question: "Is there a limit to how many tables I can design?",
    answer:
      "Our high-performance canvas is optimized to handle thousands of entities without lag, making it perfect for complex enterprise-grade database architectures.",
  },
  {
    question: "How does real-time collaboration work?",
    answer:
      "Much like Figma, you can invite team members to your workspace. You'll see their cursors and changes in real-time as you design and iterate together.",
  },
  {
    question: "Can I export back to SQL or DBML?",
    answer:
      "Absolutely. You can export your visual models to production-ready SQL, DBML, or high-resolution images for your technical documentation.",
  },
  {
    question: "Is my schema data secure?",
    answer:
      "Security is our top priority. We use industry-standard encryption for all stored schemas and offer granular role-based access control for teams.",
  },
];

export default function MarketingFaq() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-[1200px] py-14 "
      id="faqs"
    >
      <div className="flex flex-col items-center justify-center gap-2 mb-16">
        <h2 className="mt-5 max-w-4xl text-balance font-medium text-4xl leading-[1.1] tracking-[-0.04em]">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-lg text-muted-foreground sm:text-xl">
          Find answers to common questions about our products and services.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-1 rounded-lg border border-border/75 bg-muted p-0.75 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div
            className={cn(
              "relative overflow-hidden border border-border/90 bg-background text-start",
              "first:rounded-t-md last:rounded-b-md md:nth-[2]:rounded-tr-md md:nth-last-[2]:rounded-bl-md md:last:rounded-bl-none md:first:rounded-tr-none"
            )}
            key={index}
          >
            <div className="isolate">
              <span className="absolute top-0 left-0 rounded-br-md border-border/50 border-e border-b bg-muted px-2 py-0.75 font-mono text-[11px]">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2 border-b border-dashed px-6 py-3 ps-11 font-medium text-base">
                {faq.question}
              </div>
              <div className="px-6 py-5 ps-11 text-start text-foreground/70 text-sm">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
