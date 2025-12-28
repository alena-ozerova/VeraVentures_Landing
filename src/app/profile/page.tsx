import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/login");
    }

    const metadata = user.user_metadata || {};
    const firstName = metadata.first_name || "User";
    const lastName = metadata.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return (
        <div className="min-h-screen w-full bg-black text-white pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Your Profile
                </h1>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                                Member
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-xl bg-black/40 border border-white/5">
                            <h3 className="text-gray-400 text-sm font-medium mb-1">
                                First Name
                            </h3>
                            <p className="text-lg text-white">{firstName}</p>
                        </div>
                        <div className="p-6 rounded-xl bg-black/40 border border-white/5">
                            <h3 className="text-gray-400 text-sm font-medium mb-1">
                                Last Name
                            </h3>
                            <p className="text-lg text-white">{lastName || "-"}</p>
                        </div>
                        <div className="p-6 rounded-xl bg-black/40 border border-white/5 md:col-span-2">
                            <h3 className="text-gray-400 text-sm font-medium mb-1">Email</h3>
                            <p className="text-lg text-white">{user.email}</p>
                        </div>
                        <div className="p-6 rounded-xl bg-black/40 border border-white/5 md:col-span-2">
                            <h3 className="text-gray-400 text-sm font-medium mb-1">User ID</h3>
                            <p className="text-sm text-gray-500 font-mono">{user.id}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Manage your account preferences and personal information.
                        </p>
                        <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium text-sm">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
