import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";      
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Login from "./pages/Login.jsx";    
import Register from "./pages/Register.jsx"; //  Sahi register path import hai

import Home from "./pages/Home.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* 🔒 PROTECTED ROUTING LAYER: Sirf logged-in users ke liye access open hoga */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<RootLayout />}>
                        
                        {/* 1. Dashboard Home Feed Path */}
                        <Route path="/" element={
                            <div className="text-2xl font-bold text-white p-6 antialiased">
                                🔥 Live Home Feed Aggregations Analytics Loading...
                            </div>
                        } />
                        
                        {/* 2. Creator Analytics Studio Path */}
                        <Route path="/studio" element={
                            <div className="text-2xl font-bold text-red-500 p-6 antialiased">
                                📊 Production Creator Studio Controller Active
                            </div>
                        } />

                    </Route>
                </Route>

                {/* 🔓 PUBLIC ROUTING LAYER: Bina login ke sirf guests ke liye open hoga */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    
                    {/* 🔥 THE ABSOLUTE ROUTING FIX: Added register route mapping path */}
                    <Route path="/register" element={<Register />} />

                    <Route path="/home" element={<Home />} />
                </Route>
                

                {/* 🛡️ THE SECURITY FALLBACK GUARD MATRICES */}
                {/* Agar user random URL type karega, to safely login page par redirect hoga. */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
