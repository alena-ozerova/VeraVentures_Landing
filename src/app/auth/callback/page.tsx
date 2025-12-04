"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const errorDescription = urlParams.get("error_description");

        if (error) {
          console.error("Auth error:", error, errorDescription);
          // Redirect to login with error message
          router.push(`/auth/login?error=${encodeURIComponent(errorDescription || "Authentication failed")}`);
          return;
        }

        if (!code) {
          console.error("No authorization code found in callback");
          router.push("/auth/login?error=Invalid authentication callback");
          return;
        }

        // Exchange the code for a session
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

        if (sessionError) {
          console.error("Error exchanging code for session:", sessionError);
          router.push(`/auth/login?error=${encodeURIComponent(sessionError.message || "Failed to complete authentication")}`);
          return;
        }

        // Successfully authenticated, redirect to landing page
        router.push("/landing");
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        router.push("/auth/login?error=An unexpected error occurred");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
        <h1 className="text-xl font-semibold text-white">Completing authentication...</h1>
        <p className="mt-2 text-gray-400">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}
