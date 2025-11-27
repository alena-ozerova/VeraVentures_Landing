"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function LiquidButton({
  children,
  className,
  ...props
}: LiquidButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm",
        "border border-white/20",
        "hover:from-purple-600/30 hover:to-blue-600/30",
        "text-white shadow-lg",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 h-full w-full rounded-md shadow-[0_0_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] transition-shadow" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
