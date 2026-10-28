// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import apiClient from "../api/apiClient";
// import { formatDistanceToNow } from "../utils/formatDistanceToNow";
// import { useAuth } from "../context/AuthContext";



// export default function VideoDetail() {
//     const { videoId } = useParams(); // URL path parameters analysis tracker keys
//     const { user: loggedInUser } = useAuth(); // Global session snapshot context hook

//     // 1. Core data arrays and transaction state slots memory allocation
//     const [video, setVideo] = useState(null);
//     const [comments, setComments] = useState([]);
//     const [newCommentText, setNewCommentText] = useState("");
    
//     const [videoLoading, setVideoLoading] = useState(true);
//     const [commentLoading, setCommentLoading] = useState(false);
//     const [error, setError] = useState("");



// const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
// const [userPlaylists, setUserPlaylists] = useState([]);
// const [addingLoading, setAddingLoading] = useState(false);

//     // 📡 PIPELINE A: SINGLE VIDEO RECORD METADATA EXTRACTION PIPELINE
//     const fetchTargetVideoDetailsPipeline = async () => {
//         try {
//             setVideoLoading(true);
//             setError("");
//             // Hits GET /api/v1/videos/:videoId to compile calculations fields
//             const response = await apiClient.get(`/videos/${videoId}`);
//             if (response?.data) {
//                 setVideo(response.data);
//             }
//         } catch (err) {
//             setError(err?.message || "Failed to establish single video content stream configurations mapping keys.");
//         } finally {
//             setVideoLoading(false);
//         }
//     };

//     // 📡 PIPELINE B: FETCH CHROMATIC VIDEO COMMENTS FEEDS TIMELINE
//     const loadVideoCommentsTimelineFeed = async () => {
//         try {
//             // Scrapes paginated data arrays directly out of GET /api/v1/comments/v/:videoId
//             const response = await apiClient.get(`/comments/v/${videoId}?page=1&limit=100`);
//             if (response?.data?.docs) {
//                 setComments(response.data.docs);
//             }
//         } catch (err) {
//             console.error("❌ [FRONTEND CHRONO COMMENTS COMPILATION CRASH LOG]:", err);
//         }
//     };



// const fetchPlaylistsForModal = async () => {
//     if (!loggedInUser?._id) {
//         alert("Please login first to manage playlists!");
//         return;
//     }
//     try {
//         const response = await apiClient.get(`/playlists/user/${loggedInUser._id}`);
//         if (response?.data) {
//             setUserPlaylists(response.data);
//             setIsAddToPlaylistOpen(true);
//         }
//     } catch (err) {
//         alert("Failed to load user playlists vault.");
//     }
// };

//     // Synchronize multi-tier data lookup operations concurrently when component mounts
//     useEffect(() => {
//         if (videoId) {
//             fetchTargetVideoDetailsPipeline();
//             loadVideoCommentsTimelineFeed();
//             fetchPlaylistsForModal()
//         }
//     }, [videoId]);

//     // 🚀 ACTION TRIGGER 1: SAVE AND ADD FRESH TEXT COMMENT TO CURRENT VIDEO DOCUMENT
//     const handleCommentSubmission = async (e) => {
//         e.preventDefault();
//         if (!newCommentText.trim()) return;

//         try {
//             setCommentLoading(true);
//             const response = await apiClient.post(`/comments/v/${videoId}`, {
//                 content: newCommentText.trim()
//             });
//             if (response?.data) {
//                 setNewCommentText(""); // Flush input component textarea content blocks values 
//                 loadVideoCommentsTimelineFeed(); // Instantly re-hydrate client rendering cache lists cleanly
//             }
//         } catch (err) {
//             alert(err?.message || "Discussion board data write block execution intercept error loops.");
//         } finally {
//             setCommentLoading(false);
//         }
//     };

//     // 🚀 ACTION TRIGGER 2: DELETE AND ERASE AN AUTHENTICATED CONTROLLED COMMENT CELL
//     const handleCommentDeletion = async (commentId) => {
//         if (!window.confirm("Are you strictly sure you want to permanently eliminate this comment node entry?")) return;

//         try {
//             // Hits backend controller pipeline DELETE /api/v1/comments/c/:commentId
//             const response = await apiClient.delete(`/comments/c/${commentId}`);
//             if (response?.success) {
//                 loadVideoCommentsTimelineFeed(); // Synchronize UI array items after hard deletion confirmation checks
//             }
//         } catch (err) {
//             alert(err?.message || "Unauthorized action. Operation destroyed at network boundary limits.");
//         }
//     };

    
// const handleAddToPlaylist = async (playlistId) => {
//     try {
//         setAddingLoading(true);
        
