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
app.use("/api/v1/users", userRouter);

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
})
.catch((error)=>{
    console.error("Error connecting to MongoDB:", error)
   
})

