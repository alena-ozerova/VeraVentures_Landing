"use client";

import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  return (
    <section className="py-20 container mx-auto text-center">
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
          Ready to Build the Future?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join our community of ambitious founders and access the resources you
          need to succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LiquidButton
            className="text-lg px-8 py-4 text-white shadow-lg shadow-purple-500/25"
            onClick={() => router.push("/auth/signup")}
          >
            Start Your Journey
          </LiquidButton>
          <LiquidButton
            className="text-lg px-8 py-4 text-white bg-black/30 border-white/20"
            onClick={() => router.push("/auth/login")}
          >
            Member Login
          </LiquidButton>
        </div>
        <div className="mt-8 text-gray-400">
          <p className="text-sm">
            Join 500+ founders already scaling their ventures with us
          </p>
        </div>
      </div>
    </section>
  );
}
