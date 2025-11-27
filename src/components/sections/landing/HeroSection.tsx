import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-5xl">
        The Community for Ambitious Founders
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl">
        Connect with peers, access expert resources, and scale your venture
        faster.
      </p>
      <LiquidButton className="text-lg px-8 py-4 text-white">
        Join the Waitlist
      </LiquidButton>
    </section>
  );
}
