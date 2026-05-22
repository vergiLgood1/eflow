"use client";

import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { ReactNode, forwardRef } from "react";
import { FieldError } from "react-hook-form";

export interface WorkspaceTextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  description?: string;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export const WorkspaceTextareaField = forwardRef<
  HTMLTextAreaElement,
  WorkspaceTextareaFieldProps
>(
  (
    {
      label,
      error,
      description,
      rightElement,
      id,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <Field className={cn("space-y-2", containerClassName)}>
        <div className="flex items-center justify-between">
          <FieldLabel
            htmlFor={id}
            className={cn("text-sm font-medium", error && "text-destructive")}
          >
            {label}
          </FieldLabel>
          {rightElement}
        </div>

        <Textarea
          id={id}
          ref={ref}
          className={cn(
            "min-h-[120px] resize-none break-all whitespace-pre-wrap transition-colors",
            error &&
              "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
            className,
          )}
          {...props}
        />

        {description && !error && (
          <p className="text-muted-foreground animate-in fade-in text-xs duration-200">
            {description}
          </p>
        )}

        {error && (
          <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-sm font-medium duration-200">
            {error.message}
          </p>
        )}
      </Field>
    );
  },
);

WorkspaceTextareaField.displayName = "WorkspaceTextareaField";
