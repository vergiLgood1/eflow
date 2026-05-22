import { cn } from "@/shared/lib/utils";
import Link from "next/link";

interface MarketingButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  showArrow?: boolean;
  size?: "sm" | "md" | "lg";
}

export const MarketingButton = ({
  href,
  children,
  variant = "primary",
  className,
  showArrow = false,
  size = "md",
}: MarketingButtonProps) => {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-lg no-underline transition-all duration-200",
        isPrimary
          ? "bg-white text-black hover:bg-neutral-100"
          : "border border-white/10 bg-white/5 text-white backdrop-blur-md hover:border-white/25 hover:bg-white/15",
        size === "sm" ? "h-[40px] px-6" : "h-[48px] px-8",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none flex flex-col items-center overflow-hidden",
          size === "sm" ? "h-[20px]" : "h-[24px]",
        )}
      >
        <div
          className={cn(
            "flex flex-col transition-transform duration-300 ease-in-out",
            size === "sm"
              ? "group-hover:translate-y-[-24px]"
              : "group-hover:translate-y-[-28px]",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              size === "sm" ? "h-[20px]" : "h-[24px]",
            )}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {children}
            </span>
            {showArrow && (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div
            className={cn(
              "mt-[4px] flex items-center gap-2",
              size === "sm" ? "h-[20px]" : "h-[24px]",
            )}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {children}
            </span>
            {showArrow && (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
