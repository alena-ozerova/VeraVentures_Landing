"use client";

import React, { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Reset error message before new attempt
      setError("");

      // Call API endpoint for authentication
      console.log("Attempting login with email:", email);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
          console.error("Login error response (JSON):", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          try {
            const textResponse = await response.text();
            console.error("Login error response (text):", textResponse);
            errorData = {
              error: textResponse || `HTTP error! status: ${response.status}`,
            };
          } catch (textError) {
            console.error("Failed to get error response as text:", textError);
            errorData = { error: `HTTP error! status: ${response.status}` };
          }
        }

        setError(errorData.error || `HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Login response data:", data);

      if (data.success) {
        // Set up session regardless of demo mode or Supabase
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
        });

        if (error) {
          console.error("Session setup error:", error);
          setError(error.message || "Failed to establish session");
        } else {
          console.log("Login successful, redirecting to landing page");
          setError("");
          setSuccess(data.message || "Login successful");
          // Redirect after a short delay to allow the success message to be seen
          setTimeout(() => {
            router.push("/landing");
          }, 1000);
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Login fetch error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during sign in";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your Vera Ventures account</p>
      </div>

      {/* Login Form */}
      <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-black/60 border border-white/10 rounded-lg text-purple-500 focus:ring-purple-500 focus:ring-1"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-400"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <LiquidButton
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </LiquidButton>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
