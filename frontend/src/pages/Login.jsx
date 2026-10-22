import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 Link import kiya registration page ke liye
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

export default function Login() {
    // 1. Core structural state objects tracking inputs variables controls
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    const { setIsAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();

    // ⚙️ UNIVERSAL INPUT PARAMETERS BINDING HANDLER
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 🚀 ASYNCHRONOUS FORM PROCESSING HANDLER TRANSACTION
    const handleLoginExecutionSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitLoading(true);

        // Strict parameters checking defense guards
        if (!formData.password) {
            setError("Password validation key credential is required.");
            setSubmitLoading(false);
            return;
        }

        if (!formData.username && !formData.email) {
            setError("Please provide either your registered username or email address.");
            setSubmitLoading(false);
            return;
        }

        try {
            // Build dynamic request payload logic based on user input parameters choice
            const payload = { password: formData.password };
            if (formData.username.trim() !== "") payload.username = formData.username.trim();
            if (formData.email.trim() !== "") payload.email = formData.email.trim();

            // Fire transport layer action straight to backend endpoint channel port 7000
            const response = await apiClient.post("/users/login", payload);

            // 🚨 Sahi structure check: Hamein ApiResponse ke data se user uthana hai
            if (response?.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                
                // Seamlessly route user back inside the secure root layout grids path panel
                window.location.href = "/"; 
            }
        } catch (err) {
            setError(err?.message || "Invalid authentication handshake references. Connection rejected.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 sm:px-6 lg:px-8 antialiased">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl sm:p-10 transition-all duration-300 hover:border-zinc-700">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        YouTube<span className="text-red-600 font-black text-xl ml-0.5">PRO</span> Studio
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">Secure Client Entrance Gateway System Node</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLoginExecutionSubmit}>
                    {/* ALERT COMPONENT SHUNT LOGIC ERROR MESSAGES CONTAINER */}
                    {error && (
                        <div className="rounded-xl bg-red-900/30 p-4 border border-red-500/40 text-sm font-medium text-red-400 animate-shake">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Username</label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-zinc-600 shadow-inner outline-none transition-all focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                placeholder="e.g., hiipro269"
                            />
                        </div>

                        <div className="flex items-center justify-center my-1 text-xs font-bold text-zinc-600 tracking-widest uppercase">— OR —</div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-zinc-600 shadow-inner outline-none transition-all focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                placeholder="e.g., developer@google.com"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password Secret Key</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-zinc-600 shadow-inner outline-none transition-all focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        {/* 🛠️ Cleaned duplicate buttons - Sirf ek perfect single action button rakha! */}
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="group relative flex w-full justify-center rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 hover:bg-zinc-200"
                        >
                            {submitLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent"></div>
                            ) : "Execute Handshake Connection"}
                        </button>
                    </div>

                    {/* 🔥 THE NEW USER REGISTRATION LINK TRIGGER (Properly closed syntax alignment) */}
                    <p className="mt-4 text-center text-xs text-zinc-400">
                        New user to YouTube PRO?{" "}
                        <Link 
                            to="/register" 
                            className="text-white font-bold cursor-pointer hover:underline transition-all duration-150"
                        >
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
