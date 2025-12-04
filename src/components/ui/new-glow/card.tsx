
"use client";

import { useState } from "react";

export default function GlowingCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Glow effect - positioned outside */}
      {isHovered && (
        <div
          className="absolute -inset-2 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle 40px at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.4) 60%, transparent 100%)`,
            filter: "blur(15px)",
          }}
        />
      )}

      {/* Border glow effect */}
      {isHovered && (
        <div
          className="absolute -inset-2 rounded-2xl border-2 border-purple-500 pointer-events-none"
          style={{
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}
