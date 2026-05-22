"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { ReactNode, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui/input-group";

export interface WorkspaceFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  description?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export const WorkspaceField = forwardRef<HTMLInputElement, WorkspaceFieldProps>(
  (
    {
      label,
      error,
      description,
      leftElement,
      rightElement,
      id,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-center justify-between">
          <Label
            htmlFor={id}
            className={cn("text-sm font-medium", error && "text-destructive")}
          >
            {label}
          </Label>
          {rightElement}
        </div>

        {leftElement ? (
          <InputGroup
            className={cn(
              error &&
                "border-destructive has-[[data-slot=input-group-control]:focus-visible]:border-destructive has-[[data-slot=input-group-control]:focus-visible]:ring-destructive/20",
            )}
          >
            <InputGroupAddon className="bg-muted/50 text-muted-foreground border-r px-3 text-xs font-semibold">
              {leftElement}
            </InputGroupAddon>
            <InputGroupInput
              id={id}
              ref={ref}
              className={cn("h-10", className)}
              {...props}
            />
          </InputGroup>
        ) : (
          <Input
            id={id}
            ref={ref}
            className={cn(
              "h-10 transition-all",
              error &&
                "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
              className,
            )}
            {...props}
          />
        )}

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
      </div>
    );
  },
);

WorkspaceField.displayName = "WorkspaceField";
