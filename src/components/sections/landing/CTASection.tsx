"use client";

import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  return (
    <section className="py-20 md:py-32 container mx-auto text-center px-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-500/5 to-secondary/5 border border-primary/10 rounded-3xl p-8 md:p-16 max-w-5xl mx-auto shadow-2xl shadow-purple-500/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our community of ambitious founders and access the resources you
            need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LiquidButton
              className="text-lg px-8 py-6 text-primary-foreground bg-primary hover:bg-primary/90 shadow-xl shadow-purple-500/20 rounded-full font-semibold transition-all hover:scale-105"
              onClick={() => router.push("/auth/signup")}
            >
              Start Your Journey
            </LiquidButton>
            <LiquidButton
              className="text-lg px-8 py-6 text-foreground bg-white/50 backdrop-blur-sm border border-input shadow-sm hover:bg-white rounded-full font-semibold transition-all"
              onClick={() => router.push("/auth/login")}
            >
              Member Login
            </LiquidButton>
          </div>
        </div>

      </div>
    </section>
  );
}
