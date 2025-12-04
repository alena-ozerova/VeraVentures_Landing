"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  prevState: { error: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Demo mode - simulate successful login
    redirect("/landing");
  }

  const supabase = await createClient();

  const signInResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInResponse.error) {
    return { error: signInResponse.error.message };
  }

  redirect("/landing");
}

export async function signUp(
  prevState: { error: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Demo mode - simulate successful signup
    redirect("/landing");
  }

  const supabase = await createClient();

  const signUpResponse = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpResponse.error) {
    return { error: signUpResponse.error.message };
  }

  redirect("/landing");
}

export async function signOut() {
  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Demo mode - simulate successful logout
    redirect("/auth/login");
  }

  const supabase = await createClient();

  const signOutResult = await supabase.auth.signOut();

  // Even if error occurs, still redirect to login
  redirect("/auth/login");
}

export async function resetPassword(
  prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;

  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Demo mode - simulate successful password reset
    return { success: "Password reset link sent to your email" };
  }

  const supabase = await createClient();

  // Use type assertion to handle missing method in mock client
  const authClient = supabase.auth as any;
  const { error } = await authClient.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent to your email" };
}
