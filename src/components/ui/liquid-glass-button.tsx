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
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
        "bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md",
        "border border-white/20",
        "hover:from-purple-600/40 hover:to-blue-600/40 hover:border-purple-400/40 hover:scale-105",
        "text-white shadow-lg hover:shadow-purple-500/25",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 h-full w-full rounded-md shadow-[0_0_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] transition-shadow" />
      <div className="absolute inset-0 h-full w-full rounded-md bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
