import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:{
        type:[{type:mongoose.Schema.Types.ObjectId, 
        ref:"Video"}],
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    },
}, {
    timestamps:true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return
    
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
       
    } catch(error){
        throw error
    }
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET || "fallback_access_secret", 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
    }
)
    }

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,   
    },
    process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret",
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
    }
)
}

export const User = mongoose.model("User", userSchema);
