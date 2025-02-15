import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: function () {
        return this.postType === "text"; 
      },
      default: "",
    },
    postType: {
      type: String,
      enum: ["text", "image", "link"],
      required: true,
    },
    mediaUrl: {
      type: String, 
      default: "", 
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reports: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    showFewerByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
