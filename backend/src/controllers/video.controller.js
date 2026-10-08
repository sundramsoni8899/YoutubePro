import {asyncHandler} from "../utils/asyncHandler.js";

import {ApiResponse} from "../utils/ApiResponse.js";

import {ApiError} from "../utils/ApiError.js";

import {Video} from "../models/video.model.js";

import {uploadOnCloudinary} from "../utils/cloudinary.js";



const publishAVideo = asyncHandler(async(req, res)=>{

    const {title, description}= req.body

    if(!title || title.trim() === "" || !description || description.trim() === ""){
        throw new ApiError(400, "Title and description are required");  
    }

    let videoFileLocalPath;
    if(req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0){

        videoFileLocalPath = req.files.videoFile[0].path;
    }

    let thumbnailLocalPath;
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file is required");
    }
    if(!thumbnailLocalPath){  
        throw new ApiError(400, "Thumbnail image is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile){
        throw new ApiError(500, "Media upload pipeline exception. Video deployment failed.");
    }
    if(!thumbnail) {
        throw new ApiError(500, "Failed to deploy video thumbnail layout to cloud assets.");
    }

    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        title,
        description,
        duration: videoFile.duration,
        views: 0,
        isPublished: true,
        owner: req.user?._id
    })

    const publishedVideo = await Video.findById(video._id).populate("owner", "username fullName avatar")

    if (!publishedVideo) {
        throw new ApiError(500, "Database cluster execution failure during video document registration.");
    }

    return res
    .status(201)
    .json(new ApiResponse(201, publishedVideo, "Video published and hosted successfully!"))
})

export {publishAVideo
}