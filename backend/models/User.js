import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
    },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    karma: {
      type: Number,
      default: 0,
    },
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    selectedTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    avatar: {
      type: String, 
      default: "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    banned: {
      type: Boolean,
      default: false, 
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
      required:false
    },
    country: {
      type: String,
      default: "",
      trim: true,
      required:false

    },
    timezone: {
      type: String,
      default: "UTC",
      required:false

    },
    phoneNumber: { type: String, unique: true, sparse: true },
    resetCode: { type: String, default: null },
  resetCodeExpires: { type: Date, default: null },
  theme: { type: String, enum: ["light", "dark", "custom"], default: "light" },
  fontSize: { type: Number, default: 16 },
  showTrending: { type: Boolean, default: true },
  moderatorRequests: {
    type: String,
    enum: ["pending", "approved", "rejected", "none"],
    default: "none",
  },
  hiddenPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  lessLikedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  
  
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
