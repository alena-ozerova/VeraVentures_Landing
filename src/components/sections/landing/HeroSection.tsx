"use client";

import React from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
        The Community for Ambitious Founders
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl">
        Connect with peers, access expert resources, and scale your venture
        faster.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <LiquidButton
          className="text-lg px-8 py-4 text-white shadow-lg shadow-purple-500/25"
          onClick={() => router.push("/auth/signup")}
        >
          Join the Community
        </LiquidButton>
        <LiquidButton
          className="text-lg px-8 py-4 text-white bg-black/30 border-white/20"
          onClick={() => router.push("/auth/login")}
        >
          Member Login
        </LiquidButton>
      </div>
      <div className="mt-10 text-gray-400 max-w-2xl">
        <p className="text-sm">
          Join over 500+ founders who are already building the future with us
        </p>
      </div>
    </section>
  );
}
