"use client";

import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  title?: string;
}

/**
 * Reusable Email button component for AI Summary elements
 * Similar style to I AM Q button but with email icon
 */
export function EmailButton({ href, onClick, className, size = "sm", title = "Send Email" }: EmailButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8 p-1.5",
    md: "h-10 w-10 p-2",
    lg: "h-12 w-12 p-2.5",
  };
  
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const commonClassName = cn(
    "rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-800 border-blue-600 border-2 font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center",
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={commonClassName}
        title={title}
        aria-label="Send Email"
      >
        <Mail className={cn(iconSizes[size], "text-white")} />
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={commonClassName}
      title={title}
      aria-label="Send Email"
    >
      <Mail className={cn(iconSizes[size], "text-white")} />
    </button>
  );
}
