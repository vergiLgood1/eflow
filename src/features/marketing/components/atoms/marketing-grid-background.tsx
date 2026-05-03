import { cn } from "@/shared/lib/utils";

export const MarketingGridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff05_2px,transparent_2px)] bg-[size:1px_6px] [mask-image:linear-gradient(to_right,black_1px,transparent_1px)] [mask-size:48px_100%]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_2px,transparent_2px)] bg-[size:6px_1px] [mask-image:linear-gradient(to_bottom,black_1px,transparent_1px)] [mask-size:100%_48px]" />
    </div>
  );
};
