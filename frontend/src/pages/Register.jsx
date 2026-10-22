import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import apiClient from "../api/apiClient.js";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: ""
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [error, setError] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    const { setUser, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterSubmitExecution = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitLoading(true);

        console.log("🚀 [DEBUG]: Register Form Submitted!");

        if (!formData.username || !formData.email || !formData.fullName || !formData.password) {
            setError("All text configuration fields are strictly required.");
            setSubmitLoading(false);
            return;
        }

        if (!avatarFile) {
            setError("Profile Avatar image file is mandatory for registration.");
            setSubmitLoading(false);
            return;
        }

        try {
            const multipartPayload = new FormData();
            multipartPayload.append("username", formData.username.trim().toLowerCase());
            multipartPayload.append("email", formData.email.trim());
            multipartPayload.append("fullName", formData.fullName.trim());
            multipartPayload.append("password", formData.password);
            
            // File append logic checking
            multipartPayload.append("avatar", avatarFile);
            
            if (coverImageFile) {
                multipartPayload.append("coverImage", coverImageFile);
            }

            console.log("📡 [DEBUG]: Sending signup request payload...");
            const regResponse = await apiClient.post("/users/register", multipartPayload);
            console.log("🟢 [DEBUG]: Registration Server Response:", regResponse);

            if (regResponse) {
                console.log("📡 [DEBUG]: Initiating auto-login handshake...");
                const loginResponse = await apiClient.post("/users/login", {
                    username: formData.username.trim().toLowerCase(),
                    password: formData.password
                });

                const loginData = loginResponse?.data || loginResponse;
                console.log("🟢 [DEBUG]: Login Server Response:", loginData);

                if (loginData?.user) {
                    setUser(loginData.user);
                    setIsAuthenticated(true);
                    
                    // Dashboard landing redirect
                    window.location.href = "/";
                }
            }
        } catch (err) {
            console.error("⛔ [CRITICAL PIPELINE EXCEPTION]:", err);
            setError(err?.message || err?.response?.data?.message || "Account initialization rejected.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-12 sm:px-6 lg:px-8 antialiased">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl sm:p-10 transition-all duration-300 hover:border-zinc-700">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">Join the YouTube PRO developer cluster</p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmitExecution}>
                    {error && (
                        <div className="rounded-xl bg-red-900/30 p-4 border border-red-500/40 text-sm font-medium text-red-400">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <input name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" placeholder="e.g., Amit Kumar" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Username</label>
                            <input name="username" type="text" value={formData.username} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" placeholder="e.g., amitpro26" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" placeholder="e.g., amit@google.com" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password Secret Key</label>
                            <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" placeholder="••••••••••••" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avatar Profile (Required)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setAvatarFile(e.target.files[0])} 
                                    className="mt-1 block w-full text-xs text-zinc-400 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-700" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cover Banner (Optional)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setCoverImageFile(e.target.files[0])} 
                                    className="mt-1 block w-full text-xs text-zinc-400 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-700" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        {/* 🔥 FIXED BUTTON SYNTAX EXPRESSION */}
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="group relative flex w-full justify-center rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-black transition-all duration-150 hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400"
                        >
                            {submitLoading ? "Processing Cluster..." : "Register Account"}
                        </button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-xs text-zinc-500">
                            Already configured?{" "}
                            <Link to="/login" className="text-white hover:underline font-semibold">
                                System Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

