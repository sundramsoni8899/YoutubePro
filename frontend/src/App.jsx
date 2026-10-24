import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";      
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Login from "./pages/Login.jsx";    
import Register from "./pages/Register.jsx"; 
import Home from "./pages/Home.jsx";
import { useAuth } from "./context/AuthContext.jsx"; // Global identity observer check import kiya

export default function App() {
    const { isAuthenticated, loading } = useAuth();

    // Re-hydration check guard: Jab tak async token loading chalu hai, tab tak blank rendering rok kar spinner bitha do
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white"></div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* 🧭 GLOBAL ENTRANCE ROUTE REDIRECTION GATEWAY */}
                {/* 🔥 THE ABSOLUTE RE-ARRANGEMENT: Dynamic condition setup based on live login states */}
                <Route 
                    path="/" 
                    element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
                />

                {/* 🔒 PHASE A: SECURE PROTECTED PLATFORM VIEWS (REQUIRES AUTH HANDSHAKE COOKIES) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<RootLayout />}>
                        {/* Real video aggregation feed connected flawlessly */}
                        <Route path="/home" element={<Home />} />
                        
                        <Route path="/studio" element={
                            <div className="text-2xl font-bold text-red-500 p-6 antialiased">
                                📊 Production Creator Studio Controller Active
                            </div>
                        } />
                    </Route>
                </Route>

                {/* 🔓 PHASE B: PUBLIC ACCESS BOUNDS ONLY (RESTRICTED FOR LOGGED-IN PROFILES) */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                

                {/* 🛡️ THE SECURITY FALLBACK GUARD MATRICES */}
                {/* Agar random kuch bhi galat URL type hoga, to user safely login/home par conditional automatic transfer ho jayega */}
                <Route 
                    path="*" 
                    element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
                />
            </Routes>
        </BrowserRouter>
    );
}

