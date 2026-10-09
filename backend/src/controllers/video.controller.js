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

const getVideoById = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    if(!videoId?.trim()){
        throw new ApiError(400, "Invalid video identification sequence parametere.")
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc:{views:1}
        },
        {
            returnDocument: "after"
        }
    ).populate("owner", "username fullname avatar")
    if(!video){
        throw new ApiError(404, "Target video does not exist in database cluster.")
    }
     return res
        .status(200)
        .json(new ApiResponse(200, video, "Video insights retrieved and view counter incremented successfully!"));
})

const updateVideoDetails = asyncHandler(async(req, res)=>{
    const {videoId}= req.params;
    const {title, description}= req.body;
    const thumbnailLocalPath= req.file?.path

    if(!videoId?.trim()){
         throw new ApiError(400, "Video target identifier is required.")
    }
     if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At least one attribute (title, description, or thumbnail) is required to perform an update.");
    }

    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
        throw new ApiError(404, "Video document not found.");
    }

    if(existingVideo.owner.toString()!== req.user?._id.toString()){
         throw new ApiError(403, "Unauthorized Action. You do not own this media asset.");
    }

    const updateFields = {};
     if (title && title.trim() !== "") updateFields.title = title;
    if (description && description.trim() !== "") updateFields.description = description;
    if(thumbnailLocalPath){
        const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if(!newThumbnail?.secure_url){
             throw new ApiError(500, "Failed to upload new thumbnail preview file to cloud buckets.");
        }
        updateFields.thumbnail= newThumbnail.secure_url
        
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        },
        {
            returnDocument: "after"
        }
    ).populate("owner", "username, fullName, avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video metadata attributes updated and aligned successfully."))

    

})

const deleteVideo = asyncHandler(async(req, res)=>{
        const {videoId} = req.params
        if(!videoId?.trim()){
             throw new ApiError(400, "Video identifier parameter is invalid.");
        }

         const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Target video asset not found.");
    }
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized Request. Asset elimination rejected.");
    }
    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video record eliminated from database node successfully."));
    })


export {publishAVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo
}