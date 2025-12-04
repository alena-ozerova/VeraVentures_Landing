import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Log the request for debugging
    console.log("Signup API route called");

    const { email, password } = await request.json();
    console.log("Signup attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      console.log("Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    let supabase;
    try {
      supabase = createClient();
      console.log("Supabase client created");
    } catch (clientError) {
      console.error("Failed to create Supabase client:", clientError);
      return NextResponse.json(
        { error: "Failed to initialize authentication service" },
        { status: 500 },
      );
    }

    // Create a new user with Supabase Auth
    console.log("Attempting to create user with Supabase");

    // Check if we're in demo mode (Supabase not configured)
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.log("Demo mode: Simulating successful signup");
      return NextResponse.json({
        success: true,
        message: "Account created successfully in demo mode",
        user: {
          id: "demo-user-id",
          email: email,
        },
        session: {
          access_token: "demo-token",
          refresh_token: "demo-refresh",
        },
      });
    }

    // Create a new user with Supabase Auth
    console.log("Attempting to create user with Supabase");
    let data, error;

    try {
      const result = await (supabase as any).auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
        },
      });
      data = result.data;
      error = result.error;
    } catch (supabaseError) {
      console.error("Supabase API call failed:", supabaseError);
      return NextResponse.json(
        { error: "Failed to communicate with authentication service" },
        { status: 500 },
      );
    }

    console.log("Signup result:", {
      hasData: !!data,
      hasError: !!error,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
    });

    if (error) {
      console.error("Supabase signup error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create account" },
        { status: 400 },
      );
    }

    // Check if the user was created successfully
    if (!data.user) {
      console.error("No user in response");
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 },
      );
    }

    // For development or demo purposes, you might want to automatically confirm the user
    // In production, you would typically send a confirmation email
    console.log("User created successfully:", data.user.id);

    // If there's no session, it might be because email confirmation is required
    // In this case, we'll still return success but inform the client
    const session = data.session;
    const needsEmailConfirmation = !session;

    // Return success response
    return NextResponse.json({
      success: true,
      message: needsEmailConfirmation
        ? "Account created successfully. Please check your email to confirm your account."
        : "Account created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      // Include session if Supabase creates one automatically (in some configurations)
      session: session,
      needsEmailConfirmation,
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup" },
      { status: 500 },
    );
  }
}
