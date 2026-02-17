import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import ProfileForm from "@/components/auth/ProfileForm";

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
    // const fullName = `${firstName} ${lastName}`.trim(); // Handled in ProfileForm now

    return (
        <div className="min-h-screen w-full bg-black text-white pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center space-x-6 mb-8">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Your Profile
                        </h1>
                        <p className="text-gray-400 mt-2">{user.email}</p>
                    </div>
                </div>

                <ProfileForm user={user} firstName={firstName} lastName={lastName} />
            </div>
        </div>
    );
}
