"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    // Skip auth checks in development or if not configured
    if (!supabaseConfigured) {
      console.log("Demo mode: Supabase not configured, skipping auth");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // Get initial session
      supabase.auth
        .getSession()
        .then(({ data }: { data: { session: any } }) => {
          const session = data?.session;
          setUser(session?.user ?? null);
          setLoading(false);
        });

      // Listen for auth changes
      const subscription = supabase.auth.onAuthStateChange(
        (_event: string, session: { user: any } | null) => {
          setUser(session?.user ?? null);
          setLoading(false);
        },
      );

      return () => {
        try {
          if (
            subscription &&
            subscription.data &&
            subscription.data.subscription
          ) {
            subscription.data.subscription.unsubscribe();
          }
        } catch (e) {
          console.error("Error unsubscribing from auth:", e);
        }
      };
    } catch (error) {
      console.error("AuthProvider error:", error);
      setLoading(false);
    }
  }, [supabaseConfigured]);

  const signOut = async () => {
    try {
      setUser(null);

      if (!supabaseConfigured) {
        console.log("Demo mode: Simulating sign out");
        router.push("/auth/login");
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Sign out error:", error);
      // Ensure redirect happens even if error occurs
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
