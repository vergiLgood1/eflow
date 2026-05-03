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
        "group relative flex items-center justify-center overflow-hidden no-underline transition-all duration-200 rounded-lg",
        isPrimary
          ? "bg-white text-black hover:bg-neutral-100"
          : "bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/25",
        size === "sm" ? "h-[40px] px-6" : "h-[48px] px-8",
        className
      )}
    >
      <div className={cn(
        "flex flex-col items-center overflow-hidden pointer-events-none",
        size === "sm" ? "h-[20px]" : "h-[24px]"
      )}>
        <div className={cn(
          "flex flex-col transition-transform duration-300 ease-in-out",
          size === "sm" ? "group-hover:-translate-y-[24px]" : "group-hover:-translate-y-[28px]"
        )}>
          <div className={cn("flex items-center gap-2", size === "sm" ? "h-[20px]" : "h-[24px]")}>
            <span className="font-medium whitespace-nowrap text-sm">
              {children}
            </span>
            {showArrow && (
              <svg
                className="w-4 h-4"
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
          <div className={cn("flex items-center gap-2 mt-[4px]", size === "sm" ? "h-[20px]" : "h-[24px]")}>
            <span className="font-medium whitespace-nowrap text-sm">
              {children}
            </span>
            {showArrow && (
              <svg
                className="w-4 h-4"
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
