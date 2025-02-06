import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true }, 
  topics: [TopicSchema], 
});

export default mongoose.model("Category", CategorySchema);
