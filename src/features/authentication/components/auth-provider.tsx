'use client';

import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "../lib/auth-client";
import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      {children}
    </NeonAuthUIProvider>
  );
}
