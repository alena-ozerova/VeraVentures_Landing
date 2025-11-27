import React from "react";
import DynamicWaveCanvasBackground from "@/components/ui/dynamic-wave-canvas-background";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/landing/HeroSection";
import BenefitsSection from "@/components/sections/landing/BenefitsSection";
import CTASection from "@/components/sections/landing/CTASection";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dynamic Wave Canvas Background */}
      <div className="absolute inset-0 z-0">
        <DynamicWaveCanvasBackground />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Benefits Section */}
          <BenefitsSection />

          {/* CTA Section */}
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
