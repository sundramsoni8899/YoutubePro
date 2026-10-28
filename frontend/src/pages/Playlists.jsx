import React, {useEffect, useState} from "react";

import apiClient from "../api/apiClient.js";

import {useAuth} from "../context/AuthContext.jsx"

export default function Playlists(){
    const {user} = useAuth()

    const [playlists, setPlaylists] = useState([])

    const [selectedPlaylist, setSelectedPlaylist] = useState(null)

    const [newPlaylistName, setNewPlaylistName] = useState("")

    const [newPlaylistDescription, setNewplaylistdescription] = useState("")

    const [loading, setLoading] = useState(true)

    const [iscreateOpen, setIsCreateOpen] = useState(false)

    const [error, setError] = useState("")

    const fetchUserPlaylistsVault = async()=>{
        try{
            setLoading(true)

            setError("")

            const response = await apiClient.get(`/playlists/user/${user?._id}`)
            if(response?.data){
                setPlaylists(response.data)
            } 
        } catch (err) {
            setError(err?.message || "Failed to establish aggregate playlist connection tracks.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user?._id) fetchUserPlaylistsVault()
    }, [user?._id])

    const handleCreatePlaylistSubmit = async(e)=>{
        e.preventDefault()
        if(!newPlaylistName.trim() || !newPlaylistDesc.trim()) return

        try{
            const response = await apiClient.post("/playlists", {
                name: newPlaylistName.trim(),
                description: newPlaylistDesc.trim()
            })
            if(response?.data){
                setNewPlaylistName("")
                setNewplaylistdescription("")
                setIsCreateOpen(false)
                fetchUserPlaylistsVault()
            }
        } catch(err){
            alert(err?.message || "Folder registration collision loop")
        }
    }

    const handleExtractVideoFromFolder = async(playlistId, videoId)=>{
       
        if (!window.confirm("Are you strictly sure you want to extract this video reference out of this directory?")) return;

        try {  
           const response = await apiClient.patch(`/playlists/remove/${playlistId}/${videoId}`);
            if (response?.success) {
                setSelectedPlaylist((prev)=>({
                    ...prev,
                    videos: prev.videos.filter((vid)=> vid._id !== videoId)
                }))
               fetchUserPlaylistsVault()
            }
        } catch(err){
            alert(err?.message || "Unauthorized extraction interception.");
        }
    }
    if(loading && playlists.length === 0){
        return(
            <div className="flex h-[50vh] items-center justify-center bg-[#0f0f0f]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
            </div>
        )
    }

        return (
        <div className="space-y-8 antialiased text-[#f1f1f1] select-none">
            {/* Header Dashboard Control Panel Title Sections */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Playlists Vault</h1>
                    <p className="text-xs text-zinc-400 mt-1">Custom multi-media sub-document structural repositories</p>
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-xl bg-white px-4 py-2 text-xs font-black text-black transition-all active:scale-95 shadow-md hover:bg-zinc-200"
                >
                    + Create New Playlist
                </button>
            </div>
            
            {error && (
                <div className="rounded-xl bg-red-900/10 p-4 border border-red-500/30 text-xs font-bold text-red-400">⚠️ {error}</div>
            )}

            {/* 📁 INTERACTIVE FOLDERS HOVER CELLS RESPONSIVE LAYOUT GRID SECTION */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {playlists.map((folder) => (
                    <div 
                        key={folder._id}
                        onClick={() => setSelectedPlaylist(folder)} // Expand and inspect folder contents array layout onclick
                        className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl cursor-pointer"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl transition-transform group-hover:scale-110">📂</span>
                                <span className="rounded-xl bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-zinc-400 border border-zinc-800 shadow-inner">
                                    {folder.videos?.length || 0} clips linked
                                </span>
                            </div>
                            <h3 className="text-md font-black text-white leading-tight group-hover:text-zinc-100">{folder.name}</h3>
                            <p className="line-clamp-2 text-xs font-medium text-zinc-400 leading-relaxed pr-1">{folder.description}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-900 text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider flex justify-between group-hover:text-zinc-400">
                            <span>Inspect Assets ➔</span>
                            <span>{new Date(folder.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {playlists.length === 0 && (
                    <div className="col-span-full py-16 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">Zero customized directories registered inside cluster loops.</div>
                )}
            </div>

            {/* 🏛️ DRILL DOWN SUBSYSTEM VIEWPORT: EXPANDED POPULATED VIDEOS REPOSITORY DRAWER LAYOUT */}
            {selectedPlaylist && (
                <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div>
                            <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                                <span className="text-xl">📁</span> Active Directory Core: {selectedPlaylist.name}
                            </h2>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">{selectedPlaylist.description}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedPlaylist(null)} // Clear expansion slot view to close the drawer layout
                            className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-extrabold text-zinc-400 transition-all hover:bg-zinc-700 hover:text-white"
                        >
                            ✕ Collapse Drawer
                        </button>
                    </div>

                    {/* Populated inside internal video sub-structures list loop arrays */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-1">
                        {selectedPlaylist.videos?.length === 0 ? (
                            <p className="col-span-full text-center text-xs text-zinc-500 py-6 font-bold uppercase tracking-wider">Empty folder structure blocks. Video assets array slots unlinked.</p>
                        ) : (
                            selectedPlaylist.videos.map((vid) => (
                                <div key={vid._id} className="group relative rounded-xl border border-zinc-900 bg-[#0f0f0f] p-3 transition-all hover:border-zinc-800 flex flex-col gap-2">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900">
                                        <img src={vid.thumbnail} alt={vid.title} className="h-full w-full object-cover" />
                                    </div>
                                    <h4 className="line-clamp-1 text-xs font-bold text-white leading-tight">{vid.title}</h4>
                                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                                        <span>{vid.views || 0} views</span>
                                        {/* EXPLICIT REMOVE TARGET LINK ATOMIC OPERATOR TRIGGERS AXIOS HANDLER ACTION BUTTON */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Stop click cascading to prevent side effects
                                                handleExtractVideoFromFolder(selectedPlaylist._id, vid._id);
                                            }}
                                            className="font-extrabold text-zinc-600 hover:text-red-500 transition-colors uppercase tracking-wider"
                                        >
                                            ✕ Pull Out
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* 🛡️ THE HIDDEN PLAYLIST CREATION MODAL SHIELD ENGINE POP UP CONTAINER */}
            {iscreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Initialize Folder Cluster</h3>
                            <button 
                                onClick={() => setIsCreateOpen(false)} 
                                className="text-zinc-400 hover:text-white font-bold text-xs"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <form onSubmit={handleCreatePlaylistSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Directory Name</label>
                                <input 
                                    type="text" 
                                    value={newPlaylistName} 
                                    onChange={(e) => setNewPlaylistName(e.target.value)} 
                                    className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-3 py-2.5 text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-500" 
                                    placeholder="e.g., Coding Marathon Streams" 
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Description</label>
                                <textarea 
                                    rows="2" 
                                    value={newPlaylistDescription} 
                                    onChange={(e) => setNewplaylistdescription(e.target.value)} 
                                    className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-3 py-2.5 text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-500 resize-none" 
                                    placeholder="Enter collection reference target description summary..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={!newPlaylistName.trim() || !newPlaylistDesc.trim()} 
                                className="mt-2 flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black transition-all active:scale-95 disabled:opacity-30"
                            >
                                Register Vault Node
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
        )
}