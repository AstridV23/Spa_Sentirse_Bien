import mongoose from "mongoose";
import { string } from "zod";

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

export default mongoose.model('Comment', commentSchema);