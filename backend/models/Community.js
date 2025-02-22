import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Public", "Restricted", "Private", "Mature (18+)"], 
      required: true,
      default: "Public",
    },
    isPrivate: {
      type: Boolean,
      default: function () {
        return this.type === "Private";
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    joinRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    rules: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    avatar: {
      type: String,
      default: "https://whop.com/blog/content/images/2024/08/Discord-vs-Reddit-for-Building-a-Community.webp",
    },
    banner: {
      type: String,
      default: "https://default-community-banner.com/banner.png",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Community", CommunitySchema);
