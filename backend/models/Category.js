import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true }, 
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic", 
    },
  ],
});

export default mongoose.model("Category", CategorySchema);
