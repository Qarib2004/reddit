import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model("Topic", TopicSchema);
