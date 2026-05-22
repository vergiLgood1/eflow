"use client";

import { ReactNode } from "react";

interface AuthTemplateProps {
  title: string;
  description: string;
  form: ReactNode;
  footer?: ReactNode;
}

export function AuthTemplate({
  title,
  description,
  form,
  footer,
}: AuthTemplateProps) {
  return (
    <div className="animate-in slide-in-from-bottom-4 flex flex-col space-y-6 duration-500">
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="grid gap-6">{form}</div>
      {footer && <div className="text-center">{footer}</div>}
    </div>
  );
}
