import React, {useEffect, useState } from 'react';

import { useParams, useNavigate, Link  } from 'react-router-dom';

import apiClient from '../api/apiClient.js';

import { useAuth } from '../context/AuthContext.jsx';

import {formatDistanceToNow} from '../utils/formatDistanceToNow.js';

export default function ChannelProfile() {
    const {username} = useParams();
    const {user: loggedInUser, logoutGlobalContextSession  }    =   useAuth();

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [activeTab, setActiveTab] = useState('videos');

    const [newTweet, setNewTweet] = useState('');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const isOwnProfile = loggedInUser?.username === username;

    const fetchChannelData = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await apiClient.get(`/users/c/${username}`);
            if(res?.data){
                setProfile(res.data);
                fetchChannelVideos(res.data._id);
                fetchChannelTweets(res.data._id);

            }
        } catch (err) {
            setError(err?.message || "Channel profile not found.");
        } finally {
            setLoading(false);
        }
    }

    const fetchChannelVideos = async (channelId) => {
        try {
            const res = await apiClient.get(`/videos/channel/${channelId}&limit=50`);
            if(res?.data?.docs) setVideos(res.data.docs);
        } catch (err) {
            console.error("Error loading channel videos:", err);
        }
    }
    const fetchChannelTweets = async (channelId) => {
        try {
            const res = await apiClient.get(`/tweets/user/${channelId}`);
            if (res?.data) setTweets(res.data);
        } catch (err) {
            console.error("Error loading channel tweets:", err);
        }
    };

    useEffect(() => {
        if (username) fetchChannelData();
    }, [username]);

    const handleToggleSubscribe = async()=>{
        if(!profile?._id) return;
        try {
            const prevSub = profile.isSubscribed;
            setProfile((prev) => ({
                ...prev,
                isSubscribed: !prevSub,
                subscribersCount: prevSub ? prev.subscribersCount - 1 : prev.subscribersCount + 1
            }));
            await apiClient.post(`/subscriptions/c/${profile._id}`);
        } catch (err) {
            fetchChannelData(); // Rollback on failure
        }
    }

    const handlePostTweet = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;
        try {
            setTweetLoading(true);
            const res = await apiClient.post("/tweets", { content: newTweet.trim() });
            if (res?.data) {
                setNewTweet("");
                fetchChannelTweets(profile._id);
            }
        } catch (err) {
            alert(err?.message || "Failed to post community update.");
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-red-600"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-8 text-center text-zinc-400">
                 {error || "Channel does not exist."}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10 antialiased">
            {/*  1. COVER IMAGE BANNER */}
            <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 sm:h-56">
                {profile.coverImage ? (
                    <img src={profile.coverImage} alt="Cover Banner" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-xs font-bold uppercase tracking-widest text-zinc-600">
                        YouTube PRO Creator Banner
                    </div>
                )}
            </div>


            {/*  2. AVATAR, STATS & ACTION BAR */}
            <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 px-2 pb-6 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="-mt-12 h-24 w-24 rounded-full border-4 border-[#0f0f0f] bg-zinc-900 object-cover shadow-xl sm:-mt-16 sm:h-28 sm:w-28"
                    />
                    <div>
                        <h1 className="text-2xl font-black text-white sm:text-3xl">{profile.fullName}</h1>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-400">
                            <span>@{profile.username}</span>
                            <span>•</span>
                            <span className="text-white">{profile.subscribersCount || 0} subscribers</span>
                            <span>•</span>
                            <span>{profile.channelsSubscribedToCount || 0} subscribed</span>
                        </div>
                        {isOwnProfile && (
                            <p className="mt-1 text-xs text-zinc-500"> {loggedInUser?.email}</p>
                        )}
                    </div>
                </div>


                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">
                    {isOwnProfile ? (
                        <>
                            <Link
                                to="/studio"
                                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-700"
                            >
                                 Manage Studio
                            </Link>
                            <button
                                onClick={logoutGlobalContextSession}
                                className="rounded-xl border border-red-500/30 bg-red-600/10 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-600 hover:text-white"
                            >
                                 Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleToggleSubscribe}
                            className={`rounded-xl px-5 py-2.5 text-xs font-black transition active:scale-95 ${
                                profile.isSubscribed
                                    ? "border border-zinc-700 bg-zinc-800 text-zinc-300"
                                    : "bg-white text-black hover:bg-zinc-200"
                            }`}
                        >
                            {profile.isSubscribed ? "✓ Subscribed" : "🔔 Subscribe"}
                        </button>
                    )}
                </div>
            </div>


            {/*  3. NAVIGATION TABS (VIDEOS vs COMMUNITY TWEETS) */}
            <div className="flex gap-6 border-b border-zinc-800 px-2 text-sm font-bold">
                <button
                    onClick={() => setActiveTab("videos")}
                    className={`border-b-2 pb-3 transition ${
                        activeTab === "videos" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                     Videos ({videos.length})
                </button>
                <button
                    onClick={() => setActiveTab("tweets")}
                    className={`border-b-2 pb-3 transition ${
                        activeTab === "tweets" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                     Community Posts ({tweets.length})
                </button>
            </div>



            {/*  TAB A: UPLOADED VIDEOS GRID */}
            {activeTab === "videos" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {videos.length === 0 ? (
                        <p className="col-span-full py-12 text-center text-xs font-bold uppercase tracking-widest text-zinc-600">
                            No videos uploaded on this channel yet.
                        </p>
                    ) : (
                        videos.map((vid) => (
                            <div
                                key={vid._id}
                                onClick={() => navigate(`/video/${vid._id}`)}
                                className="group cursor-pointer space-y-2"
                            >
                                <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                                    <img
                                        src={vid.thumbnail}
                                        alt={vid.title}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        {parseFloat(vid.duration || 0).toFixed(0)}s
                                    </span>
                                </div>
                                <h3 className="line-clamp-2 text-sm font-bold text-white group-hover:text-zinc-300">
                                    {vid.title}
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    {vid.views || 0} views • {formatDistanceToNow(vid.createdAt)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/*  TAB B: COMMUNITY TWEETS FEED */}
            {activeTab === "tweets" && (
                <div className="mx-auto max-w-2xl space-y-6">
                    {isOwnProfile && (
                        <form onSubmit={handlePostTweet} className="space-y-3 rounded-2xl border border-zinc-800 bg-[#161616] p-4">
                            <textarea
                                rows="3"
                                value={newTweet}
                                onChange={(e) => setNewTweet(e.target.value)}
                                placeholder="Share a community update with your subscribers..."
                                className="w-full resize-none rounded-xl border border-zinc-800 bg-[#0f0f0f] p-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={tweetLoading || !newTweet.trim()}
                                    className="rounded-xl bg-white px-5 py-2 text-xs font-black text-black transition hover:bg-zinc-200 disabled:opacity-40"
                                >
                                    {setLoading ? "Posting..." : "Publish Post"}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {tweets.length === 0 ? (
                            <p className="py-10 text-center text-xs font-bold uppercase tracking-widest text-zinc-600">
                                No community posts published yet.
                            </p>
                        ) : (
                            tweets.map((tw) => (
                                <div key={tw._id} className="space-y-2 rounded-2xl border border-zinc-800 bg-[#161616] p-5">
                                    <div className="flex items-center gap-3">
                                        <img src={profile.avatar} alt={profile.fullName} className="h-9 w-9 rounded-full object-cover" />
                                        <div>
                                            <h4 className="text-xs font-bold text-white">{profile.fullName}</h4>
                                            <span className="text-[11px] text-zinc-500">{formatDistanceToNow(tw.createdAt)}</span>
                                        </div>
                                    </div>
                                    <p className="whitespace-pre-line text-sm text-zinc-200">{tw.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}