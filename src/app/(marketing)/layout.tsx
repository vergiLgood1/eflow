import { StripedPattern } from "@/shared/components/striped-pattern";

interface MarketingLayoutProps {
  readonly children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <main className="relative overflow-hidden">
      <StripedPattern className="text-foreground/15" />
      <div className="relative z-20">{children}</div>
    </main>
  );
}
