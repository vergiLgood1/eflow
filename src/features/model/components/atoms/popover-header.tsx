"use client";

export function PopoverHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-border mb-3 border-b pb-2">
      <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-0.5 text-[10px]">
          {description}
        </p>
      )}
    </div>
  );
}
