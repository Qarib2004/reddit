import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["deposit", "donation"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
