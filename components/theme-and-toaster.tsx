"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export interface ThemeAndToasterProps {
  children: React.ReactNode;
}

export function ThemeAndToaster({ children }: ThemeAndToasterProps) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
