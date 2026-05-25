"use client";

import GridMotion from "@/shared/components/GridMotion";

export const HeroGridBackground = () => {
  // Database schema related items for the grid
  const schemaItems = [
    "users",
    "posts",
    "comments",
    "likes",
    "follows",
    "messages",
    "notifications",
    "profiles",
    "settings",
    "sessions",
    "tokens",
    "roles",
    "permissions",
    "categories",
    "tags",
    "media",
    "analytics",
    "logs",
    "webhooks",
    "integrations",
    "teams",
    "projects",
    "tasks",
    "events",
    "subscriptions",
    "payments",
    "invoices",
    "reports",
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
      <GridMotion items={schemaItems} gradientColor="rgba(18, 15, 23, 0.95)" />
    </div>
  );
};
