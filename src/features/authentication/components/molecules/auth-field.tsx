"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  rightElement?: ReactNode;
}

export function AuthField({ label, error, rightElement, id, className, ...props }: AuthFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
        {rightElement}
      </div>
      <Input
        id={id}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
          {error.message}
        </p>
      )}
    </div>
  );
}
