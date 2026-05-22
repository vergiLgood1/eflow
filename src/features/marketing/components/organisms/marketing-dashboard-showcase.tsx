"use client";

import { motion } from "framer-motion";
import { MarketingNodeCanvas } from "../molecules/marketing-node-canvas";

export const MarketingDashboardShowcase = () => {
  return (
    <div
      className="relative z-10 mt-2 aspect-16/10 w-full max-w-[1100px]"
      data-animation-on-scroll=""
    >
      {/* Background Glows & Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-300px] left-1/2 h-[600px] w-[1200px] -translate-x-1/2 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff2a_2px,transparent_2px)] mask-[linear-gradient(to_right,black_1px,transparent_1px)] bg-size-[1px_6px] mask-size-[48px_100%]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff2a_2px,transparent_2px)] mask-[linear-gradient(to_bottom,black_1px,transparent_1px)] bg-size-[6px_1px] mask-size-[100%_48px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff40_1px,transparent_0)] bg-size-[48px_48px]" />
        </div>

        {/* Top Glow */}
        <div className="absolute top-[-120px] left-1/2 flex h-[250px] w-[700px] -translate-x-1/2 items-center justify-center">
          <div className="bg-primary/30 absolute h-[200px] w-[600px] rounded-full blur-[90px]" />
          <div className="absolute h-[140px] w-[400px] rounded-full bg-sky-400/20 blur-[70px]" />
        </div>

        {/* Top Edge Light */}
        <div className="absolute -top-px left-1/2 z-10 h-[1.5px] w-[60%] -translate-x-1/2 bg-linear-to-r from-transparent via-white/80 to-transparent" />

        {/* Bottom Glow */}
        <div className="bg-primary/10 absolute bottom-[-80px] left-1/2 h-[180px] w-[600px] -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      {/* Main Showcase Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-card relative z-10 h-full w-full overflow-hidden rounded-[14px] p-px shadow-2xl ring-1 ring-white/10"
      >
        <div className="bg-muted group relative h-full w-full overflow-hidden rounded-[13px]">
          {/* Dashboard Visual (Node Flow) */}
          <MarketingNodeCanvas />

          {/* Overlay for glass effect */}
          <div className="from-background/10 pointer-events-none absolute inset-0 bg-linear-to-t via-transparent to-transparent" />

          {/* Decorative frame light */}
          <div className="pointer-events-none absolute inset-0 rounded-[13px] border border-white/5" />
        </div>
      </motion.div>
    </div>
  );
};
