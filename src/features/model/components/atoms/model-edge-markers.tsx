"use client";

import React from "react";

/**
 * Defines standard SVG markers for ERD relationship edges.
 * Should be rendered once inside the canvas container to populate the SVG <defs>.
 */
export function ModelEdgeMarkers() {
    return (
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
                <marker
                    id="marker-one"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="12"
                    markerHeight="12"
                    orient="auto-start-reverse"
                >
                    <path d="M 2 2 L 2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 6 2 L 6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </marker>
                <marker
                    id="marker-many"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="12"
                    markerHeight="12"
                    orient="auto-start-reverse"
                >
                    <path
                        d="M 2 5 L 8 2 M 2 5 L 8 8 M 2 5 L 8 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </marker>
            </defs>
        </svg>
    );
}
