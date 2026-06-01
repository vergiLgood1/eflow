"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingLogo } from "../atoms/marketing-logo";

const FOOTER_LINKS = {
  Product: [
    { href: "#story", label: "Story", id: "story" },
    { href: "#features", label: "Features", id: "features" },
    { href: "#roadmap", label: "Roadmap", id: "roadmap" },
    { href: "#faqs", label: "FAQs", id: "faqs" },
  ],
  Social: [
    { href: "#linkedin", label: "Linkedin", id: "linkedin" },
    { href: "#instagram", label: "Instagram", id: "instagram" },
    { href: "#twitter", label: "Twitter", id: "twitter" },
    { href: "#github", label: "Github", id: "github" },
  ]
};

export const Footer = () => {
  const footerSections = Object.entries(FOOTER_LINKS).reverse();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="border-border relative overflow-hidden border-b border-white/10"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] border-x border-white/10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Top Content */}
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm space-y-4">
            <MarketingLogo />

            <p className="text-muted-foreground text-sm leading-relaxed">
              Build modern workflows with intelligent automation and seamless
              collaboration for your growing business.
            </p>

            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">
                © {new Date().getFullYear()} eflow
              </p>

              <p className="text-muted-foreground text-xs">
                All rights reserved.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid w-full grid-cols-2 gap-10 sm:w-auto sm:grid-cols-2 lg:grid-cols-4">
            {footerSections.map(([section, links], index) => (
              <div
                key={section}
                className={
                  index === 0
                    ? "flex min-w-[120px] flex-col lg:col-start-3"
                    : "flex min-w-[120px] flex-col lg:col-start-4"
                }
              >
                <p className="text-foreground mb-4 text-sm font-semibold tracking-wide">
                  {section}
                </p>

                <div className="flex flex-col gap-3">
                  {links.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground w-fit text-sm transition-all duration-300 hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Large Branding */}
        <div className="relative -mx-4 mt-10 border-y border-white/10 px-4 py-6 sm:-mx-6 sm:mt-14 sm:px-6 sm:py-8 lg:-mx-8 lg:px-8">
          <p
            aria-hidden="true"
            className="from-foreground/10 to-foreground/[0.02] pointer-events-none w-full bg-gradient-to-b bg-clip-text text-center font-bold tracking-[0.18em] text-transparent select-none text-[4.5rem] leading-none sm:text-[7rem] md:text-[9.5rem] lg:text-[13rem] xl:text-[16rem]"
          >
            EFLOW
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-muted-foreground text-xs">
            Crafted with precision and modern design systems.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Privacy
            </Link>

            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
