"use client";

export function PopoverHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-3 border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
    );
}
