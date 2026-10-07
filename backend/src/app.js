
import express from 'express';

import cors from 'cors';

import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}))

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use(cookieParser())

app.get('/api/v1/health', (req, res)=>{
    res.status(200).json({
        status: 'active',
        message: "Server is running"
    })
})

export {app}