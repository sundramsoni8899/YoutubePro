import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
    {
        content:{
            type: String,
            required: [true, "Tweet text content string is strictly required"],
            trim: true

        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

tweetSchema.index({owner: 1, createdAt: -1});

export const Tweet = mongoose.model("Tweet", tweetSchema)