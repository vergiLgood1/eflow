import { MarketingButton } from "../atoms/marketing-button";

export const MarketingNavDropdown = () => {
  return (
    <div className="group flex h-full items-center">
      <div className="flex cursor-pointer items-center gap-1 px-2 py-1">
        <span className="text-muted-foreground group-hover:text-foreground text-[15px] transition-colors">
          Company
        </span>
        <svg
          className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="invisible absolute top-[71px] left-0 z-60 w-full pt-0 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
        <div className="flex w-full flex-col overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-[rgb(15,15,17)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] md:flex-row">
          <div className="flex w-full flex-col gap-6 border-r border-white/5 bg-white/2 p-6 md:w-[38%]">
            <div className="group/card cursor-pointer">
              <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-lg border border-white/5">
                <img
                  alt="Join the mission"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  src="https://images.unsplash.com/photo-1581092333322-31d2fd38a35e?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNb2Rlcm4lMjBmdXR1cmlzdGljJTIwQUklMjByZXNlYXJjaCUyMGxhYiUyMHdpdGglMjBkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpbmd8ZW58MHwwfHx8MTc3MjA5NDE0M3ww&ixlib=rb-4.1.0&w=800&h=450&fit=crop&fm=jpg&q=80"
                />
              </div>
              <div className="space-y-2 text-left">
                <h5 className="text-lg font-medium tracking-tight text-white">
                  Join the mission
                </h5>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We're building the first truly autonomous operating system for
                  global enterprise.
                </p>
              </div>
              <div className="mt-6 text-left">
                <MarketingButton href="#" showArrow variant="primary">
                  View Open Roles
                </MarketingButton>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col text-left md:flex-row">
            <div className="flex flex-1 flex-col gap-5 p-6">
              <h5 className="mb-1 text-sm font-semibold tracking-widest text-white/40 uppercase">
                Organization
              </h5>
              <div className="flex flex-col gap-1">
                <DropdownItem
                  title="About Eflow"
                  description="Our mission, values, and the team"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    </svg>
                  }
                />
                <DropdownItem
                  title="Ethics & Safety"
                  description="How we build responsible AI"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  }
                />
                <DropdownItem
                  title="Contact Sales"
                  description="Scale your enterprise with Eflow"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-5 border-l border-white/5 p-6">
              <h5 className="mb-1 text-sm font-semibold tracking-widest text-white/40 uppercase">
                Resources
              </h5>
              <div className="flex flex-col gap-1">
                <DropdownItem
                  title="Documentation"
                  description="API guides and integration docs"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  }
                />
                <DropdownItem
                  title="Security"
                  description="Enterprise-grade data protection"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                />
                <DropdownItem
                  title="Support Center"
                  description="Help with deployments and agents"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DropdownItem = ({
  title,
  description,
  icon,
  href = "#",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}) => (
  <a
    className="group/item -mx-3 flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-white/5"
    href={href}
  >
    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="group-hover/item:text-primary text-[15px] font-medium text-white transition-colors">
        {title}
      </span>
      <span className="text-muted-foreground text-[13px] leading-snug">
        {description}
      </span>
    </div>
  </a>
);
