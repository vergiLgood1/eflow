"use client";

import { motion } from "framer-motion";

export const MarketingDashboardShowcase = () => {
  return (
    <section className="relative z-10 mt-6 w-full max-w-[1200px]">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        {/* Aurora Glow */}
        {/* <div className="absolute top-[-10%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[10%] h-[400px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute top-[30%] left-[5%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" /> */}

        {/* Floating Rings */}
        <div className="absolute top-10 left-10 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute right-20 bottom-10 h-72 w-72 rounded-full border border-white/5" />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      >
        {/* Noise Texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
          <div className="h-full w-full bg-[url('/noise.png')]" />
        </div>

        {/* Gradient Border */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02),transparent)] p-px">
          <div className="h-full w-full rounded-[32px] bg-transparent" />
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1 text-[11px] tracking-[0.24em] text-white/40 uppercase backdrop-blur-md">
            Neural Dashboard
          </div>
        </div>

        {/* Showcase Content */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />

          {/* Canvas */}
          {/* <MarketingNodeCanvas /> */}

          {/* Bottom Overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Edge Glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10" />
        </div>
      </motion.div>
    </section>
  );
};