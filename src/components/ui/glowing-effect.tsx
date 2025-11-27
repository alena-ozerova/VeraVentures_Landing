"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  blur?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    spread = 40,
    variant = "default",
    glow = true,
    className,
    disabled = false,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback(
      (e?: MouseEvent | PointerEvent) => {
        if (!containerRef.current || disabled) return;

        const container = containerRef.current;
        const { width, height, left, top } = container.getBoundingClientRect();

        let mouseX = e?.clientX ?? 0;
        let mouseY = e?.clientY ?? 0;

        if (!e) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          mouseX = centerX;
          mouseY = centerY;
        }

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const angleX = (mouseX - centerX) / (width / 2);
        const angleY = (mouseY - centerY) / (height / 2);

        const shadowX = Math.min(Math.max(angleX * spread, -spread), spread);
        const shadowY = Math.min(Math.max(angleY * spread, -spread), spread);

        const shadowColor =
          variant === "white"
            ? "rgba(255, 255, 255, 0.6)"
            : `rgba(${Math.min(147 + shadowX * 0.5, 255)}, ${Math.min(51 + shadowY * 0.5, 255)}, 234, 0.6)`;

        container.style.boxShadow = `
          0 0 ${blur}px ${shadowX}px ${shadowY}px ${shadowColor},
          0 0 ${blur * 2}px ${shadowX * 0.8}px ${shadowY * 0.8}px ${shadowColor}
        `;
      },
      [blur, spread, variant, disabled],
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      // Initialize with a default position
      handleMove();

      return () => {
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300",
          glow
            ? variant === "white"
              ? "border-white"
              : "border-purple-500"
            : "",
          className,
        )}
        style={{
          ...(glow
            ? variant === "white"
              ? {
                  boxShadow: `0 0 ${blur * 2}px rgba(255, 255, 255, 0.3)`,
                }
              : {
                  boxShadow: `0 0 ${blur * 2}px rgba(147, 51, 234, 0.3)`,
                }
            : {}),
        }}
      />
    );
  },
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
