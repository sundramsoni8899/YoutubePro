import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import cookieParser from "cookie-parser";

import { app } from "./app.js";

import connectDB from "./config/db.js";

dotenv.config({
    path: "./.env"
});

import userRouter from "./routes/user.routes.js";

import videoRouter from "./routes/video.routes.js";

import subscriptionRouter from "./routes/subscription.routes.js"

import likeRouter from "./routes/like.routes.js"

import commentRouter from "./routes/comment.routes.js";

import playlistRouter from "./routes/playlist.routes.js";


app.use("/api/v1/users", userRouter);

app.use("/api/v1/videos", videoRouter);

app.use("/api/v1/subscriptions", subscriptionRouter)

app.use("/api/v1/likes", likeRouter)

app.use("/api/v1/comments", commentRouter);

app.use("/api/v1/playlists", playlistRouter);

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
})
.catch((error)=>{
    console.error("Error connecting to MongoDB:", error)
   
})

