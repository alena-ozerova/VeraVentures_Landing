"use client";
import React, { useState, useEffect, Suspense } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      setValidLink(true);
    } else {
      setError("Invalid or expired reset link. Please try again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      const { error } = await supabase.auth.setSession({
        access_token: accessToken!,
        refresh_token: refreshToken!,
      });

      if (error) throw error;

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess("Your password has been reset successfully.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-gray-400">
            This reset link is invalid or has expired.
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Request a new password reset link?
            </p>
            <Link href="/auth/forgot-password" className="inline-block">
              <LiquidButton className="w-full text-white">
                Request New Link
              </LiquidButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400">Enter your new password below</p>
      </div>

      {/* Reset Password Form */}
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
          {/* New Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <LiquidButton
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading ? "Resetting password..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center">Loading...</div>}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
