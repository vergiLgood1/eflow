import { cn } from "@/shared/lib/utils";
import Link from "next/link";

interface MarketingNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const MarketingNavLink = ({
  href,
  children,
  className,
}: MarketingNavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:text-foreground px-2 py-1 text-[15px] transition-colors",
        className,
      )}
    >
      {children}
    </Link>
  );
};
