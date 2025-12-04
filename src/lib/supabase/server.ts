import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createClient() {
  // Return a mock client if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("Demo mode: Returning mock Supabase client (server)");
    return createMockSupabaseClient();
  }

  try {
    const cookieStore = await cookies();

    // Get access token and refresh token from cookies
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    // Build cookies header manually for better compatibility
    let cookieHeader = "";
    if (accessToken) {
      cookieHeader += `sb-access-token=${accessToken}; `;
    }
    if (refreshToken) {
      cookieHeader += `sb-refresh-token=${refreshToken}; `;
    }
    cookieHeader = cookieHeader.trim();

    console.log("Server: Creating Supabase client with tokens", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: "pkce",
      },
      global: {
        headers: {
          cookie: cookieHeader,
        },
      },
    });
  } catch (error) {
    console.error("Error creating server Supabase client:", error);
    return createMockSupabaseClient();
  }
}

// Mock Supabase client for demo purposes (server-side)
function createMockSupabaseClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null } }),
      signInWithPassword: async () => ({
        error: null,
        data: {
          user: { email: "demo@example.com" },
          session: {
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            user: { email: "demo@example.com" },
          },
        },
      }),
      signUp: async () => ({
        error: null,
        data: {
          user: { email: "demo@example.com" },
          session: {
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            user: { email: "demo@example.com" },
          },
        },
      }),
      signOut: async () => {},
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      getSession: async () => ({ data: { session: null } }),
      resetPasswordForEmail: async () => ({ error: null }),
      setSession: async () => ({ error: null }),
    },
  };
}
