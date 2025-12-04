import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Log the request for debugging
    console.log("Login API route called");

    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check if we're in demo mode (Supabase not configured)
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.log("Demo mode: Simulating successful login");
      return NextResponse.json({
        success: true,
        message: "Login successful in demo mode",
        user: {
          id: "demo-user-id",
          email: email,
        },
        session: {
          access_token: "demo-token",
          refresh_token: "demo-refresh",
          expires_at: Date.now() + 3600,
        },
      });
    }

    const supabase = createClient();
    console.log("Supabase client created");

    // Authenticate the user with Supabase Auth
    const { data, error } = await (supabase as any).auth.signInWithPassword({
      email,
      password,
    });

    console.log("Authentication result:", {
      hasData: !!data,
      hasError: !!error,
    });

    if (error) {
      console.error("Supabase login error:", error);
      return NextResponse.json(
        { error: error.message || "Invalid login credentials" },
        { status: 401 },
      );
    }

    // Check if login was successful
    if (!data.user || !data.session) {
      console.error("No user or session in response");
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 },
      );
    }

    console.log("User logged in successfully:", data.user.id);

    // Return success response with session data
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 },
    );
  }
}
