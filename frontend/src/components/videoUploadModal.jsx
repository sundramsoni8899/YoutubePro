import React, {useState} from "react";

import apiClient from "../api/apiClient.js";

export default function VideoUploadModal({isOpen, onClose, onUploadSuccess}){
    const [title, setTitle] = useState("")

    const [description, setDescription] = useState("")

    const [videoFile, setVideoFile] = useState(null)

    const [thumbnail, setThumbnail] = useState(null)

    const [uploadProgress, setUploadProgress] = useState(0)

    const [submitLoading, setSubmitLoading] = useState(false)

    const [error, setError] = useState("")

    if(!isOpen) return null

    const handleVideoPublishExecution = async(e)=>{
        e.preventDefault()
        setError("")

        setSubmitLoading(true)
        setUploadProgress(0)

        if(!title.trim() || !description.trim() || !videoFile || !thumbnail){
            setError("All metadata fields, video stream clips, and image previews are mandatory.");

            setSubmitLoading(false)

            return


        }

        try{
            const multipartPayload = new FormData()
            multipartPayload.append("title", title.trim())

            multipartPayload.append("description", description.trim())

            multipartPayload.append("videoFile", videoFile)

            multipartPayload.append("thumbnail", thumbnail)

            const response = await apiClient.post("/videos/publish", multipartPayload, {
                
                onUploadProgress: (progressEvent) => {
                    const percentageCompiled = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentageCompiled); 
                }
            })

            if(response?.success){
                setTitle("")
                setDescription("")
                setVideoFile(null)
                setThumbnail(null)
                onUploadSuccess()
                onClose()
            }
        } catch(err){
            setError(err?.message || "Media ingestion gateway collapsed. Check upload stream sizes parameters constraint limits.");
        } finally {
            setSubmitLoading(false);
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm antialiased animate-fadeIn">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl sm:p-8 transition-all">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold text-white">Upload Media Pipeline</h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all text-sm font-bold">✕ Close</button>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleVideoPublishExecution}>
                    {error && (
                        <div className="rounded-xl bg-red-900/30 p-3 border border-red-500/40 text-xs font-medium text-red-400">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Video Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500" placeholder="e.g., Building MERN Backend From Scratch" />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</label>
                            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 resize-none" placeholder="Enter deep full stack architecture layout details..."></textarea>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Select Video (MP4 Source)</label>
                                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="mt-1 block w-full text-xs text-zinc-400 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-700" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Banner Thumbnail (Image)</label>
                                <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="mt-1 block w-full text-xs text-zinc-400 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-700" />
                            </div>
                        </div>
                    </div>

                    {/*  THE LIVE TRACKING PROGRESS GRAPH INTERFACE COMPONENT */}
                    {submitLoading && (
                        <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs font-bold text-zinc-400">
                                <span>Deploying bits data packets streams to cloud...</span>
                                <span className="text-white tracking-widest">{uploadProgress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div style={{ width: `${uploadProgress}%` }} className="h-full bg-red-600 transition-all duration-200 ease-out rounded-full shadow-lg shadow-red-500/50"></div>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <button type="submit" disabled={submitLoading} className="flex w-full justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-zinc-200">
                            {submitLoading ? "Uploading Data Arrays Modules..." : "Publish Content Live"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}