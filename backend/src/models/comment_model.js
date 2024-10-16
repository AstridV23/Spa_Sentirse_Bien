import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    default: 'Anónimo'
  }
}, { _id: false });

const replySchema = new mongoose.Schema({
  author: authorSchema,
  content: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const commentSchema = new mongoose.Schema({
  author: authorSchema,
  content: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reply: replySchema
}, {
  timestamps: true
});

export default mongoose.model('Comment', commentSchema);