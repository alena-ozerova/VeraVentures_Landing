"use client";

import React, { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Reset messages before new attempt
      setError("");
      setSuccess("");

      // Call API endpoint for signup
      console.log("Attempting signup with email:", email);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Signup response status:", response.status);
      console.log("Signup response headers:", response.headers);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
          console.error("Signup error response (JSON):", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          try {
            const textResponse = await response.text();
            console.error("Signup error response (text):", textResponse);
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
      console.log("Signup response data:", data);

      if (data.success) {
        if (data.needsEmailConfirmation) {
          // User created but email confirmation is required
          console.log("Email confirmation required");
          setError("");
          // Display success message instead of redirecting
          setSuccess(
            data.message ||
              "Account created successfully. Please check your email to confirm your account.",
          );
        } else if (data.session) {
          // User created and session is available
          const supabase = createClient();
          const { error } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          if (error) {
            console.error("Session setup error:", error);
            setError(error.message || "Failed to establish session");
          } else {
            console.log("Signup successful, redirecting to landing page");
            setError("");
            setSuccess("");
            router.push("/landing");
          }
        } else {
          // User created but no session - show success message
          console.log("User created without session");
          setError("");
          setSuccess(
            data.message ||
              "Account created successfully. Please try logging in.",
          );
        }
      } else {
        setError(data.error || "Signup failed");
        setSuccess("");
      }
    } catch (error: unknown) {
      console.error("Signup fetch error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during sign up";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400">Join the Vera Ventures community</p>
      </div>

      {/* Signup Form */}
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 bg-black/60 border border-white/10 rounded-lg text-purple-500 focus:ring-purple-500 focus:ring-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              I agree to the{" "}
              <Link
                href="#"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <LiquidButton
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </LiquidButton>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
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
