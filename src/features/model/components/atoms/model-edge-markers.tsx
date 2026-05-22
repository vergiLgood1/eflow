/**
 * Crow's Foot Edge Markers
 *
 * Renders detailed crow's foot notation SVG markers for React Flow edges.
 * Supports full notation: mandatory/optional, one/many at both ends.
 *
 * Notation symbols:
 * - Mandatory one (|): Short line perpendicular to edge
 * - Optional one (○): Circle
 * - Mandatory many (⊢): Crow's foot (fork)
 * - Optional many (○⊢): Circle + crow's foot
 */

import { CardinalityType } from "@/features/model/types/canvas";

/**
 * Marker configuration for each end of an edge
 */
export interface EdgeMarkers {
  sourceMarker: string | null;
  targetMarker: string | null;
  sourceMarkerType:
    | "mandatory-one"
    | "optional-one"
    | "mandatory-many"
    | "optional-many"
    | null;
  targetMarkerType:
    | "mandatory-one"
    | "optional-one"
    | "mandatory-many"
    | "optional-many"
    | null;
}

/**
 * Get marker types based on cardinality
 *
 * In crow's foot notation:
 * - Source end shows the "many-ness" from source perspective
 * - Target end shows the "many-ness" from target perspective
 *
 * Examples:
 * - 1:n means: source sees "one" (|), target sees "many" (⊢)
 * - 0..n means: source sees "optional" (○), target sees "optional many" (○⊢)
 */
export function getEdgeMarkers(cardinality: CardinalityType): EdgeMarkers {
  switch (cardinality) {
    case "1:1":
      return {
        sourceMarker: "marker-mandatory-one-source",
        targetMarker: "marker-mandatory-one-target",
        sourceMarkerType: "mandatory-one",
        targetMarkerType: "mandatory-one",
      };
    case "0..1":
      return {
        sourceMarker: "marker-optional-one-source",
        targetMarker: "marker-mandatory-one-target",
        sourceMarkerType: "optional-one",
        targetMarkerType: "mandatory-one",
      };
    case "1:n":
      return {
        sourceMarker: "marker-mandatory-one-source",
        targetMarker: "marker-mandatory-many-target",
        sourceMarkerType: "mandatory-one",
        targetMarkerType: "mandatory-many",
      };
    case "0..n":
      return {
        sourceMarker: "marker-optional-one-source",
        targetMarker: "marker-optional-many-target",
        sourceMarkerType: "optional-one",
        targetMarkerType: "optional-many",
      };
    case "n:m":
      return {
        sourceMarker: "marker-mandatory-many-source",
        targetMarker: "marker-mandatory-many-target",
        sourceMarkerType: "mandatory-many",
        targetMarkerType: "mandatory-many",
      };
    default:
      return {
        sourceMarker: null,
        targetMarker: null,
        sourceMarkerType: null,
        targetMarkerType: null,
      };
  }
}

/**
 * SVG Marker Definitions Component
 *
 * Renders all crow's foot marker definitions in SVG <defs>.
 * Import this in your canvas component and include in an SVG wrapper.
 */
export function EdgeMarkerDefinitions() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        {/* Mandatory One (|) - Source Side */}
        <marker
          id="marker-mandatory-one-source"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <line
            x1="5"
            y1="1"
            x2="5"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* Mandatory One (|) - Target Side */}
        <marker
          id="marker-mandatory-one-target"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <line
            x1="5"
            y1="1"
            x2="5"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* Optional One (○) - Source Side */}
        <marker
          id="marker-optional-one-source"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <circle
            cx="5"
            cy="5"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>

        {/* Optional One (○) - Target Side */}
        <marker
          id="marker-optional-one-target"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <circle
            cx="5"
            cy="5"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>

        {/* Mandatory Many (⊢) - Source Side (points away from source) */}
        <marker
          id="marker-mandatory-many-source"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          {/* Crow's foot: three lines spreading out */}
          <line
            x1="8"
            y1="2"
            x2="2"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="8"
            y1="5"
            x2="2"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="8"
            y1="8"
            x2="2"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>

        {/* Mandatory Many (⊢) - Target Side */}
        <marker
          id="marker-mandatory-many-target"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          {/* Crow's foot: three lines spreading out */}
          <line
            x1="2"
            y1="2"
            x2="8"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="2"
            y1="5"
            x2="8"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="2"
            y1="8"
            x2="8"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>

        {/* Optional Many (○⊢) - Source Side */}
        <marker
          id="marker-optional-many-source"
          viewBox="0 0 15 10"
          refX="7"
          refY="5"
          markerWidth="15"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          <circle
            cx="2"
            cy="5"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="2"
            x2="5"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="5"
            x2="5"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="8"
            x2="5"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>

        {/* Optional Many (○⊢) - Target Side */}
        <marker
          id="marker-optional-many-target"
          viewBox="0 0 15 10"
          refX="8"
          refY="5"
          markerWidth="15"
          markerHeight="10"
          orient="auto"
        >
          <circle
            cx="13"
            cy="5"
            r="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="3"
            y1="2"
            x2="10"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="3"
            y1="5"
            x2="10"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="3"
            y1="8"
            x2="10"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>
      </defs>
    </svg>
  );
}

/**
 * Get a human-readable description of the cardinality notation
 */
export function getCardinalityDescription(
  cardinality: CardinalityType,
): string {
  switch (cardinality) {
    case "1:1":
      return "One to One";
    case "0..1":
      return "Zero or One to One";
    case "1:n":
      return "One to Many";
    case "0..n":
      return "Zero or Many to Many";
    case "n:m":
      return "Many to Many";
    default:
      return "";
  }
}

/**
 * Get the symbol representation for display purposes
 */
export function getCardinalitySymbol(
  cardinality: CardinalityType,
  end: "source" | "target",
): string {
  const markers = getEdgeMarkers(cardinality);
  const markerType =
    end === "source" ? markers.sourceMarkerType : markers.targetMarkerType;

  switch (markerType) {
    case "mandatory-one":
      return "|";
    case "optional-one":
      return "○";
    case "mandatory-many":
      return "⊢";
    case "optional-many":
      return "○⊢";
    default:
      return "";
  }
}
