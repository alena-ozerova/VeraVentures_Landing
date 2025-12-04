
 "use client";

import { useState, useRef, useEffect } from "react";

interface GlowingEffectProps {
  className?: string;
  disabled?: boolean;
}

export default function GlowingEffect({ className, disabled = false }: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute -inset-2 rounded-xl overflow-hidden pointer-events-none transition-opacity duration-300 ${
        className || ""
      }`}
      style={{
        opacity: isHovering ? 1 : 0,
      }}
    >
      {/* Follow effect - creates a glow that follows cursor */}
      <div
        className="absolute rounded-full"
        style={{
          width: "100px",
          height: "100px",
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.5) 60%, transparent 100%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Border effect - creates a glowing border */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          border: "2px solid",
          borderColor: isHovering
            ? "rgba(147, 51, 234, 0.8)"
            : "rgba(147, 51, 234, 0.2)",
          boxShadow: isHovering
            ? "0 0 25px rgba(147, 51, 234, 0.6), 0 0 50px rgba(59, 130, 246, 0.4), inset 0 0 25px rgba(147, 51, 234, 0.2)"
            : "0 0 25px rgba(147, 51, 234, 0.1), 0 0 50px rgba(59, 130, 246, 0.1), inset 0 0 25px rgba(147, 51, 234, 0.1)",
          transition: "all 0.3s ease",
        }}
      />
    </div>
  );
}