//         const response = await apiClient.patch(`/playlists/add/${playlistId}/${videoId}`);
//         if (response?.success || response?.data) {
//             alert("✅ Video successfully added to the playlist vault!");
//             setIsAddToPlaylistOpen(false);
//         }
//     } catch (err) {
//         alert(err?.response?.data?.message || err?.message || "Error adding video to playlist.");
//     } finally {
//         setAddingLoading(false);
//     }
// };

//     if (videoLoading) {
//         return (
//             <div className="flex h-[60vh] items-center justify-center bg-[#0f0f0f]">
//                 <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
//             </div>
//         );
//     }




//     if (error || !video) {
//         return (
//             <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-[#161616] p-8 text-center text-zinc-400 my-6">
//                 <span className="text-3xl block mb-2">⚠️</span>
//                 {error || "Target video metadata reference indices could not be resolved crossing database nodes."}
//                 <div className="mt-4">
//                     <Link to="/home" className="text-xs font-bold text-red-500 hover:underline">◀ Return to Home Feeds</Link>
//                 </div>
//             </div>
//         );
//     }

//         return (
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 px-1 py-2 sm:px-4 text-[#f1f1f1] antialiased select-text">
            
//             {/* 📺 MAIN STREAM WINDOW LAYOUT CELL PANELS GRID CONTAINER (LEFT TIERS) */}
//             <div className="space-y-4 lg:col-span-2">
                
//                 {/* ADVANCED HTML5 CONTROLS INTEGRATED VIDEO LAYER WRAPPER */}
//                 <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl aspect-video w-full group">
//                     <video 
//                         src={video.videoFile} 
//                         controls 
//                         autoPlay
//                         className="h-full w-full object-contain focus:outline-none"
//                         poster={video.thumbnail} // Temporary canvas visual cover before streaming chunks buffer initialize
//                     />
//                 </div>

//                 {/* VIDEO METADATA DESCRIPTIVE INFORMATION SETS */}
//                 <div className="space-y-4 px-1">
//                     <h1 className="text-xl font-black text-white leading-snug sm:text-2xl tracking-tight">
//                         {video.title}
//                     </h1>
                    
//                     {/* View counters indices and timestamps timers formatting row indicators */}
//                     <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">
//                         <div className="flex items-center">
//                             <span className="text-white font-black">{video.views || 0}</span>
//                             <span className="ml-1 font-medium text-zinc-500">views</span>
//                             <span className="mx-2 text-zinc-700 font-extrabold">•</span>
//                             <span className="text-zinc-400 font-medium normal-case">{formatDistanceToNow(video.createdAt)}</span>
//                         </div>
//                     </div>

//                     {/* CHANNEL PROFILE INTERCONNECT HANDSHAKE BRAND BAR ACTION ROW */}
//                     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 shadow-md">
//                         <div className="flex items-center gap-3">
//                             <img 
//                                 src={video.owner?.avatar || "https://cloudinary.com"} 
//                                 alt={video.owner?.fullName || "Creator"} 
//                                 className="h-12 w-12 rounded-full object-cover border border-zinc-700 shadow-inner" 
//                             />
//                             <div>
//                                 <h3 className="text-sm font-black text-white transition-all hover:text-zinc-200 cursor-pointer">
//                                     {video.owner?.fullName}
//                                 </h3>
//                                 <p className="text-xs font-semibold text-zinc-500 tracking-wide">
//                                     @{video.owner?.username || "channel_node"}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Interactive Handshake Action Triggers Button Wrapper */}
//                         <div className="flex items-center gap-3 self-end sm:self-center">
//                             <button className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-red-600/10 transition-all duration-200 active:scale-95 hover:bg-red-700">
//                                 Subscribe Channel
//                             </button>

                            
//                             <button 
//                                 onClick={fetchPlaylistsForModal}
//                                 className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-black text-white shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5 border border-zinc-700"
//                                 >
//                                 <span>💾 Save to Playlist</span>
//                             </button>
//                         </div>
//                     </div>

//                     {/* DETAILED DESCRIPTION MARKDOWN LONG TEXT PERSISTENCE PLATFORM WRAPPER */}
//                     <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 text-sm leading-relaxed text-zinc-300 font-medium shadow-inner transition-all hover:border-zinc-700">
//                         <div className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-900 pb-1.5">Description Assets Data Log</div>
//                         <p className="whitespace-pre-line text-zinc-300 break-words font-normal">
//                             {video.description}
//                         </p>
//                     </div>

//                 </div>
//             </div>

//             {/* 💬 MULTI-STAGE COMPOSITE DISCUSSION TIMELINE FEED LAYOUT BOARDS CONTAINER (RIGHT TIERS) */}
//             <div className="flex flex-col space-y-4 lg:col-span-1 rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-2xl max-h-[85vh] transition-all hover:border-zinc-700">
                
//                 {/* Header Metrics Title Counters Box */}
//                 <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
//                     <h3 className="text-md font-black text-white tracking-tight flex items-center gap-2">
//                         <span>💬 Discussion Pipeline Board</span>
//                     </h3>
//                     <span className="rounded-xl bg-zinc-900 px-3 py-1 text-xs font-black text-zinc-400 border border-zinc-800 tracking-wider shadow-inner">
//                         {comments.length} entries
//                     </span>
//                 </div>

//                 {/* ADD NEW FRESH COMMENT ITERACTION TEXTAREA STATE INJECTION CONTAINER */}
//                 <form onSubmit={handleCommentSubmission} className="flex flex-col gap-2 pt-1 group">
//                     <textarea 
//                         rows="2"
//                         value={newCommentText}
//                         onChange={(e) => setNewCommentText(e.target.value)}
//                         placeholder="Add your system validation expression argument text strings..."
//                         className="w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-3 text-xs text-white placeholder-zinc-600 shadow-inner outline-none transition-all duration-300 focus:border-zinc-500 resize-none font-medium"
//                     />
//                     <button 
//                         type="submit"
//                         disabled={commentLoading || !newCommentText.trim()}
//                         className="self-end rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-black transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:active:scale-100 shadow-md hover:bg-zinc-200"
//                     >
//                         {commentLoading ? "Publishing Bit Strings..." : "Post Expression"}
//                     </button>
//                 </form>

//                 {/* CHRONOLOGICAL RENDER FEED CHANNELS MATRIX LAYOUT SECTIONS */}
//                 <div className="flex-1 overflow-y-auto space-y-4 pr-1 divide-y divide-zinc-900 scrollbar-thin">
//                     {comments.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600 gap-2">
//                             <span className="text-3xl">📭</span>
//                             <p className="text-xs font-bold uppercase tracking-widest">No conversation logs trace found.</p>
//                             <p className="text-[11px] text-zinc-500 font-normal max-w-xxs px-2">Be the first core engineer to emit a data chunk string expression on this media thread!</p>
//                         </div>
//                     ) : (
//                         comments.map((comment) => (
//                             <div key={comment._id} className="group flex gap-3 pt-3 first:pt-0 pb-1 animate-fadeIn">
//                                 <img 
//                                     src={comment.owner?.avatar || "https://cloudinary.com"} 
//                                     alt={comment.owner?.fullName || "User"} 
//                                     className="h-8 w-8 rounded-full object-cover border border-zinc-800 shadow-md" 
//                                 />
//                                 <div className="flex-1 space-y-1">
//                                     <div className="flex items-center justify-between text-[11px] font-semibold">
//                                         <span className="font-extrabold text-zinc-300 hover:text-white transition-colors cursor-pointer">
//                                             {comment.owner?.fullName}
//                                         </span>
//                                         <span className="text-zinc-500 text-[10px] font-normal tracking-tight">
//                                             {formatDistanceToNow(comment.createdAt)}
//                                         </span>
//                                     </div>
//                                     <p className="text-xs font-medium text-zinc-300 leading-relaxed break-all font-normal pr-1">
//                                         {comment.content}
//                                     </p>
                                    
//                                     {/* STRICT IDENTITY VERIFICATION SECURITY SHUNT FILTER */}
//                                     {/* Only render delete control button if user token parameters id matches row owner */}
//                                     {loggedInUser?._id === comment.owner?._id && (
//                                         <button 
//                                             onClick={() => handleCommentDeletion(comment._id)}
//                                             className="text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 hover:text-red-500 pt-1 flex items-center gap-1 uppercase tracking-wider"
//                                         >
//                                             ✕ Eliminate Entry Node
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))

