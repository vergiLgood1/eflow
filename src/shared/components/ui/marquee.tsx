import { cn } from "@/shared/lib/utils"
import { type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type MarqueeOrientation = "horizontal" | "vertical"
type MarqueeDuration = "slow" | "normal" | "fast" | "veryFast" | (string & {})

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
    orientation?: MarqueeOrientation
    reverse?: boolean
    pauseOnHover?: boolean
    repeat?: number
    duration?: MarqueeDuration
    children: ReactNode
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MARQUEE_DURATIONS: Record<MarqueeDuration, string> = {
    slow: "80s",
    normal: "60s",
    fast: "40s",
    veryFast: "20s",
}

const MARQUEE_DEFAULTS = {
    orientation: "horizontal" as MarqueeOrientation,
    reverse: false,
    pauseOnHover: false,
    repeat: 4,
    duration: "fast" as MarqueeDuration,
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMarqueeCSSVars(duration: MarqueeDuration): CSSProperties {
    const value = MARQUEE_DURATIONS[duration as keyof typeof MARQUEE_DURATIONS] ?? duration
    return { "--duration": value } as CSSProperties
}

function getOrientationClasses(orientation: MarqueeOrientation) {
    return {
        container: orientation === "vertical" ? "flex-col" : "flex-row",
        strip: orientation === "vertical"
            ? "animate-marquee-vertical flex-col"
            : "animate-marquee flex-row",
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MarqueeStripProps {
    orientation: MarqueeOrientation
    reverse: boolean
    pauseOnHover: boolean
    children: ReactNode
}

function MarqueeStrip({ orientation, reverse, pauseOnHover, children }: MarqueeStripProps) {
    const { strip } = getOrientationClasses(orientation)

    return (
        <div
            className={cn(
                "flex shrink-0 justify-around gap-(--gap)",
                strip,
                pauseOnHover && "group-hover:[animation-play-state:paused]",
                reverse && "[animation-direction:reverse]",
            )}
        >
            {children}
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Marquee({
    orientation = MARQUEE_DEFAULTS.orientation,
    reverse = MARQUEE_DEFAULTS.reverse,
    pauseOnHover = MARQUEE_DEFAULTS.pauseOnHover,
    repeat = MARQUEE_DEFAULTS.repeat,
    duration = MARQUEE_DEFAULTS.duration,
    className,
    children,
    style,
    ...props
}: MarqueeProps) {
    const { container } = getOrientationClasses(orientation)

    return (
        <div
            {...props}
            style={{ ...style, ...buildMarqueeCSSVars(duration) }}
            className={cn(
                "group flex overflow-hidden p-2 gap-(--gap) [--gap:1rem]",
                container,
                className,
            )}
        >
            {Array.from({ length: repeat }, (_, i) => (
                <MarqueeStrip
                    key={i}
                    orientation={orientation}
                    reverse={reverse}
                    pauseOnHover={pauseOnHover}
                >
                    {children}
                </MarqueeStrip>
            ))}
        </div>
    )
}