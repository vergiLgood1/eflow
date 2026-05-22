import React from "react";

export type RelationType = "1:1" | "1:n" | "0..1" | "0..n" | "n:m";

interface ModelRelationIconProps {
  type: RelationType;
  className?: string;
}

export function ModelRelationIcon({ type, className }: ModelRelationIconProps) {
  const strokeWidth = 1.5;

  switch (type) {
    case "1:1":
      return (
        <svg
          className={className}
          fill="none"
          height="16"
          viewBox="0 0 24 16"
          width="16"
        >
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="6"
            x2="18"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="2"
            x2="2"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="5"
            x2="5"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="19"
            x2="19"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="22"
            y1="3"
            y2="13"
          />
        </svg>
      );
    case "1:n":
      return (
        <svg
          className={className}
          fill="none"
          height="16"
          viewBox="0 0 24 16"
          width="16"
        >
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="6"
            x2="18"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="2"
            x2="2"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="5"
            x2="5"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="3"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="13"
          />
        </svg>
      );
    case "0..1":
      return (
        <svg
          className={className}
          fill="none"
          height="16"
          viewBox="0 0 24 16"
          width="16"
        >
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="6"
            x2="18"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="4"
            x2="4"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="20"
            x2="20"
            y1="3"
            y2="13"
          />
        </svg>
      );
    case "0..n":
      return (
        <svg
          className={className}
          fill="none"
          height="16"
          viewBox="0 0 24 16"
          width="16"
        >
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="6"
            x2="18"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="4"
            x2="4"
            y1="3"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="3"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="13"
          />
        </svg>
      );
    case "n:m":
      return (
        <svg
          className={className}
          fill="none"
          height="16"
          viewBox="0 0 24 16"
          width="16"
        >
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="6"
            x2="18"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="2"
            x2="9"
            y1="8"
            y2="3"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="2"
            x2="9"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="2"
            x2="9"
            y1="8"
            y2="13"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="3"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="8"
          />
          <line
            stroke="currentColor"
            strokeWidth={strokeWidth}
            x1="22"
            x2="15"
            y1="8"
            y2="13"
          />
        </svg>
      );
    default:
      return null;
  }
}
