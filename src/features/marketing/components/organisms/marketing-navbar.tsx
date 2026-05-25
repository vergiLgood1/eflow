"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { MarketingButton } from "../atoms/marketing-button";
import { MarketingLogo } from "../atoms/marketing-logo";
import { MarketingNavLink } from "../atoms/marketing-nav-link";

const NavContent = () => {
  return (
    <>
      <MarketingLogo />

      <div className="hidden h-full items-center gap-4 md:flex">
        <MarketingNavLink href="#story">Story</MarketingNavLink>
        <MarketingNavLink href="#features">Features</MarketingNavLink>
        <MarketingNavLink href="#roadmap">Roadmap</MarketingNavLink>
        <MarketingNavLink href="#faqs">FAQs</MarketingNavLink>
      </div>

      <div className="flex items-center gap-4">
        <MarketingButton
          href="/auth/sign-in"
          size="sm"
          variant="secondary"
        >
          Sign In
        </MarketingButton>
      </div>
    </>
  );
};

export const MarketingNavbar = () => {
  const floatingNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const floatingNav = floatingNavRef.current;

    if (!floatingNav) return;

    let isVisible = false;

    gsap.set(floatingNav, {
      y: -100,
      opacity: 0,
      scale: 0.96,
    });

    const handleScroll = () => {
      const shouldShow = window.scrollY > 80;

      if (shouldShow === isVisible) return;

      isVisible = shouldShow;

      gsap.to(floatingNav, {
        y: shouldShow ? 0 : -100,
        opacity: shouldShow ? 1 : 0,
        scale: shouldShow ? 1 : 0.96,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gsap.killTweensOf(floatingNav);
    };
  }, []);

  return (
    <>
      {/* TOP NAV */}
      <nav className="top-0 left-0 right-0 z-40 h-[72px] border-b border-white/10 bg-background backdrop-blur-md ">
        <div className="mx-auto flex h-full max-w-300 items-center justify-between px-6">
          <NavContent />
        </div>
      </nav>

      {/* FLOATING NAV */}
      <nav ref={floatingNavRef} className=" fixed top-4 left-1/2 z-50 h-[64px] w-[calc(100%-32px)] max-w-300 -translate-x-1/ rounded-full border border-white/10 bg-background/80 shadow-[0_20px_60px_rgba(0,0,0,0.35) backdrop-blur-xl will-change-transform">
        <div className="mx-auto flex h-full items-center justify-between px-6">
          <NavContent />
        </div>
      </nav>
    </>
  );
};