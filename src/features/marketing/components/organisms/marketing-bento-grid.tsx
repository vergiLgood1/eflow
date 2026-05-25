"use client";

import {
  Database as DatabaseIcon,
  FileTextIcon,
  History as HistoryIcon,
  LayoutDashboardIcon,
  GitBranchIcon,
} from "lucide-react";
import type { SVGProps } from "react";
import { MarketingBentoCard } from "../molecules/marketing-bento-card";

export const MarketingBentoGrid = () => {
  const features = [
    {
      title: "Visual schema canvas",
      description:
        "Arrange tables, notes, and relationships in one focused workspace before the schema hardens into migrations.",
      icon: <CanvasIcon className="size-5" />,
      className: "md:col-span-2 md:row-span-2",
      graphic: (
        <div className="bg-muted/30 relative h-48 w-full p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="border-primary/20 bg-background h-20 w-32 rounded-lg border p-2 shadow-sm">
                <div className="bg-primary/20 mb-2 h-2 w-12 rounded" />
                <div className="space-y-1">
                  <div className="bg-muted h-1.5 w-full rounded" />
                  <div className="bg-muted h-1.5 w-4/5 rounded" />
                </div>
              </div>
              <div className="border-primary/20 bg-background h-20 w-32 translate-y-8 rounded-lg border p-2 shadow-sm">
                <div className="bg-primary/20 mb-2 h-2 w-12 rounded" />
                <div className="space-y-1">
                  <div className="bg-muted h-1.5 w-full rounded" />
                  <div className="bg-muted h-1.5 w-4/5 rounded" />
                </div>
              </div>
            </div>
            <svg
              className="pointer-events-none absolute inset-0 size-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M160,100 L200,140"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-primary/30"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      title: "SQL import and export",
      description:
        "Bring existing DDL into the canvas, then export a readable SQL draft when the model is ready.",
      icon: <DatabaseIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Relationship-first modeling",
      description:
        "Use explicit cardinality tools for 1:1, 1:n, optional, and many-to-many relationship thinking.",
      icon: <GitBranchIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Schema checkpoints",
      description:
        "Save important modeling moments before a risky change, then compare and generate migration drafts.",
      icon: <HistoryIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "DBML workflow",
      description:
        "Move between visual structure and DBML when text is the faster way to inspect or refine a model.",
      icon: <FileTextIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Workspace context",
      description:
        "Keep models grouped by workspace so schema design stays close to the product area it supports.",
      icon: <LayoutDashboardIcon className="size-5" />,
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <div>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            A focused workspace for schema thinking
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Eflow helps you move from rough database ideas to readable
            relational models without pretending to be a full enterprise
            platform on day one.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3">
          {features.map((feature, index) => (
            <MarketingBentoCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
    </div>
  );
};

const CanvasIcon = (props: SVGProps<SVGSVGElement>) => (
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
