import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserAuthenticationSession = async () => {
            try {
                
                const response = await apiClient.get("/users/current-user");
                if (response?.data) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                
                setUser(null);
                setIsAuthenticated(false);
            } finally {
               
                setLoading(false);
            }
        };

        checkUserAuthenticationSession();
    }, []);

    
    const logoutGlobalContextSession = async () => {
        try {
            await apiClient.post("/users/logout");
        } catch (error) {
            console.error("[LOGOUT PERSISTENCE BUFFER EXCEPTION]:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, loading, logoutGlobalContextSession }}>
            {}
            {!loading ? children : (
                <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("[GLOBAL MEMORY BOUNDARY CRASH]: useAuth hook can only be invoked inside an explicit AuthProvider wrapper scope.");
    }
    return context;
};