import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},    {
    timestamps: true
})

export default mongoose.model('Comment', commentSchema)