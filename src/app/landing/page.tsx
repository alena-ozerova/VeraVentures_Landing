import React from "react";
import DynamicWaveCanvasBackground from "@/components/ui/dynamic-wave-canvas-background";

import HeroSection from "@/components/sections/landing/HeroSection";
// import BenefitsSection from "@/components/sections/landing/BenefitsSection"; // Deprecated
import PillarsSection from "@/components/sections/landing/PillarsSection";
import VisionSection from "@/components/sections/landing/VisionSection";
import CTASection from "@/components/sections/landing/CTASection";
import Footer from "@/components/layout/Footer";

// Performance tip: If animations are lagging, you can reduce the
// SCALE value in dynamic-wave-canvas-background.tsx (line 18) to a higher number
// or switch to a static background for best performance

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dynamic Wave Canvas Background */}


      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        {/* Header Removed - using global Navbar */}

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Benefits Section */}
          {/* Pillars Section */}
          <PillarsSection />

          {/* Vision Section */}
          <VisionSection />

          {/* CTA Section */}
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
