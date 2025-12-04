"use client";

import { useState } from "react";

interface DirectGlowProps {
  className?: string;
  disabled?: boolean;
}

export function DirectGlow({ className, disabled = false }: DirectGlowProps) {
  const [glowStyle, setGlowStyle] = useState({
    display: "none",
    background: "",
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlowStyle({
      display: "block",
      background: `radial-gradient(circle 80px at ${x}px ${y}px, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.5) 40%, transparent 70%)`,
      left: 0,
      top: 0,
      width: rect.width,
      height: rect.height
    });
  };

  const handleMouseLeave = () => {
    setGlowStyle(prev => ({ ...prev, display: "none" }));
  };

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <div
        className="absolute rounded-xl border-2"
        style={{
          display: glowStyle.display,
          position: "absolute",
          left: glowStyle.left,
          top: glowStyle.top,
          width: glowStyle.width,
          height: glowStyle.height,
          background: glowStyle.background,
          filter: "blur(15px)",
          borderRadius: "0.75rem",
          pointerEvents: "none",
          opacity: 0.9,
          borderColor: "rgba(147, 51, 234, 0.5)",
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
        }}
      />
      <div
        className="absolute inset-0 rounded-xl border-2"
        style={{
          borderColor: "rgba(147, 51, 234, 0.4)",
          boxShadow: "0 0 15px rgba(147, 51, 234, 0.2)",
        }}
      />
      <div
        className="relative z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
