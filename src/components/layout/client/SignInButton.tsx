"use client";

import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <LiquidButton
        className="text-white bg-black/30 border-white/20"
        onClick={() => router.push("/auth/signup")}
      >
        Sign Up
      </LiquidButton>
      <LiquidButton
        className="text-white"
        onClick={() => router.push("/auth/login")}
      >
        Sign In
      </LiquidButton>
    </div>
  );
}
