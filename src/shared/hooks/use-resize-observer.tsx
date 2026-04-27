"use client"

import { Maximize2 } from "lucide-react"
import * as React from "react"
import { Badge } from "../components/ui/badge"
import { Label } from "../components/ui/label"

// ============================================================================
// Hook Implementation
// ============================================================================

interface Size {
    width: number | undefined
    height: number | undefined
}

interface UseResizeObserverOptions<T extends HTMLElement = HTMLElement> {
    ref: React.RefObject<T | null>
    onResize?: (size: Size) => void
    box?: "border-box" | "content-box" | "device-pixel-content-box"
}

const initialSize: Size = {
    width: undefined,
    height: undefined,
}

function useIsMounted(): () => boolean {
    const isMounted = React.useRef(false)

    React.useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    return React.useCallback(() => isMounted.current, [])
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
    options: UseResizeObserverOptions<T>,
): Size {
    const { ref, box = "content-box" } = options
    const [{ width, height }, setSize] = React.useState<Size>(initialSize)
    const isMounted = useIsMounted()
    const previousSize = React.useRef<Size>({ ...initialSize })
    const onResize = React.useRef<((size: Size) => void) | undefined>(undefined)
    onResize.current = options.onResize

    React.useEffect(() => {
        if (!ref.current) {
            return
        }

        if (typeof window === "undefined" || !("ResizeObserver" in window)) {
            return
        }

        const observer = new ResizeObserver(([entry]) => {
            const boxProp =
                box === "border-box"
                    ? "borderBoxSize"
                    : box === "device-pixel-content-box"
                        ? "devicePixelContentBoxSize"
                        : "contentBoxSize"

            const newWidth = extractSize(entry, boxProp, "inlineSize")
            const newHeight = extractSize(entry, boxProp, "blockSize")

            const hasChanged =
                previousSize.current.width !== newWidth || previousSize.current.height !== newHeight

            if (hasChanged) {
                const newSize: Size = { width: newWidth, height: newHeight }
                previousSize.current.width = newWidth
                previousSize.current.height = newHeight

                if (onResize.current) {
                    onResize.current(newSize)
                } else if (isMounted()) {
                    setSize(newSize)
                }
            }
        })

        observer.observe(ref.current, { box })

        return () => {
            observer.disconnect()
        }
    }, [box, ref, isMounted])

    return { width, height }
}

type BoxSizesKey = keyof Pick<
    ResizeObserverEntry,
    "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize"
>

function extractSize(
    entry: ResizeObserverEntry,
    box: BoxSizesKey,
    sizeType: keyof ResizeObserverSize,
): number | undefined {
    if (!entry[box]) {
        if (box === "contentBoxSize") {
            return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"]
        }
        return undefined
    }

    return Array.isArray(entry[box])
        ? entry[box][0][sizeType]
        : // @ts-ignore Support Firefox's non-standard behavior
        (entry[box][sizeType] as number)
}

export type { Size, UseResizeObserverOptions }


// ============================================================================
// Demo Component
// ============================================================================

function UseResizeObserverDemo() {
    const boxRef = React.useRef<HTMLDivElement>(null)
    const { width, height } = useResizeObserver({ ref: boxRef })

    return (
        <div className="p-6 max-w-sm mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Resize Observer Demo</h3>
                <p className="text-sm text-muted-foreground">Tracks element dimensions</p>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Resizable Element</Label>
                <div
                    className="border-2 border-dashed rounded-lg min-h-[100px] resize overflow-auto flex items-center justify-center bg-muted/20 cursor-se-resize"
                    ref={boxRef}
                    style={{ minWidth: "150px", maxWidth: "100%" }}
                >
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Maximize2 size={16} />
                        <span className="text-sm">Drag corner to resize</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Observed Dimensions</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded p-3 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Width</div>
                        <Badge className="text-lg font-mono" variant="outline">
                            {width !== undefined ? `${Math.round(width)}px` : "—"}
                        </Badge>
                    </div>
                    <div className="border rounded p-3 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Height</div>
                        <Badge className="text-lg font-mono" variant="outline">
                            {height !== undefined ? `${Math.round(height)}px` : "—"}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Box Model</Label>
                    <Badge className="text-xs" variant="secondary">
                        content-box
                    </Badge>
                </div>
                <div className="border rounded p-2 min-h-[32px] flex items-center justify-center">
                    <code className="text-xs">
                        {width && height ? `${Math.round(width)} × ${Math.round(height)}` : "Measuring..."}
                    </code>
                </div>
            </div>

            <div className="text-center min-h-[20px] flex items-center justify-center">
                <div className="text-xs text-muted-foreground">
                    Native ResizeObserver API, efficient batched updates
                </div>
            </div>
        </div>
    )
}

export default UseResizeObserverDemo