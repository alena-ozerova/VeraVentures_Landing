"use client";

import React, { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setError(error.message);
      } else {
        console.log("Signup successful", data);
        if (data.session) {
          router.refresh();
          router.push("/landing");
        } else {
          // Check email verification status
          setSuccess(
            "Account created! Please check your email to confirm your account.",
          );
        }
      }
    } catch (err: unknown) {
      console.error("Signup unexpected error:", err);
      setError("An unexpected error occurred");
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
          <div className="grid grid-cols-2 gap-4">
            {/* First Name Field */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Jane"
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

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
