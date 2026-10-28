import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user?._id; 

    if (!name || name.trim() === "" || !description || description.trim() === "") {
        throw new ApiError(400, "Name and description text parameters are strictly required.");
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        videos: [],
        owner: userId
    });

    if (!playlist) {
        throw new ApiError(500, "Database cluster execution failure during write transaction.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist folder generated and locked successfully."));
});

const getUserPlaylists = asyncHandler(async(req, res)=>{
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid targeted user parameter identifier path matrix.");
    }
    const playlists = await Playlist.find({ owner: userId })
        .sort({ createdAt: -1 }) // Newest playlists on top
        .populate({
            path: "videos",
            select: "title thumbnail duration views createdAt",
            populate: {
                path: "owner",
                select: "username fullName avatar"
            }
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                playlists || [], 
                "User creator channels playlists timeline retrieved successfully!"
            )
        );

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid targeted playlist identifier parameter format.");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: "videos",
            select: "title description thumbnail duration views createdAt",
            populate: {
                path: "owner",
                select: "username fullName avatar"
            }
        });

    if (!playlist) {
        throw new ApiError(404, "Target playlist vault records not found inside clusters.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                playlist, 
                "Specific detailed playlist vault configuration retrieved successfully!"
            )
        );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video unique key identifiers format.");
    }

   
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Target playlist records not found.");
    }
     
    // Koi doosra user kisi aur ki playlist mein zabardasti apni video add na kar de, isliye check karte hain
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized Request. Ownership verification validation failure.");
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Target video asset document not found.");
    }

    //  playlist mein doosri baar add karne ki koshish 
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Target video reference is already present in this playlist folder.");
    }

    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: { videos: videoId } 
        },
        { returnDocument: "after" }
    ).populate("videos", "title description thumbnail videoFile duration views");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video stream added to playlist successfully."));
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Identifiers tracking matrix parameters formats are invalid.");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist data node not found.");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Forbidden Action. Elimination criteria rejected.");
    }

    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId } 
        },
        { returnDocument: "after" }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video reference extracted from playlist folder successfully."));
});



export { createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById, getUserPlaylists };