"use client";

import { useEffect, useRef, useState } from "react";

interface SimpleGlowProps {
  className?: string;
  disabled?: boolean;
}

export function SimpleGlow({ className, disabled = false }: SimpleGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const glowElement = containerRef.current.querySelector('.glow-effect') as HTMLElement;
    if (glowElement) {
      glowElement.style.background = `radial-gradient(
        circle 80px at ${x}px ${y}px,
        rgba(147, 51, 234, 0.8) 0%,
        rgba(59, 130, 246, 0.5) 40%,
        transparent 70%
      )`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 rounded-xl overflow-hidden ${className || ''}`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`glow-effect absolute inset-0 transition-opacity duration-300 ${
          isActive && !disabled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: 'blur(15px)',
        }}
      />
      <div
        className={`absolute inset-0 rounded-xl border-2 transition-opacity duration-300 ${
          isActive && !disabled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          borderColor: 'rgba(147, 51, 234, 0.5)',
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
        }}
      />
    </div>
  );
}
