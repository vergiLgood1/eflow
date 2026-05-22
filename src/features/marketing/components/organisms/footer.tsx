"use client";

import { Separator } from "@/shared/components/ui/separator";
import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingLogo } from "../atoms/marketing-logo";

const FOOTER_LINKS = {
  Product: [
    { href: "#home", label: "Hero", id: "home" },
    { href: "#features", label: "Features", id: "features" },
    { href: "#faqs", label: "Faqs", id: "faqs" },
  ],
  Legal: [
    { href: "", label: "Privacy Policy", id: "privacy-policy" },
    { href: "", label: "Terms of Service", id: "terms-of-service" },
    { href: "", label: "Refund Policy", id: "refund-policy" },
  ],
  Connect: [
    { href: "", label: "Discord", id: "discord" },
    { href: "", label: "GitHub", id: "github" },
    { href: "", label: "LinkedIn", id: "linkedin" },
  ],
};

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-background border-border relative mt-24 border-t"
    >
      <div className="mx-auto max-w-[1200px] py-14">
        <div className="flex flex-col items-start justify-between gap-12 sm:flex-row">
          {/* Brand + copyright */}
          <div className="shrink-0 space-y-2">
            <MarketingLogo />
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs">
                © {new Date().getFullYear()} eflow
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                All rights reserved.
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-10">
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section} className="flex flex-col gap-1">
                <p className="text-foreground mb-2 text-xs font-semibold">
                  {section}
                </p>
                {links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10" />

        {/* Watermark */}
        <p
          aria-hidden="true"
          className="from-foreground/5 to-foreground/1.5 pointer-events-none bg-linear-to-b bg-clip-text text-center text-5xl font-bold text-transparent select-none md:text-9xl lg:text-[14rem]"
        >
          EFLOW
        </p>
      </div>
    </motion.footer>
  );
};
