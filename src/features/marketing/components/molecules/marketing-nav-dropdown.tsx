import { MarketingButton } from "../atoms/marketing-button";

export const MarketingNavDropdown = () => {
  return (
    <div className="group h-full flex items-center">
      <div className="flex items-center gap-1 cursor-pointer px-2 py-1">
        <span className="text-[15px] text-muted-foreground group-hover:text-foreground transition-colors">
          Company
        </span>
        <svg
          className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 9l6 6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="absolute top-[71px] left-0 w-full pt-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-[60]">
        <div className="bg-[rgb(15,15,17)] border-x border-b border-white/10 rounded-b-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden w-full">
          <div className="w-full md:w-[38%] border-r border-white/5 p-6 flex flex-col gap-6 bg-white/[0.02]">
            <div className="group/card cursor-pointer">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-5 border border-white/5">
                <img
                  alt="Join the mission"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  src="https://images.unsplash.com/photo-1581092333322-31d2fd38a35e?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNb2Rlcm4lMjBmdXR1cmlzdGljJTIwQUklMjByZXNlYXJjaCUyMGxhYiUyMHdpdGglMjBkaXZlcnNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpbmd8ZW58MHwwfHx8MTc3MjA5NDE0M3ww&ixlib=rb-4.1.0&w=800&h=450&fit=crop&fm=jpg&q=80"
                />
              </div>
              <div className="space-y-2 text-left">
                <h5 className="text-lg font-medium text-white tracking-tight">
                  Join the mission
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We're building the first truly autonomous
                  operating system for global enterprise.
                </p>
              </div>
              <div className="mt-6 text-left">
                <MarketingButton href="#" showArrow variant="primary">
                  View Open Roles
                </MarketingButton>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col md:flex-row text-left">
            <div className="flex-1 p-6 flex flex-col gap-5">
              <h5 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-1">
                Organization
              </h5>
              <div className="flex flex-col gap-1">
                <DropdownItem
                  title="About Eflow"
                  description="Our mission, values, and the team"
                  icon={
                    <svg
                      className="w-5 h-5"
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
                      className="w-5 h-5"
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
                      className="w-5 h-5"
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
            <div className="flex-1 p-6 flex flex-col gap-5 border-l border-white/5">
              <h5 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-1">
                Resources
              </h5>
              <div className="flex flex-col gap-1">
                <DropdownItem
                  title="Documentation"
                  description="API guides and integration docs"
                  icon={
                    <svg
                      className="w-5 h-5"
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
                      className="w-5 h-5"
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
                      className="w-5 h-5"
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
    className="group/item flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-white/5 transition-colors"
    href={href}
  >
    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[15px] font-medium text-white group-hover/item:text-primary transition-colors">
        {title}
      </span>
      <span className="text-[13px] text-muted-foreground leading-snug">
        {description}
      </span>
    </div>
  </a>
);
