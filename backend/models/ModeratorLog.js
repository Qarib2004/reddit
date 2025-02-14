import mongoose from "mongoose";

const ModeratorLogSchema = new mongoose.Schema({
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, enum: ["warning", "ban"], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ModeratorLog", ModeratorLogSchema);
