"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { ReactNode, forwardRef } from "react";
import { FieldError } from "react-hook-form";

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
    { label, error, description, leftElement, rightElement, id, className, containerClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className={cn("text-sm font-medium", error && "text-destructive")}>
            {label}
          </Label>
          {rightElement}
        </div>
        
        <div className="relative">
          {leftElement && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftElement}
            </div>
          )}
          <Input
            id={id}
            ref={ref}
            className={cn(
              "h-10 transition-all",
              leftElement && "pl-20",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
        </div>

        {description && !error && (
          <p className="text-xs text-muted-foreground animate-in fade-in duration-200">
            {description}
          </p>
        )}
        
        {error && (
          <p className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

WorkspaceField.displayName = "WorkspaceField";
