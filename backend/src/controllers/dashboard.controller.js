import mongoose from "mongoose"

import { Video } from "../models/video.model.js"

import { Subscription } from "../models/subscription.model.js"

import { Like } from "../models/like.model.js"

import { ApiError } from "../utils/ApiError.js"

import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;
    const videoStats = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group:{
                _id: null,
                totalViews: {$sum: "$views"},
                totalVideos:{$sum:1}

            }
        }
    ])

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })

    const totalLikes= await Like.aggregate([
        {
            $lookup:{
                from: "videos",
                localField:"video",
                foreignField:"_id",
                as:"videoInfo"
            }
        },
        {
            $unwind: "$videoInfo"
        },
        {
            $match:{
                "videoInfo.owner": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group:{
                _id: null,
                count: {$sum :1}
            }
        }
    ])

    const channelStats = {
        totalVideos: videoStats[0]?.totalVideos || 0,

        totalViews: videoStats[0]?.totalViews || 0,

        totalSubscribers: totalSubscribers || 0,

        totalLikes : totalLikes[0]?.count || 0
    }
     return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                channelStats, 
                "Creator studio channel profile matrix analytics compiled successfully!"
            )
        );
})

export {getChannelStats}