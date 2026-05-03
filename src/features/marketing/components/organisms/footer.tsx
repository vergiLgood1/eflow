import { Separator } from "@/shared/components/ui/separator";
import Link from "next/link";
import { MarketingLogo } from "../atoms/marketing-logo";

const FOOTER_LINKS = {
    Product: [
        { href: "/pricing", label: "Pricing" },
        { href: "/features", label: "Features" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ],
    Legal: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/refunds", label: "Refund Policy" },
    ],
    Connect: [
        { href: "https://twitter.com/eflow", label: "Twitter / X" },
        { href: "https://github.com/eflow", label: "GitHub" },
        { href: "https://linkedin.com/company/eflow", label: "LinkedIn" },
    ],
};

export const Footer = () => {
    return (
        <footer className="relative bg-background border-t border-border mt-24">
            <div className="mx-auto max-w-[1200px] py-14">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-12">
                    {/* Brand + copyright */}
                    <div className="shrink-0 space-y-2">
                        <MarketingLogo />
                        <div className="flex flex-col">
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} eflow
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                All rights reserved.
                            </p>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-3 gap-10">
                        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                            <div key={section} className="flex flex-col gap-1">
                                <p className="text-xs font-semibold text-foreground mb-2">
                                    {section}
                                </p>
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Watermark */}
                <p
                    aria-hidden="true"
                    className="text-center text-5xl md:text-9xl lg:text-[14rem] font-bold select-none pointer-events-none bg-clip-text text-transparent bg-gradient-to-b from-foreground/5 to-foreground/[0.015]"
                >
                    EFLOW
                </p>
            </div>
        </footer>
    );
};
