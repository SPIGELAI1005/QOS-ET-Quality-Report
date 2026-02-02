"use client";

import dynamic from "next/dynamic";
import * as React from "react";

function ChunkLoadFallback() {
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center gap-4 text-foreground">
      <p className="text-muted-foreground">Failed to load the app. Check your connection and try again.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  );
}

const ThemeAndToaster = dynamic(
  () =>
    import("@/components/theme-and-toaster")
      .then((m) => ({ default: m.ThemeAndToaster }))
      .catch(() => ({ default: ChunkLoadFallback })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    ),
  }
);

export interface LayoutClientShellProps {
  children: React.ReactNode;
}

export function LayoutClientShell({ children }: LayoutClientShellProps) {
  return <ThemeAndToaster>{children}</ThemeAndToaster>;
}
