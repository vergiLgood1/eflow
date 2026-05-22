"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { ReactNode, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { PasswordInput } from "../atoms/password-input";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  rightElement?: ReactNode;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, rightElement, id, className, type, ...props }, ref) => {
    const InputComponent = type === "password" ? PasswordInput : Input;

    return (
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className={cn(error && "text-destructive")}>
            {label}
          </Label>
          {rightElement}
        </div>
        <InputComponent
          id={id}
          ref={ref}
          type={type}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-xs font-medium duration-200">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

AuthField.displayName = "AuthField";
