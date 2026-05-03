"use client";

import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/shared/components/ui/card";
import { motion } from "framer-motion";

interface MarketingBentoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  graphic?: ReactNode;
  className?: string;
  delay?: number;
}

export const MarketingBentoCard = ({
  title,
  description,
  icon,
  graphic,
  className,
  delay = 0,
}: MarketingBentoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn("h-full", className)}
    >
      <Card className="h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-background/80 group">
        <CardHeader className="pb-2">
          {icon && (
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              {icon}
            </div>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex justify-center p-0">
          {graphic && (
            <div className="w-full overflow-hidden pt-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {graphic}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
