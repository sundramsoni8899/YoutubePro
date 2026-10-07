import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password} = req.body
    if([fullName, email, username, password].some((field)=>field?.trim() === "" || field === undefined))
    {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne(
        {
            $or:[
            {email},
            {username}
        ]}
    )
    if(existedUser)
    {
        throw new ApiError(400, "User with email or username already exists");
    }
    const dummyAvatar = `https://dicebar.com/${username}`
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: dummyAvatar
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser)
    {
        throw new ApiError(500, "Failed to create user");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});


const loginUser = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body
    if(!username && !email){
        throw new ApiError(400, "Username or email is required for login")
    }
    if(!password){
        throw new ApiError(400,"password is missing")
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new ApiError(404, "User accounnt does not exist with given credentials")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid access credentials entered")
    }
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV==="production",
        sameSite:"strict"
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User authentication successful! Session locked."
            )
        );
})


const logoutUser = asyncHandler(async(req, res)=>{
    const token = req.cookies?.accessToken

    if(!token){
        throw new ApiError(401, "Unauthorized access request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "FALLBACK ACESS SECRET")

    await User.findByIdAndUpdate(
        decodedToken._id,
        {
            $unset: {
                refreshToken: 1 // Removes the field entirely from the database document
            }
        },
        { returnDocument: "after" }
    );

const cookieOptions ={
    httpOnly: true,
    secure: process.env.NODE_ENV==="production",
    sameSite: "Strict"
}
return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User session logged out successfully! Cleared."));

})

export { registerUser, loginUser,logoutUser };