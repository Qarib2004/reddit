import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reports: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
    ,
    awards: [
      {
        award: { type: mongoose.Schema.Types.ObjectId, ref: "Award" },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);