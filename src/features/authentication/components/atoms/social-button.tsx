"use client";

import { Button } from "@/shared/components/ui/button";
import { ReactNode } from "react";

interface SocialButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function SocialButton({ onClick, disabled, icon, children }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
}
