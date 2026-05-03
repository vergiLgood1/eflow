"use client";

import {
  Database as DatabaseIcon,
  FileText as FileTextIcon,
  History as HistoryIcon,
  Sparkles as SparklesIcon,
  Users as UsersIcon
} from "lucide-react";
import { MarketingBentoCard } from "../molecules/marketing-bento-card";

export const MarketingBentoGrid = () => {
  const features = [
    {
      title: "Infinite Visual Canvas",
      description: "A high-performance interactive space for designing complex database architectures with ease.",
      icon: <CanvasIcon className="size-5" />,
      className: "md:col-span-2 md:row-span-2",
      graphic: (
        <div className="relative h-48 w-full bg-muted/30 p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 w-32 rounded-lg border border-primary/20 bg-background p-2 shadow-sm">
                <div className="h-2 w-12 rounded bg-primary/20 mb-2" />
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded bg-muted" />
                  <div className="h-1.5 w-4/5 rounded bg-muted" />
                </div>
              </div>
              <div className="h-20 w-32 rounded-lg border border-primary/20 bg-background p-2 shadow-sm translate-y-8">
                <div className="h-2 w-12 rounded bg-primary/20 mb-2" />
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded bg-muted" />
                  <div className="h-1.5 w-4/5 rounded bg-muted" />
                </div>
              </div>
            </div>
            <svg className="absolute inset-0 size-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M160,100 L200,140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary/30" />
            </svg>
          </div>
        </div>
      )
    },
    {
      title: "Smart SQL Ingestion",
      description: "Instantly transform raw SQL DDL or DBML files into interactive visual models.",
      icon: <DatabaseIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Real-time Collaboration",
      description: "Design alongside your team with live cursors and instant synchronization.",
      icon: <UsersIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Auto-Docs",
      description: "Instant data dictionaries and documentation generated from your visual designs.",
      icon: <FileTextIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "AI Optimization",
      description: "Let AI suggest indexing strategies and normalization improvements.",
      icon: <SparklesIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful tools for modern data teams
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            EFlow combines visual design with technical precision, giving your team the most robust ERD workspace ever built.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 auto-rows-[minmax(200px,auto)]">
          {features.map((feature, index) => (
            <MarketingBentoCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Placeholder icons if lucide-react doesn't have them exactly as named
const CanvasIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 19L2 15l4-4" />
    <path d="M18 5l4 4-4 4" />
    <path d="M10 3L14 21" />
  </svg>
);
