
import express from 'express';

import cors from 'cors';

import cookieParser from 'cookie-parser';

import {rateLimit} from "express-rate-limit"

import helmet from "helmet"

const app = express()

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))

const globalRateLimiter = rateLimit({
    windowMs: 15*60*1000,
    limit:100,
    message:{
        statusCode: 429,
        success: false,
        message: "Too many automated configuration request hits detected from this origin. Threat alert. Access blocked for 15 minutes."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})
app.use(globalRateLimiter)




app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({limit: '10mb', extended: true}))

app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import videoRouter from "./routes/video.routes.js";
app.use("/api/v1/videos", videoRouter);
app.get('/api/v1/health', (req, res)=>{
    res.status(200).json({
        status: 'active',
        message: "Server is running"
    })
})

export {app}