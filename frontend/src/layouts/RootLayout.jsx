import React, {useState, useEffect} from "react";
import { Outlet,Link, useNavigate, useSearchParams } from "react-router-dom";

import VideoUploadModal from "../components/videoUploadModal.jsx";

import {useAuth} from "../context/AuthContext.jsx";

import {useDebounce} from "../hooks/useDebounce.js";



export default function RootLayout() {

    const [isUploadOpen, setIsUploadOpen] = useState(false)

    const {user} = useAuth()

    const navigate = useNavigate()

    const [searchParams] =useSearchParams()

    const [searchInput, setSearchInput] = useState(searchParams.get("query") || "")

    const debouncedSearch = useDebounce(searchInput, 500)

    useEffect(()=>{
        const trimmed = debouncedSearch.trim()
        if(trimmed){
            navigate(`/home?query=${encodeURIComponent(trimmed)} `)
        } else if(searchParams.has("query")){
            navigate("/home")
        }   
    },[debouncedSearch])


    const handleUploadSuccessRefresh= ()=>{
        window.location.reload()
    }
    return (
        <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-[#f1f1f1] antialiased">
            
            <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-800 bg-[#0f0f0f] px-4 font-semibold shadow-md">
                <div className="text-xl font-bold tracking-tight text-white">YouTube<span className="text-red-600 font-extrabold text-sm ml-0.5">PRO</span></div>

                <div className="relative flex w-full max-w-md items-center">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search videos by title or description..."
                        className="w-full rounded-full border border-zinc-800 bg-[#161616] py-1.5 pl-4 pr-9 text-xs font-medium text-white placeholder-zinc-500 outline-none transition focus:border-zinc-600"
                    />
                    {searchInput ? (
                        <button
                            onClick={() => setSearchInput("")}
                            className="absolute right-3 text-xs font-bold text-zinc-400 hover:text-white"
                        >
                            ✕
                        </button>
                    ) : (
                        <span className="pointer-events-none absolute right-3 text-xs text-zinc-500">🔍</span>
                    )}
                </div>

                <button 
                   onClick={()=>setIsUploadOpen(true)} className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-95 shadow-lg shadow-red-600/20 hover:bg-red-700">
                    + Upload Video

                </button>

                {user && (
                        <Link 
                            to={`/channel/${user.username}`} 
                            className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 py-1 pl-1 pr-3 transition hover:border-zinc-500"
                        >
                            <img 
                                src={user.avatar} 
                                alt={user.username} 
                                className="h-7 w-7 rounded-full object-cover" 
                            />
                            <span className="hidden text-xs font-bold text-white sm:inline">
                                @{user.username}
                            </span>
                        </Link>
                    )}
            </header>

            <div className="flex flex-1">
                
                <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-zinc-800 bg-[#0f0f0f] p-4 text-sm font-medium text-zinc-300 sm:flex">
                    <nav className="flex flex-col gap-2">
                        <Link to="/home" className="rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-zinc-800 hover:text-white block font-medium">
                                🍿 Home Feeds
                        </Link>
                        <Link to="/studio" className="rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-zinc-800 hover:text-white block font-medium">
                                🚀 Video Studio
                        </Link>
                        <Link to="/playlists" className="rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-zinc-800 hover:text-white block font-medium">
                                💾 Playlists Vault
                        </Link>

                        {user && (
                            <Link to={`/channel/${user.username}`} className="block cursor-pointer rounded-lg px-3 py-2 font-medium transition-all hover:bg-zinc-800 hover:text-white">
                                👤 My Channel Profile
                            </Link>

                            
                        )}

                        <Link to="/history" className="block cursor-pointer rounded-lg px-3 py-2 font-medium transition-all hover:bg-zinc-800 hover:text-white">
    🕰️ Watch History
</Link>
                    </nav>
                </aside>

                
                <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
                    
                    <Outlet />
                </main>
            </div>
            <VideoUploadModal 
            isOpen={isUploadOpen}
            onClose={()=>setIsUploadOpen(false)}
            onUploadSuccess={handleUploadSuccessRefresh}
            />
        </div>
    );
}
