import { createBrowserClient } from "@supabase/ssr";

let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return a mock client if Supabase is not configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.log("Demo mode: Returning mock Supabase client");
    return createMockClient();
  }

  // Return existing instance if available to prevent multiple instances
  if (clientInstance) return clientInstance;

  try {
    clientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (typeof document === "undefined") return undefined;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
            return undefined;
          },
          set(name: string, value: string, options: any) {
            if (typeof document === "undefined") return;
            let cookieString = `${name}=${value}`;
            if (options.maxAge) {
              cookieString += `; max-age=${options.maxAge}`;
            }
            if (options.path) {
              cookieString += `; path=${options.path}`;
            }
            if (options.domain) {
              cookieString += `; domain=${options.domain}`;
            }
            if (options.sameSite) {
              cookieString += `; samesite=${options.sameSite}`;
            }
            if (options.secure) {
              cookieString += `; secure`;
            }
            if (options.httpOnly) {
              // Note: Cannot set httpOnly from client-side JavaScript
              // This needs to be handled server-side
            }
            document.cookie = cookieString;
          },
          remove(name: string, options: any) {
            document.cookie = `${name}=; max-age=0; path=${options.path || "/"}`;
          },
        },
      },
    );
    return clientInstance;
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return createMockClient();
  }
}

// Mock Supabase client for demo purposes
function createMockClient() {
  return {
    auth: {
      signInWithPassword: async () => {
        // Store demo tokens in cookies for persistence
        if (typeof document !== "undefined") {
          document.cookie =
            "sb-access-token=demo-token; path=/; max-age=604800";
          document.cookie =
            "sb-refresh-token=demo-refresh; path=/; max-age=2592000";
        }
        return {
          error: null,
          data: {
            user: { email: "demo@example.com" },
            session: {
              access_token: "demo-token",
              refresh_token: "demo-refresh",
              user: { email: "demo@example.com" },
            },
          },
        };
      },
      signUp: async () => {
        // Store demo tokens in cookies for persistence
        if (typeof document !== "undefined") {
          document.cookie =
            "sb-access-token=demo-token; path=/; max-age=604800";
          document.cookie =
            "sb-refresh-token=demo-refresh; path=/; max-age=2592000";
        }
        return {
          error: null,
          data: {
            user: { email: "demo@example.com" },
            session: {
              access_token: "demo-token",
              refresh_token: "demo-refresh",
              user: { email: "demo@example.com" },
            },
          },
        };
      },
      signOut: async () => {},
      getUser: async () => ({ data: { user: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      getSession: async () => {
        // Get tokens from cookies
        if (typeof document === "undefined") return { data: { session: null } };

        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return undefined;
        };

        const accessToken = getCookie("sb-access-token");
        const refreshToken = getCookie("sb-refresh-token");

        if (!accessToken && !refreshToken) {
          return { data: { session: null } };
        }

        return {
          data: {
            session: {
              access_token: accessToken || "demo-token",
              refresh_token: refreshToken || "demo-refresh",
              user: { email: "demo@example.com" },
            },
          },
        };
      },
      resetPasswordForEmail: async () => ({ error: null }),
      setSession: async () => ({ error: null }),
    },
  };
}
