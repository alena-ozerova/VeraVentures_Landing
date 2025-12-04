"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/client-provider";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function SignOutButton() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect even if error occurs
      window.location.href = "/auth/login";
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <LiquidButton
      onClick={handleSignOut}
      className="text-sm px-4 py-2 text-white"
      disabled={isSigningOut}
    >
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </LiquidButton>
  );
}
