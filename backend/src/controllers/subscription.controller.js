import mongoose, {isValidObjectId} from "mongoose";

import {User} from "../models/user.model.js"

import {Subscription} from "../models/subscription.model.js"

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async(req, res)=>{
    const {channelId} = req.params;
    const subscriberId = req.user?._id;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid target creator channel identity identifier foramt.")
    }

    if(channelId.toString()=== subscriberId.toString()){
         throw new ApiError(400, "Self-Subscription Conflict Exception. You cannot subscribe to your own channel.");
    }

    const channelExits = await User.findById(channelId);
    if(!channelExits){
        throw new ApiError(404, "Target creator channel entity records not found.");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isSubscribed: false }, "Successfully unsubscribed from the target creator channel."));
    } else {
     
        const newSubscription = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });

        if (!newSubscription) {
            throw new ApiError(500, "Database cluster execution failure loops inside write transaction.");
        }

        return res
            .status(201)
            .json(new ApiResponse(201, { isSubscribed: true }, "Successfully subscribed to the target creator channel. Session locked."));
    }
    
})

export { toggleSubscription };
