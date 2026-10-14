import mongoose, { isValidObjectId } from "mongoose";

import { Like } from "../models/like.model.js";

import { Video } from "../models/video.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async(req, res)=>{
    const {videoId} = req.params;
    const userId = req.user?._id;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid target video identity identifier format.");
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Target video asset records not found.");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Successfully removed the like from the target video."));
    } else {
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId
        });

        if (!newLike) {
            throw new ApiError(500, "Database cluster execution failure during write transaction.");
        }

        return res
            .status(201)
            .json(new ApiResponse(201, { isLiked: true }, "Successfully liked the target video. Session locked."));
    }
});

export { toggleVideoLike };
