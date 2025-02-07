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
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
