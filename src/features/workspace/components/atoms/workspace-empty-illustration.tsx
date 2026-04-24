import React from "react";
import { cn } from "@/shared/lib/utils";

interface WorkspaceEmptyIllustrationProps {
    className?: string;
}

export function WorkspaceEmptyIllustration({ className }: WorkspaceEmptyIllustrationProps) {
    return (
        <svg
            className={cn("w-full h-full", className)}
            viewBox="0 0 400 240"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="grad-bg"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="hsl(247, 84%, 67%)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="hsl(247, 84%, 67%)" stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Main Card */}
            <rect
                x="100" y="40" width="200" height="140" rx="16"
                fill="url(#grad-bg)"
                stroke="hsl(247, 84%, 67%)"
                strokeWidth="1"
                strokeOpacity="0.2"
            />

            {/* Table Representation */}
            <rect x="120" y="60" width="60" height="15" rx="4" fill="hsl(var(--card))" fillOpacity="0.8" />
            <rect x="120" y="85" width="60" height="10" rx="2" fill="hsl(var(--muted))" fillOpacity="0.4" />
            <rect x="120" y="100" width="60" height="10" rx="2" fill="hsl(var(--muted))" fillOpacity="0.4" />
            <rect x="120" y="115" width="60" height="10" rx="2" fill="hsl(var(--muted))" fillOpacity="0.4" />

            {/* Another Table */}
            <rect x="220" y="90" width="60" height="15" rx="4" fill="hsl(var(--card))" fillOpacity="0.8" />
            <rect x="220" y="115" width="60" height="10" rx="2" fill="hsl(var(--muted))" fillOpacity="0.4" />
            <rect x="220" y="130" width="60" height="10" rx="2" fill="hsl(var(--muted))" fillOpacity="0.4" />

            {/* Connection Line */}
            <path
                d="M 180 67 Q 200 67 200 100 Q 200 133 220 133"
                fill="none"
                stroke="hsl(247, 84%, 67%)"
                strokeWidth="2"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
                filter="url(#glow)"
            />

            {/* Decorative Circles */}
            <circle cx="110" cy="50" r="3" fill="hsl(247, 84%, 67%)" fillOpacity="0.6" />
            <circle cx="290" cy="170" r="3" fill="hsl(217, 91%, 60%)" fillOpacity="0.6" />
            <circle cx="320" cy="80" r="4" fill="hsl(262, 83%, 58%)" fillOpacity="0.4" />
            <circle cx="80" cy="160" r="5" fill="hsl(160, 84%, 39%)" fillOpacity="0.3" />
        </svg>
    );
}
