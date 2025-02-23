import mongoose from "mongoose";

const AwardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  icon: { type: String, required: true },
  description: { type: String }
});

export default mongoose.model("Award", AwardSchema);
