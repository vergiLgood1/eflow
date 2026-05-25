"use client";

import Beams from "@/shared/components/Beams";

export const DashboardBeamsBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
      <Beams
        beamWidth={1.5}
        beamHeight={12}
        beamNumber={8}
        lightColor="#5227FF"
        speed={1.5}
        noiseIntensity={1.2}
        scale={0.15}
        rotation={0}
      />
    </div>
  );
};
