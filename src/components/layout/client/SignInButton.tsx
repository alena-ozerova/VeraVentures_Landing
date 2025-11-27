"use client";

import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";

export default function SignInButton() {
  return (
    <Link href="/login">
      <LiquidButton className="text-white">Sign In</LiquidButton>
    </Link>
  );
}
