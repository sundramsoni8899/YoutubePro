import React, {useState} from "react";
import { Outlet } from "react-router-dom";

import VideoUploadModal from "../components/videoUploadModal.jsx";


export default function RootLayout() {

    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const handleUploadSuccessRefresh= ()=>{
        window.location.reload()
    }
    return (
        <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-[#f1f1f1] antialiased">
            
            <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-800 bg-[#0f0f0f] px-4 font-semibold shadow-md">
                <div className="text-xl font-bold tracking-tight text-white">YouTube<span className="text-red-600 font-extrabold text-sm ml-0.5">PRO</span></div>

                <button 
                   onClick={()=>setIsUploadOpen(true)} className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-95 shadow-lg shadow-red-600/20 hover:bg-red-700">
                    + Upload Video

                </button>
            </header>

            <div className="flex flex-1">
                
                <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-zinc-800 bg-[#0f0f0f] p-4 text-sm font-medium text-zinc-300 sm:flex">
                    <nav className="flex flex-col gap-2">
                        <div className="rounded-lg bg-zinc-800 px-3 py-2 text-white shadow-sm cursor-pointer transition-all hover:bg-zinc-700">Home Feeds</div>
                        <div className="rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-zinc-800 hover:text-white"> Video Studio</div>
                        <div className="rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-zinc-800 hover:text-white"> Playlists Vault</div>
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
