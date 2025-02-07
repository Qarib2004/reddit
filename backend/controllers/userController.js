import User from "../models/User.js";
import Topic from "../models/Topic.js";

export const makeModerator = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "moderator";
    await user.save();

    res.json({ message: `${user.username} moderator!` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const selectTopics = async (req, res) => {
  try {
    const { topics } = req.body;
    const userId = req.user.id; 

    if (!topics || topics.length !== 7) {
      return res
        .status(400)
        .json({ message: "You must select exactly 7 topics." });
    }

    
    const validTopics = await Topic.find({ _id: { $in: topics } });

    if (validTopics.length !== 7) {
      return res
        .status(400)
        .json({ message: "One or more topics are invalid." });
    }

    
    await User.findByIdAndUpdate(userId, { selectedTopics: topics });

    res.status(200).json({ message: "Topics selected successfully!" });
  } catch (error) {
    console.error("Error selecting topics:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
