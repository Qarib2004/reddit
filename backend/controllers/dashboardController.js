import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Community from "../models/Community.js";

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: req.user.id }).countDocuments();
    const comments = await Comment.find({
      author: req.user.id,
    }).countDocuments();
    const subscriptions = await Community.find({
      _id: { $in: user.subscriptions },
    });

    res.json({
      user,
      stats: {
        posts,
        comments,
        subscriptions: subscriptions.length,
      },
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
