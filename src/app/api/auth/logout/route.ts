import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      // Demo mode - simulate successful logout
      return NextResponse.json({
        success: true,
        message: "Logout successful!",
      });
    }

    const supabase = await createClient();

    const signOutResult = await supabase.auth.signOut();

    // Handle response with proper type checking
    if (signOutResult && "error" in signOutResult && signOutResult.error) {
      return NextResponse.json(
        { error: signOutResult.error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Logout successful!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
