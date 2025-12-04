import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Forgot Password API: Processing request");
    const { email } = await request.json();
    console.log("Forgot Password API: Received email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.log("Forgot Password API: Demo mode activated");
      // Demo mode - simulate successful password reset
      return NextResponse.json({
        success: true,
        message: "Password reset link sent to your email",
      });
    }

    console.log("Forgot Password API: Using Supabase authentication");
    const supabase = await createClient();

    const resetResponse = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
    });

    // Handle response with proper type checking
    if (resetResponse.error) {
      console.error(
        "Forgot Password API: Supabase error:",
        resetResponse.error,
      );
      return NextResponse.json(
        { error: resetResponse.error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