//                     )}
//                 </div>
//             </div>
        




// ein) paste kijiye:

// jsx
// {/* 🛡️ SELECT PLAYLIST MODAL POPUP */}
// {isAddToPlaylistOpen && (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fadeIn">
//         <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl space-y-4">
//             <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
//                 <h3 className="text-md font-black text-white">Save Video to Playlist</h3>
//                 <button 
//                     onClick={() => setIsAddToPlaylistOpen(false)} 
//                     className="text-zinc-400 hover:text-white font-bold text-xs"
//                 >
//                     ✕ Close
//                 </button>
//             </div>

//             <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
//                 {userPlaylists.length === 0 ? (
//                     <p className="text-xs text-zinc-500 text-center py-4">No playlists found. Create one in the Playlists Vault first!</p>
//                 ) : (
//                     userPlaylists.map((pl) => (
//                         <button
//                             key={pl._id}
//                             disabled={addingLoading}
//                             onClick={() => handleAddToPlaylist(pl._id)}
//                             className="w-full text-left rounded-xl border border-zinc-800 bg-[#0f0f0f] p-3 hover:border-zinc-600 transition-all flex items-center justify-between group"
//                         >
//                             <div>
//                                 <h4 className="text-xs font-extrabold text-white group-hover:text-red-500 transition-colors">
//                                     📁 {pl.name}
//                                 </h4>
//                                 <span className="text-[10px] text-zinc-500">
//                                     {pl.videos?.length || 0} clips linked
//                                 </span>
//                             </div>
//                             <span className="text-xs font-black text-zinc-400 group-hover:text-white">+ Add</span>
//                         </button>
//                     ))
//                 )}
//             </div>
//         </div>
//     </div>
// )}        
                    

