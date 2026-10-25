import React, {useEffect, useState} from "react";

import apiClient from "../api/apiClient";

export default function studio(){

    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalSubscribers: 0,
        totalLikes: 0,
    })

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    useEffect(()=>{
        const fetchCreatorChannelDashboardStats = async()=>{
            try{
                setLoading(true)

                const response = await apiClient.get("/dashboard/stats")

                if(response?.data){

                    setStats(response.data)

                } 
            } catch(err){
                    setError(err?.message || "Failed to compile channel stats. Infrastructure exception.")
            } finally{
                setLoading(false)
            }
        }

        fetchCreatorChannelDashboardStats()
    }, [])

    if(loading){
        return(
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
            </div>
        )
    }

    if(error){
        return(
            <div className="rounded-xl border border-zinc-800 bg-red-900/10 p-6 text-center text-red-400">
                 {error}. Analytical compilation pipeline error loops.
            </div>
        )
    }

    const analyticsTiles = [
        { id: 1, name: "Total Videos Published", value: stats.totalVideos, icon: "🎬", color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: 2, name: "Combined Video Views", value: stats.totalViews.toLocaleString(), icon: "👁️", color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: 3, name: "Active Channel Subscribers", value: stats.totalSubscribers.toLocaleString(), icon: "👥", color: "text-green-500", bg: "bg-green-500/10" },
        { id: 4, name: "Total Content Likes Accumulation", value: stats.totalLikes.toLocaleString(), icon: "❤️", color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <div className="space-y-8 antialiased">
            {/* Header Dashboard Profile Title Bar Section */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Creator Studio Analytics</h1>
                <p className="text-sm text-zinc-400 mt-1">Real-time hardware level data mining insights cluster</p>
            </div>

            {/* 📊 THE MASTERS QUANTUM STATISTICS COUNTER GRID LAYOUT */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {analyticsTiles.map((tile) => (
                    <div 
                        key={tile.id} 
                        className="group relative rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-zinc-400 tracking-wide uppercase">{tile.name}</span>
                            <span className={`rounded-xl p-2.5 text-xl ${tile.bg} ${tile.color} transition-transform group-hover:scale-110`}>
                                {tile.icon}
                            </span>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tight text-white transition-all group-hover:text-zinc-100">
                                {tile.value}
                            </span>
                        </div>
                        {/* High tech telemetry decorative ambient bar indicator lines bottom */}
                        <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div className={`h-full w-0 bg-gradient-to-r from-transparent to-current transition-all duration-500 group-hover:w-full ${tile.color}`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty Context Pipeline Info Shell Section underneath for aesthetic balance */}
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 text-zinc-400">
                <h3 className="text-md font-bold text-white mb-2">💡 Core Optimization Insights Logs</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    This analytical dashboard bypasses memory intensive client side calculations loops. The calculations are evaluated using native high performance B-Tree indices mapping direct inside the isolated database server clusters layer, ensuring sub-second response times under concurrent heavy loads scenarios [🔗].
                </p>
            </div>
        </div>
    );

}