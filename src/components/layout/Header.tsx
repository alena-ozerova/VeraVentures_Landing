import React from "react";
import { createClient } from "@/lib/supabase/server";
import SignInButton from "./client/SignInButton";

export default async function Header() {
  const supabase = createClient();

  // Fetch user's session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full p-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">Vera Ventures</div>

        {/* Authentication */}
        <div>
          {user ? (
            <span className="text-white">{user.email}</span>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}
