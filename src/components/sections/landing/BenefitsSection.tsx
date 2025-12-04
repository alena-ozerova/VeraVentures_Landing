import React from "react";
import GlowingCard from "@/components/ui/new-glow/card";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Expert Network",
      description:
        "Connect with industry leaders, experienced founders, and potential investors who can accelerate your journey.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Exclusive Resources",
      description:
        "Access premium tools, templates, and content designed specifically for early-stage startups.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Private Events",
      description:
        "Join exclusive workshops, pitch sessions, and networking events unavailable to general public.",
    },
  ];

  return (
    <section className="py-20 container mx-auto">
      <h2 className="text-4xl font-bold text-white text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
        Why Join?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <GlowingCard key={index} className="h-full">
            <div className="text-purple-400 mb-4">{benefit.icon}</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              {benefit.title}
            </h3>
            <p className="text-gray-300">{benefit.description}</p>
          </GlowingCard>
        ))}
      </div>
    </section>
  );
}
