import React from "react";

import {Navigate, Outlet} from "react-router-dom";

import {useAuth} from "../context/AuthContext.jsx"

export default function PublicRoute(){
    const {isAuthenticated, loading} = useAuth()

    if(loading) return null

    return !isAuthenticated ? <Outlet />: <Navigate to="/" replace />
}