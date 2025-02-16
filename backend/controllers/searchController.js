import Post from "../models/Post.js";
import Community from "../models/Community.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }).populate("author", "username").limit(10);

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const searchCommunities = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const communities = await Community.find({
      name: { $regex: q, $options: "i" },
    }).limit(10);

    res.json(communities);
  } catch (error) {
    console.error("Error searching communities:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const searchComments = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const comments = await Comment.find({
      content: { $regex: q, $options: "i" },
    }).populate("author", "username").populate("post", "title").limit(10);

    res.json(comments);
  } catch (error) {
    console.error("Error searching comments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const users = await User.find({
      username: { $regex: q, $options: "i" },
    }).select("username avatar").limit(10);

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
