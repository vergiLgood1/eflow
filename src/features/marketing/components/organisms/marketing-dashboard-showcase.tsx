import { MarketingDashboardSidebar } from "../molecules/marketing-dashboard-sidebar";
import { MarketingDashboardLog } from "../molecules/marketing-dashboard-log";

export const MarketingDashboardShowcase = () => {
  return (
    <div
      className="relative z-10 w-full max-w-[1100px] h-[642px] mt-2"
      data-animation-on-scroll=""
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff2a_2px,transparent_2px)] bg-[size:1px_6px] [mask-image:linear-gradient(to_right,black_1px,transparent_1px)] [mask-size:48px_100%]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff2a_2px,transparent_2px)] bg-[size:6px_1px] [mask-image:linear-gradient(to_bottom,black_1px,transparent_1px)] [mask-size:100%_48px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff40_1px,transparent_0)] bg-[size:48px_48px]" />
        </div>
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[250px] flex items-center justify-center">
          <div className="absolute w-[600px] h-[200px] bg-primary/30 blur-[90px] rounded-full" />
          <div className="absolute w-[400px] h-[140px] bg-[#d0f5ff]/20 blur-[70px] rounded-full" />
          <div className="absolute w-[200px] h-[40px] bg-white/40 blur-[35px] rounded-full" />
        </div>
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[60%] h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />
        <div className="absolute -bottom-[80px] left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[40px] left-1/2 -translate-x-1/2 w-[300px] h-[60px] bg-white/5 blur-[60px] rounded-full pointer-events-none" />
      </div>
      <div className="relative z-10 w-full h-full bg-card rounded-[14px] p-[1px] shadow-dashboard overflow-hidden">
        <div className="w-full h-full rounded-[11px] bg-[rgb(12,12,14)] relative overflow-hidden flex text-left font-sans">
          <MarketingDashboardSidebar />
          <div className="flex-grow flex flex-col min-w-0">
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-card/20">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Project</span>
                <span className="text-white text-sm font-medium">
                  / Enterprise_Alpha
                </span>
              </div>
            </div>
            <div className="p-6 overflow-hidden flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-5 border border-white/5 space-y-3">
                  <h3 className="text-white text-xs uppercase tracking-[2px] font-semibold opacity-60">
                    System Objectives
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Autonomous agent{" "}
                    <span className="text-primary">Nova_09</span>{" "}
                    is currently parsing multi-channel data streams to
                    optimize supply chain logistics. Reasoning engine is
                    active.
                  </p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-start gap-2 text-xs text-white/70">
                      <span className="text-primary mt-0.5">→</span>
                      <span>
                        Extracting sentiment from Q4 performance reports
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-white/70">
                      <span className="text-primary mt-0.5">→</span>
                      <span>
                        Cross-referencing historical shipping latency
                        data
                      </span>
                    </li>
                  </ul>
                </div>
                <MarketingDashboardLog />
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Strategic Execution Framework
                  </h3>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50 uppercase tracking-widest">
                    Active Draft
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-white/80">
                        Ingestion Phase
                      </h4>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        The agent monitors real-time feedback loops from
                        14 disparate data sources, prioritizing
                        high-velocity changes in market conditions.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-white/80">
                        Refinement Logic
                      </h4>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Nova applies recursive learning to minimize
                        error rates, currently maintaining a{" "}
                        <span className="text-white">
                          0.08% margin of deviation
                        </span>{" "}
                        in projected outcomes.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-white/80">
                        Autonomous Action
                      </h4>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Executing verified sub-tasks without human
                        intervention. Reporting triggers only on
                        critical priority-1 architectural shifts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/5 divide-y divide-white/5">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Audit History
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Viewing last 24 hours
                  </span>
                </div>
                <div className="p-3 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-white">
                      Financial_Agent_01 updated risk parameters for
                      enterprise cluster Alpha
                    </span>
                  </div>
                  <span className="text-muted-foreground">2m ago</span>
                </div>
                <div className="p-3 px-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-white">
                      System integrity check completed for all secondary
                      nodes
                    </span>
                  </div>
                  <span className="text-muted-foreground">5m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
