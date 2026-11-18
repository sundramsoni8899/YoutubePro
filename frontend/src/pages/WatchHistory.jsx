import React, {useEffect, useState} from 'react';

import {useNavigate} from "react-router-dom";

import apiClient from "../api/apiClient.js";    

import {formatDistanceToNow} from "../utils/formatDistanceToNow.js";

export default function WatchHistory(){

    const [historyVideos, setHistoryVideos] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchWatchHistory = async()=>{
            try{
                setLoading(true)
                const res = await apiClient.get("/users/watchHistory")
                if(res?.data){
                    setHistoryVideos(res.data)
                } 
            } catch(err){
                setError(err?.message || "Failed to fetch watch history. Infrastructure exception.")
            } finally{
                setLoading(false)
            }           
        }
        fetchWatchHistory()
    }, [])

    if(loading){
        return(
             <div className="flex h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-zinc-800 bg-red-900/10 p-6 text-center text-red-400">
                 {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 antialiased">
            <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-3xl font-black tracking-tight text-white">Watch History</h1>
                <p className="mt-1 text-xs text-zinc-400">Videos you have recently streamed across the platform</p>
            </div>

            {historyVideos.length === 0 ? (
                <div className="flex h-[40vh] flex-col items-center justify-center text-center text-zinc-500">
                    <span className="mb-3 text-4xl">🕰️</span>
                    <h3 className="text-lg font-bold text-white">No Watch History Yet</h3>
                    <p className="mt-1 text-xs">Watch any video from the Home feed to see it appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {historyVideos.map((vid) => (
                        <div
                            key={vid._id}
                            onClick={() => navigate(`/video/${vid._id}`)}
                            className="group flex cursor-pointer flex-col gap-2"
                        >
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                                <img
                                    src={vid.thumbnail}
                                    alt={vid.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
                                    {parseFloat(vid.duration || 0).toFixed(0)}s
                                </span>
                            </div>

                            <div className="flex gap-3 px-1">
                                <img
                                    src={vid.owner?.avatar || "https://cloudinary.com"}
                                    alt={vid.owner?.fullName}
                                    className="h-8 w-8 rounded-full border border-zinc-800 object-cover"
                                />
                                <div className="flex flex-col">
                                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white group-hover:text-zinc-300">
                                        {vid.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-zinc-400">{vid.owner?.fullName}</p>
                                    <p className="text-[11px] text-zinc-500">
                                        {vid.views || 0} views • {formatDistanceToNow(vid.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}