import React, {useEffect, useState} from "react"

import apiClient from "../api/apiClient.js"

import { formatDistanceToNow } from "../utils/formatDistanceToNow.js"

import { useNavigate } from "react-router-dom"

export default function Home(){
    const [videos, setVideos] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, SetError] = useState("")

    const [paginationInfo, setPaginationInfo] = useState({
        page: 1,
        totalPages: 1
    })

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchHomeFeedVideos = async()=>{
            try{
                setLoading(true);
                const response = await apiClient.get(`/videos/?page=${paginationInfo.page}&limit=12`)

                if(response?.data?.docs){
                    setVideos(response.data.docs)
                    setPaginationInfo({
                        page: response.data.page,
                        totalPages: response.data.totalPages
                    })
                }
            } catch(err){
                SetError(err?.message || "Failed to establish aggregate data streams. Link failed.")
            } finally{
                setLoading(false)
            }
        }
        fetchHomeFeedVideos()
    }, [])

    if(loading){
        return(
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-10 w-12 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
            </div>
        )
    }
    if (error) {
        return (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center text-zinc-400">
                 {error}. Please refresh or verify network session configurations.
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-zinc-500">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-white">No Videos Found</h3>
                <p className="text-sm mt-1 max-w-xs">Be the first creator to ignite the cluster! Upload an MP4 stream file inside the Studio.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 antialiased">
            {/*  HIGH PERFORMANCE RESPONSIVE VIDEO GRID CONTAINER */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-300">
                {videos.map((video) => (
                    // Always inject unique identification hex string as the 'key' property
                    <div 
            key={video._id} 
            onClick={() => navigate(`/video/${video._id}`)} 
            className="group flex flex-col gap-2 cursor-pointer"
        >
                        
                        {/* A. THUMBNAIL LAYOUT MATRIX BOX */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
                            <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy" // Native browser layout optimization for lazy loading screen images
                            />
                            {/* Injected exact duration timer calculations overlay anchor */}
                            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-semibold text-white tracking-wider">
                                {parseFloat(video.duration || 0).toFixed(0)}s
                            </span>
                        </div>

                        {/* B. DETAILED DESCRIPTIVE CORE METADATA METRICS BLOCK */}
                        <div className="flex gap-3 px-1">
                            {/* Creator Avatar Bubble Profile pointer */}
                            <img 
                                src={video.owner?.avatar || "https://cloudinary.com"} 
                                alt={video.owner?.fullName}
                                className="h-9 w-9 rounded-full object-cover border border-zinc-800"
                            />
                            
                            <div className="flex flex-col gap-1">
                                <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white group-hover:text-zinc-200">
                                    {video.title}
                                </h3>
                                <p className="text-xs text-zinc-400 font-medium mt-0.5 hover:text-white transition-colors">
                                    {video.owner?.fullName}
                                </p>
                                <div className="flex items-center text-xs text-zinc-400 font-normal">
                                    <span>{video.views || 0} views</span>
                                    <span className="mx-1.5 font-bold text-zinc-600">•</span>
                                    {/* Invoking distance formatter timestamp variables */}
                                    <span>{formatDistanceToNow(video.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );

}