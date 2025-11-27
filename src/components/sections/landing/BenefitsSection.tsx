import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Expert Network",
      description:
        "Connect with industry leaders, experienced founders, and potential investors who can accelerate your journey.",
    },
    {
      title: "Exclusive Resources",
      description:
        "Access premium tools, templates, and content designed specifically for early-stage startups.",
    },
    {
      title: "Private Events",
      description:
        "Join exclusive workshops, pitch sessions, and networking events unavailable to the general public.",
    },
  ];

  return (
    <section className="py-20 container mx-auto">
      <h2 className="text-4xl font-bold text-white text-center mb-12">
        Why Join?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="relative h-full">
            <GlowingEffect
              blur={15}
              spread={20}
              variant="default"
              glow={true}
              disabled={false}
            />
            <div className="relative p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 z-10 overflow-hidden h-full">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-300">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
