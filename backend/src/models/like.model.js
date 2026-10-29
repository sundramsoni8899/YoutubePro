import mongoose from "mongoose"

const likeSchema = new mongoose.Schema(
    {
        video:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        },
        comment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
         tweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet" 
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true
        }
    },
    {
        timestamps: true
    }
)

likeSchema.index(
    { video: 1, likedBy: 1 }, 
    { unique: true, partialFilterExpression: { video: { $exists: true, $ne: null } } }
);

likeSchema.index(
    { comment: 1, likedBy: 1 }, 
    { unique: true, partialFilterExpression: { comment: { $exists: true, $ne: null } } }
);

likeSchema.index(
    { tweet: 1, likedBy: 1 }, 
    { unique: true, partialFilterExpression: { tweet: { $exists: true, $ne: null } } }
);

export const Like = mongoose.model("Like", likeSchema);