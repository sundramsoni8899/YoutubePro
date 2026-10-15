import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video identity identifier format.");
    }

    
    const commentAggregation = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
       // comment ko upar dikhne ke liye jo new commnet aaye
        {
            $sort: {
                createdAt: -1
            }
        },
       
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "\$ownerDetails"
        },
        
        {
            $project: {
                content: 1,
                createdAt: 1,
                owner: {
                    _id: "\$ownerDetails._id",
                    username: "\$ownerDetails.username",
                    fullName: "\$ownerDetails.fullName",
                    avatar: "\$ownerDetails.avatar"
                }
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10
    };

    const paginatedComments = await Comment.aggregatePaginate(commentAggregation, options);

    return res
        .status(200)
        .json(new ApiResponse(200, paginatedComments, "Video comments timeline feed retrieved successfully."));
});


const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id; 

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Target video identity identifier is invalid.");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty text strings.");
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Target video asset records not found.");
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: userId
    });

    if (!comment) {
        throw new ApiError(500, "Database cluster execution failure during write transaction.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added and published successfully."));
});


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment reference key identifier is invalid.");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Target comment entity records not found.");
    }

    if (comment.owner.toString() !== userId.toString() && Video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized Action. Operation code rejection loop.");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment document eliminated from database node successfully."));
});

export { getVideoComments, addComment, deleteComment };