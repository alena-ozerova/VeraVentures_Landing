"use client";

import React, { useEffect, useState } from "react";
import SignInButton from "./client/SignInButton";
import SignOutButton from "@/components/layout/client/SignOutButton";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Check if Supabase is configured
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const supabase = createClient();

        // Fetch user's session
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();

        setUser(supabaseUser);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  return (
    <header className="w-full p-6 backdrop-blur-sm bg-black/30 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
            Vera Ventures
          </span>
        </div>

        {/* Authentication */}
        <div>
          {loading ? (
            <div className="text-white text-sm">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">{user.email}</span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex gap-3">
              <SignInButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
