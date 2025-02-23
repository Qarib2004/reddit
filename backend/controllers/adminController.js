import User from "../models/User.js";
import Community from "../models/Community.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const banUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { duration } = req.body; 
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (duration === -1) {
        user.banned = false;
        user.banUntil = null;
      } else {
        user.banned = true;
        const banDate = new Date();
        banDate.setDate(banDate.getDate() + duration);
        user.banUntil = banDate;
      }
  
      await user.save();
      res.status(200).json({
        message: duration === -1 ? "User unbanned successfully" : `User banned for ${duration} days`,
        user,
      });
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
      res.status(500).json({ message: "Error banning user", error });
    }
  };

export const updateUserRole = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
        res.json({ message: "The role of the user is updated" });
    } catch (error) {
        res.status(500).json({ message: "Role update error" });
    }
};

export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCommunity = async (req, res) => {
    try {
        await Community.findByIdAndDelete(req.params.id);
        res.json({ message: "The community is deleted" });
    } catch (error) {
        res.status(500).json({ message: "Merchant when removing community" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "The post is removed" });
    } catch (error) {
        res.status(500).json({ message: "Error when deleting a post" });
    }
};

export const getAdminStats = async (req, res) => {
    try {
  
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const totalComments = await Comment.countDocuments();
      const totalCommunities = await Community.countDocuments();
  
     
  
      res.json({ totalUsers, totalPosts, totalComments, totalCommunities });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  