"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const MarketingDashboardShowcase = () => {
  return (
    <div
      className="relative z-10 w-full max-w-[1100px] mt-2 aspect-[16/10]"
      data-animation-on-scroll=""
    >
      {/* Background Glows & Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff2a_2px,transparent_2px)] bg-[size:1px_6px] [mask-image:linear-gradient(to_right,black_1px,transparent_1px)] [mask-size:48px_100%]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff2a_2px,transparent_2px)] bg-[size:6px_1px] [mask-image:linear-gradient(to_bottom,black_1px,transparent_1px)] [mask-size:100%_48px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff40_1px,transparent_0)] bg-[size:48px_48px]" />
        </div>
        
        {/* Top Glow */}
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[250px] flex items-center justify-center">
          <div className="absolute w-[600px] h-[200px] bg-primary/30 blur-[90px] rounded-full" />
          <div className="absolute w-[400px] h-[140px] bg-sky-400/20 blur-[70px] rounded-full" />
        </div>

        {/* Top Edge Light */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[60%] h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />
        
        {/* Bottom Glow */}
        <div className="absolute -bottom-[80px] left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Showcase Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full h-full bg-card rounded-[14px] p-[1px] shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        <div className="w-full h-full rounded-[13px] bg-muted overflow-hidden relative group">
          {/* Dashboard Image */}
          <Image
            src="/home/diyoanggara/.gemini/antigravity/brain/ad321057-a819-4deb-9beb-94abf458e072/eflow_dashboard_showcase_1777799868158.png"
            alt="EFlow Dashboard Interface"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            priority
          />
          
          {/* Overlay for glass effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
          
          {/* Decorative frame light */}
          <div className="absolute inset-0 rounded-[13px] border border-white/5 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
