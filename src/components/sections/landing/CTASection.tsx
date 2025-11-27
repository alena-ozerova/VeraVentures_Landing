import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function CTASection() {
  return (
    <section className="py-20 container mx-auto text-center">
      <h2 className="text-4xl font-bold text-white mb-6">
        Ready to Build the Future?
      </h2>
      <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
        Join our community of ambitious founders and access the resources you
        need to succeed.
      </p>
      <LiquidButton className="text-lg px-8 py-4 text-white">
        Join the Waitlist
      </LiquidButton>
    </section>
  );
}
