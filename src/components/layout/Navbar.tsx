"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuItem, HoveredLink } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => {
                subscription.unsubscribe();
            };
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    };

    return (

        <div
            className={cn("absolute top-0 inset-x-0 h-24 z-50 pointer-events-none", className)}
        >
            {/* Logo - Top Center */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <Link href="/">
                    <div className="relative h-28 w-64 md:h-32 md:w-80">
                        {/* Using object-contain to ensure it fits well. The user said 'vera-logo' which is a jpg. */}
                        <Image
                            src="/vera-logo.jpg"
                            alt="Vera Ventures"
                            fill
                            className="object-contain rounded-full" /* rounding might look better if it's square, but let's try standard first. actually user just said put it there. I'll make it contained. */
                        />
                    </div>
                </Link>
            </div>

            {/* Profile Menu - Top Right */}
            <div className="absolute top-5 right-5 pointer-events-auto">
                <Menu setActive={setActive}>


                    {user ? (
                        <MenuItem setActive={setActive} active={active} item="Profile">
                            <div className="flex flex-col space-y-4 text-sm w-48">
                                <div className="flex flex-col space-y-1">
                                    <p className="font-medium text-black dark:text-white">Signed in as</p>
                                    <p className="text-neutral-700 dark:text-neutral-300 text-xs truncate" title={user.email}>
                                        {user.email}
                                    </p>
                                </div>
                                <hr className="border-neutral-200 dark:border-neutral-700" />
                                <HoveredLink href="/profile">View Profile</HoveredLink>
                                <button
                                    onClick={handleSignOut}
                                    className="text-left text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </MenuItem>
                    ) : (
                        <NavbarLink href="/auth/login" text="Sign In" />
                    )}
                </Menu>
            </div>
        </div>
    );
}

// Helper for simple top-level links that matches the style of MenuItem text
function NavbarLink({ href, text }: { href: string; text: string }) {
    return (
        <Link
            href={href}
            className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white relative"
        >
            {text}
        </Link>
    );
}
