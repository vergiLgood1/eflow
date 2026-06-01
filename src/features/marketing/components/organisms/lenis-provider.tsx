"use client";

import Lenis from "lenis";
import { useEffect } from "react";

interface LenisProviderProps {
  readonly children: React.ReactNode;
}

export function LenisProvider({
  children,
}: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });

    let animationFrameId: number;

    function animate(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return children;
}
