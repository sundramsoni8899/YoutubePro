import React from "react";

import {Navigate, Outlet} from "react-router-dom"

import {useAuth} from "../context/AuthContext.jsx"

export default function ProtectedRoute(){
    const {isAuthenticated, loading}= useAuth();

    if(loading) return null;

    return isAuthenticated ? <Outlet />: <Navigate to="/login" replace/>  // replace yha par use hua hai kyoki jab user bina login ke studio par pahuch gya toh toh browser use login par bhej dega agra replace nah hua toh voh back btn pres karke dobaara studio par pahuch jayege aur voh infinty loop mein fas jayega
}