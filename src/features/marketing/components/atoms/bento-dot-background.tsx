"use client";

import DotGrid from "@/shared/components/DotGrid";

export const BentoDotBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
      <DotGrid
        dotSize={12}
        gap={40}
        baseColor="#5227FF"
        activeColor="#7C3AED"
        proximity={120}
        speedTrigger={80}
        shockRadius={200}
        shockStrength={4}
        maxSpeed={4000}
        resistance={600}
        returnDuration={1.2}
      />
    </div>
  );
};
