import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";      // 👈 Sahi extension mapping check kijiye
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Login from "./pages/Login.jsx";                  // 👈 Aapka naya badhiya page component

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* 🔒 PROTECTED ROUTING LAYER: Sirf login users ke liye */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<RootLayout />}>
                        {/* Dashboard Home Feed */}
                        <Route path="/" element={
                            <div className="text-2xl font-bold text-white p-6 antialiased">
                                🔥 Live Home Feed Aggregations Analytics Loading...
                            </div>
                        } />
                        {/* Creator Analytics Studio */}
                        <Route path="/studio" element={
                            <div className="text-2xl font-bold text-red-500 p-6 antialiased">
                                📊 Production Creator Studio Controller Active
                            </div>
                        } />
                    </Route>
                </Route>

                {/* 🔓 PUBLIC ROUTING LAYER: Bina login ke login page dikhana */}
                <Route element={<PublicRoute />}>
                    {/* Yahan se saara temporary raw HTML code aur simulated button hata kar 
                        direct aapke banaye hue professional <Login /> component ko load kar diya! */}
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Wildcard Fallback Route Matrix */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
