"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuItem, HoveredLink } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
            className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
        >
            <Menu setActive={setActive}>
                <NavbarLink href="/about" text="About" />
                <NavbarLink href="/team" text="Team" />
                <NavbarLink href="/articles" text="Our Articles" />
                <NavbarLink href="/partners" text="Partners" />

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
                    <NavbarLink href="/login" text="Sign In" />
                )}
            </Menu>
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
