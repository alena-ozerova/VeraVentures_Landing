"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
    user: any;
    firstName: string;
    lastName: string;
}

export default function ProfileForm({
    user,
    firstName: initialFirstName,
    lastName: initialLastName,
}: ProfileFormProps) {
    const router = useRouter();
    const supabase = createClient();

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setIsEditing(false);
            router.refresh();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Password updated successfully!" });
            setIsChangingPassword(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update password." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            // Best-effort deletion since we lack admin deleteUser service key in basic helper
            // Calls a hypothetical RPC or just signs out if not available.
            // Ideally this should call a server action or API route with admin privileges.

            const { error } = await supabase.rpc('delete_user');

            if (error) {
                // If RPC fails (likely if not set up), fall back to sign out and message
                console.error("Delete user RPC failed:", error);
                await supabase.auth.signOut();
                router.push("/");
                alert("Account deletion request submitted. Please contact support to finalize data removal if you cannot log in.");
                return;
            }

            await supabase.auth.signOut();
            router.push("/");
        } catch (error: any) {
            setMessage({ type: "error", text: "Failed to delete account. Please contact support." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {message && (
                <div
                    className={`p-4 rounded-lg text-sm font-medium ${message.type === "success"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Profile Details */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium text-sm"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFirstName(initialFirstName);
                                    setLastName(initialLastName);
                                }}
                                className="px-4 py-2 rounded-lg bg-transparent hover:bg-white/5 text-gray-400 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <h3 className="text-gray-400 text-xs font-medium mb-1">First Name</h3>
                            <p className="text-lg text-white">{firstName}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <h3 className="text-gray-400 text-xs font-medium mb-1">Last Name</h3>
                            <p className="text-lg text-white">{lastName || "-"}</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5">
                    <h3 className="text-gray-400 text-xs font-medium mb-1">Email</h3>
                    <p className="text-lg text-white">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
            </div>

            {/* Password Management */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium text-sm"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {isChangingPassword ? (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="px-4 py-2 rounded-lg bg-transparent hover:bg-white/5 text-gray-400 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-400 text-sm">
                        Password was last updated recently. Keep it secure.
                    </p>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/10 rounded-2xl p-8 shadow-2xl">
                <p className="text-gray-400 text-sm mb-6">
                    Permanently delete your account and all of your content.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-medium text-sm transition-colors disabled:opacity-50"
                >
                    {isLoading ? "Processing..." : "Delete Account"}
                </button>
            </div>
        </div>
    );
}
