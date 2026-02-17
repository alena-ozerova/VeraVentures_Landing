"use client";

import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-32 px-6 overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-200/30 rounded-[100%] blur-[120px] -z-10 opacity-50 pointer-events-none" />

      <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 max-w-5xl bg-clip-text text-transparent bg-gradient-to-br from-primary via-purple-600 to-cyan-500 tracking-tight leading-tight">
        The future of Italian <br className="hidden md:block" />
        <span className="text-primary">entrepreneurship begins here.</span>
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl leading-relaxed">
        A dedicated community for students driven by startups, venture capital, and
        innovation. We provide the network and the experience to help you find
        your place in the ecosystem.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <LiquidButton
          className="text-lg px-8 py-6 text-primary-foreground bg-primary hover:bg-primary/90 shadow-xl shadow-purple-500/20 rounded-full font-semibold transition-all hover:scale-105"
          onClick={() => router.push("/auth/signup")}
        >
          Join the Community
        </LiquidButton>
        <LiquidButton
          className="text-lg px-8 py-6 text-foreground bg-white border border-input shadow-sm hover:bg-gray-50 rounded-full font-semibold transition-all"
          onClick={() => router.push("/auth/login")}
        >
          Member Login
        </LiquidButton>
      </div>

    </section>
  );
}
