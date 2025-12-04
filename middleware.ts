import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Skip processing for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Skip authentication in demo mode
    return NextResponse.next();
  }

  try {
    // Create Supabase client and check for auth session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If user is authenticated, pass through
    if (session) {
      return NextResponse.next();
    }

    // For API routes that require auth, return 401
    if (request.nextUrl.pathname.startsWith("/api/protected")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For all other routes, pass through
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
