"use client";
import React, { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Call API endpoint for password reset
      console.log("Attempting password reset for email:", email);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Password reset response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Password reset error response:", errorData);
        setError(errorData.error || `HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Password reset response data:", data);

      setError("");
      setSuccess("Password reset link sent to your email");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reset link. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400">
          Enter your email to receive a password reset link
        </p>
      </div>

      {/* Forgot Password Form */}
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

          {/* Submit Button */}
          <div className="pt-2">
            <LiquidButton
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </LiquidButton>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