// }



import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../api/apiClient.js";
import { formatDistanceToNow } from "../utils/formatDistanceToNow.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function VideoDetail() {
    const { videoId } = useParams(); 
    const { user: loggedInUser } = useAuth(); 

    // 1. Core data arrays and transaction state slots memory allocation
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    
    const [videoLoading, setVideoLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [error, setError] = useState("");

    const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [addingLoading, setAddingLoading] = useState(false);

    // 📡 PIPELINE A: SINGLE VIDEO RECORD METADATA EXTRACTION PIPELINE
    const fetchTargetVideoDetailsPipeline = async () => {
        try {
            setVideoLoading(true);
            setError("");
            const response = await apiClient.get(`/videos/${videoId}`);
            if (response?.data) {
                setVideo(response.data);
            }
        } catch (err) {
            setError(err?.message || "Failed to establish single video content stream configurations mapping keys.");
        } finally {
            setVideoLoading(false);
        }
    };

    // 📡 PIPELINE B: FETCH CHROMATIC VIDEO COMMENTS FEEDS TIMELINE
    const loadVideoCommentsTimelineFeed = async () => {
        try {
            const response = await apiClient.get(`/comments/v/${videoId}?page=1&limit=100`);
            if (response?.data?.docs) {
                setComments(response.data.docs);
            }
        } catch (err) {
            console.error("❌ [FRONTEND CHRONO COMMENTS COMPILATION CRASH LOG]:", err);
        }
    };

    const fetchPlaylistsForModal = async () => {
        if (!loggedInUser?._id) {
            alert("Please login first to manage playlists!");
            return;
        }
        try {
            const response = await apiClient.get(`/playlists/user/${loggedInUser._id}`);
            if (response?.data) {
                setUserPlaylists(response.data);
                setIsAddToPlaylistOpen(true);
            }
        } catch (err) {
            alert("Failed to load user playlists vault.");
        }
    };

    // Synchronize multi-tier data lookup operations concurrently when component mounts
    useEffect(() => {
        if (videoId) {
            fetchTargetVideoDetailsPipeline();
            loadVideoCommentsTimelineFeed();
        }
    }, [videoId]);

    // 🚀 ACTION TRIGGER 1: SAVE AND ADD FRESH TEXT COMMENT TO CURRENT VIDEO DOCUMENT
    const handleCommentSubmission = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            setCommentLoading(true);
            const response = await apiClient.post(`/comments/v/${videoId}`, {
                content: newCommentText.trim()
            });
            if (response?.data) {
                setNewCommentText(""); 
                loadVideoCommentsTimelineFeed(); 
            }
        } catch (err) {
            alert(err?.message || "Discussion board data write block execution intercept error loops.");
        } finally {
            setCommentLoading(false);
        }
    };

    // 🚀 ACTION TRIGGER 2: DELETE AND ERASE AN AUTHENTICATED CONTROLLED COMMENT CELL
    const handleCommentDeletion = async (commentId) => {
        if (!window.confirm("Are you strictly sure you want to permanently eliminate this comment node entry?")) return;

        try {
            const response = await apiClient.delete(`/comments/c/${commentId}`);
            if (response?.success) {
                loadVideoCommentsTimelineFeed(); 
            }
        } catch (err) {
            alert(err?.message || "Unauthorized action. Operation destroyed at network boundary limits.");
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            setAddingLoading(true);
            const response = await apiClient.patch(`/playlists/add/${playlistId}/${videoId}`);
            if (response?.success || response?.data) {
                alert("✅ Video successfully added to the playlist vault!");
                setIsAddToPlaylistOpen(false);
            }
        } catch (err) {
            alert(err?.response?.data?.message || err?.message || "Error adding video to playlist.");
        } finally {
            setAddingLoading(false);
        }
    };

    if (videoLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center bg-[#0f0f0f]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-[#161616] p-8 text-center text-zinc-400 my-6">
                <span className="text-3xl block mb-2">⚠️</span>
                {error || "Target video metadata reference indices could not be resolved crossing database nodes."}
                <div className="mt-4">
                    <Link to="/home" className="text-xs font-bold text-red-500 hover:underline">◀ Return to Home Feeds</Link>
                </div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 px-1 py-2 sm:px-4 text-[#f1f1f1] antialiased select-text relative">
            
            {/* 📺 MAIN STREAM WINDOW LAYOUT CELL PANELS GRID CONTAINER (LEFT TIERS) */}
            <div className="space-y-4 lg:col-span-2">
                
                {/* ADVANCED HTML5 CONTROLS INTEGRATED VIDEO LAYER WRAPPER */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl aspect-video w-full group">
                    <video 
                        src={video.videoFile} 
                        controls 
                        autoPlay
                        className="h-full w-full object-contain focus:outline-none"
                        poster={video.thumbnail} 
                    />
                </div>
                {/* VIDEO METADATA DESCRIPTIVE INFORMATION SETS */}
                <div className="space-y-4 px-1">
                    <h1 className="text-xl font-black text-white leading-snug sm:text-2xl tracking-tight">
                        {video.title}
                    </h1>
                    
                    {/* View counters indices and timestamps timers formatting row indicators */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <div className="flex items-center">
                            <span className="text-white font-black">{video.views || 0}</span>
                            <span className="ml-1 font-medium text-zinc-500">views</span>
                            <span className="mx-2 text-zinc-700 font-extrabold">•</span>
                            <span className="text-zinc-400 font-medium normal-case">{formatDistanceToNow(video.createdAt)}</span>
                        </div>
                    </div>

                    {/* CHANNEL PROFILE INTERCONNECT HANDSHAKE BRAND BAR ACTION ROW */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 shadow-md">
                        <div className="flex items-center gap-3">
                            <img 
                                src={video.owner?.avatar || "https://unsplash.com"} 
                                alt={video.owner?.fullName || "Creator"} 
                                className="h-12 w-12 rounded-full object-cover border border-zinc-700 shadow-inner" 
                            />
                            <div>
                                <h3 className="text-sm font-black text-white transition-all hover:text-zinc-200 cursor-pointer">
                                    {video.owner?.fullName}
                                </h3>
                                <p className="text-xs font-semibold text-zinc-500 tracking-wide">
                                    @{video.owner?.username || "channel_node"}
                                </p>
                            </div>
                        </div>

                        {/* Interactive Handshake Action Triggers Button Wrapper */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                            <button className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-red-600/10 transition-all duration-200 active:scale-95 hover:bg-red-700">
                                Subscribe Channel
                            </button>

                            <button 
                                onClick={fetchPlaylistsForModal}
                                className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-black text-white shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5 border border-zinc-700"
                            >
                                <span>💾 Save to Playlist</span>
                            </button>
                        </div>
                    </div>
                    {/* DETAILED DESCRIPTION MARKDOWN LONG TEXT PERSISTENCE PLATFORM WRAPPER */}
                    <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-5 text-sm leading-relaxed text-zinc-300 font-medium shadow-inner transition-all hover:border-zinc-700">
                        <div className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-900 pb-1.5">Description Assets Data Log</div>
                        <p className="whitespace-pre-line text-zinc-300 break-words font-normal">
                            {video.description}
                        </p>
                    </div>

                </div>
            </div>
            {/* 💬 MULTI-STAGE COMPOSITE DISCUSSION TIMELINE FEED LAYOUT BOARDS CONTAINER (RIGHT TIERS) */}
            <div className="flex flex-col space-y-4 lg:col-span-1 rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-2xl max-h-[85vh] transition-all hover:border-zinc-700">
                
                {/* Header Metrics Title Counters Box */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="text-md font-black text-white tracking-tight flex items-center gap-2">
                        <span>💬 Discussion Pipeline Board</span>
                    </h3>
                    <span className="rounded-xl bg-zinc-900 px-3 py-1 text-xs font-black text-zinc-400 border border-zinc-800 tracking-wider shadow-inner">
                        {comments.length} entries
                    </span>
                </div>

                {/* ADD NEW FRESH COMMENT ITERACTION TEXTAREA STATE INJECTION CONTAINER */}
                <form onSubmit={handleCommentSubmission} className="flex flex-col gap-2 pt-1 group">
                    <textarea 
                        rows="2"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Add your system validation expression argument text strings..."
                        className="w-full rounded-xl border border-zinc-800 bg-[#0f0f0f] px-4 py-3 text-xs text-white placeholder-zinc-600 shadow-inner outline-none transition-all duration-300 focus:border-zinc-500 resize-none font-medium"
                    />
                    <button 
                        type="submit"
                        disabled={commentLoading || !newCommentText.trim()}
                        className="self-end rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-black transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:active:scale-100 shadow-md hover:bg-zinc-200"
                    >
                        {commentLoading ? "Publishing Bit Strings..." : "Post Expression"}
                    </button>
                </form>

                {/* CHRONOLOGICAL RENDER FEED CHANNELS MATRIX LAYOUT SECTIONS */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 divide-y divide-zinc-900 scrollbar-thin">
                    {comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600 gap-2">
                            <span className="text-3xl">📭</span>
                            <p className="text-xs font-bold uppercase tracking-widest">No conversation logs trace found.</p>
                            <p className="text-[11px] text-zinc-500 font-normal max-w-xxs px-2">Be the first core engineer to emit a data chunk string expression on this media thread!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="group flex gap-3 pt-3 first:pt-0 pb-1 animate-fadeIn">
                                <img 
                                    src={comment.owner?.avatar || "https://unsplash.com"} 
                                    alt={comment.owner?.fullName || "User"} 
                                    className="h-8 w-8 rounded-full object-cover border border-zinc-800 shadow-md" 
                                />
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-semibold">
                                        <span className="font-extrabold text-zinc-300 hover:text-white transition-colors cursor-pointer">
                                            {comment.owner?.fullName}
                                        </span>
                                        <span className="text-zinc-500 text-[10px] font-normal tracking-tight">
                                            {formatDistanceToNow(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-zinc-300 leading-relaxed break-all font-normal pr-1">
                                        {comment.content}
                                    </p>
                                    
                                    {/* STRICT IDENTITY VERIFICATION SECURITY SHUNT FILTER */}
                                    {loggedInUser?._id === comment.owner?._id && (
                                        <button 
                                            onClick={() => handleCommentDeletion(comment._id)}
                                            className="text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 hover:text-red-500 pt-1 flex items-center gap-1 uppercase tracking-wider"
                                        >
                                            ✕ Eliminate Entry Node
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* 🛡️ SELECT PLAYLIST MODAL POPUP */}
            {isAddToPlaylistOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                            <h3 className="text-md font-black text-white">Save Video to Playlist</h3>
                            <button 
                                onClick={() => setIsAddToPlaylistOpen(false)} 
                                className="text-zinc-400 hover:text-white font-bold text-xs"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                            {userPlaylists.length === 0 ? (
                                <p className="text-xs text-zinc-500 text-center py-4">No playlists found. Create one in the Playlists Vault first!</p>
                            ) : (
                                userPlaylists.map((pl) => (
                                    <button
                                        key={pl._id}
                                        disabled={addingLoading}
                                        onClick={() => handleAddToPlaylist(pl._id)}
                                        className="w-full text-left rounded-xl border border-zinc-800 bg-[#0f0f0f] p-3 hover:border-zinc-600 transition-all flex items-center justify-between group"
                                    >
                                        <div>
                                            <h4 className="text-xs font-extrabold text-white group-hover:text-red-500 transition-colors">
                                                📁 {pl.name}
                                            </h4>
                                            <span className="text-[10px] text-zinc-500">
                                                {pl.videos?.length || 0} clips linked
                                            </span>
                                        </div>
                                        <span className="text-xs font-black text-zinc-400 group-hover:text-white">+ Add</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}        

        </div>
    );
}
