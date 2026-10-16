import mongoose, {isValidObjectId} from "mongoose"

import { Tweet } from "../models/tweet.model.js"

import { ApiError } from "../utils/ApiError.js"

import { asyncHandler } from "../utils/asyncHandler.js"

import { ApiResponse } from "../utils/ApiResponse.js"

const createTweet = asyncHandler(async(req, res)=>{

    const {content} = req.body;
    const userId = req.user?._id;

    if(!content || content.trim()===""){
        throw new ApiError(400, "Tweet text content stream cannot be empty spaces.")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: userId
    });

    if(!tweet){
        throw new ApiError(500, "Database cluster execution failure during write transaction.");
    }

     return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Community tab tweet published successfully."));


})

const getUserTweets = asyncHandler(async(req, res)=>{
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid targeted user profile reference identifier.");
    }

    const tweets = await Tweet.find({owner: userId})
    .sort({createdAt: -1})
    .populate("owner", "username fullName avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, tweets || [], "User creator tweets timeline retrieved successfully."));
})

const updateTweet = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params
    const {content}= req.body;
    const userId = req.user?._id;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet reference key parameter format is invalid.");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Updated content text string is mandatory.");
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Target tweet record document not found.");
    }

    if(tweet.owner.toString()!== userId.toString()){
        throw new ApiError(403, "Unauthorized Request. Modification operations rejected.");
    
    }
    const updatedTweet= await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {content: content.trim()}
        }, 
        {returnDocument: "after"}
    ).populate("owner", "username fullName avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet description attributes modified successfully."));
})

const deleteTweet = asyncHandler(async(req, res)=>{
    const { tweetId} = req.params;
    const userId= req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet data lookup reference paths.");
    }

    const tweet= await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Target tweet entity records not found.")
    }

    if(tweet.owner.toString()!== userId.toString()){
        throw new ApiError(403, "Unauthorized Action. Destruction validation loop drop.");

    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet document eliminated from database node successfully."));
})

export { 
    createTweet, 
    getUserTweets, 
    updateTweet, 
    deleteTweet 
}
