import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import ModeratorLog from "../models/ModeratorLog.js";
import ModeratorChat from "../models/ModeratorChat.js";
import { validationResult } from "express-validator";

export const getReportedPosts = async (req, res) => {
  try {

    const reportedPosts = await Post.find({ reports: { $exists: true, $ne: [] } })
      .populate("author", "username")
      .populate("community", "name")
      .populate("reports.userId", "username");


   

    res.json(reportedPosts);
  } catch (error) {
    console.error("Error fetching reported posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const takeActionOnPost = async (req, res) => {
    try {
      const { action } = req.body;
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      if (action === "delete") {
        await post.deleteOne();
        return res.json({ message: "Post deleted" });
      }
  
      post.reported = false;
      await post.save();
      res.json({ message: "Report dismissed" });
    } catch (error) {
      res.status(500).json({ message: "Error processing report", error });
    }
  };

  

  export const getReportedComments = async (req, res) => {
    try {
  
      const reportedComments = await Comment.find({ reports: { $exists: true, $not: { $size: 0 } } })
        .populate("author", "username avatar")
        .populate("post", "title");
  
      
      res.json(reportedComments);
    } catch (error) {
      console.error("Error fetching reported comments:", error);
      res.status(500).json({ message: "Error fetching reported comments", error });
    }
  };
  

  


  export const takeActionOnComment = async (req, res) => {
    try {
      const { action } = req.body;
      const comment = await Comment.findById(req.params.id);
  
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (action === "delete") {
        await comment.deleteOne();
        return res.json({ message: "Comment deleted" });
      }
  
      comment.reported = false;
      await comment.save();
      res.json({ message: "Report dismissed" });
    } catch (error) {
      res.status(500).json({ message: "Error processing report", error });
    }
  };

  



export const getModeratorStats = async (req, res) => {
  try {
    const totalWarnings = await ModeratorLog.countDocuments({ action: "warning" });
    const totalBannedUsers = await User.countDocuments({ banned: true });
    const totalModeratorActions = await ModeratorLog.countDocuments();

    res.json({ totalWarnings, totalBannedUsers, totalModeratorActions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching moderator stats", error });
  }
};

export const getModeratorHistory = async (req, res) => {
  try {
    const history = await ModeratorLog.find().populate("moderator", "username").sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching moderator history", error });
  }
};

export const undoModeratorAction = async (req, res) => {
  try {
    const { id } = req.params;
    const action = await ModeratorLog.findById(id);
    
    if (!action) return res.status(404).json({ message: "Action not found" });

    if (action.action === "warning") {
      await User.findByIdAndUpdate(action.user, { $pull: { warnings: action._id } });
    } else if (action.action === "ban") {
      await User.findByIdAndUpdate(action.user, { banned: false });
    }

    await ModeratorLog.findByIdAndDelete(id);
    res.json({ message: "Moderator action undone successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error undoing action", error });
  }
};

export const getModeratorChat = async (req, res) => {
  try {
    const chat = await ModeratorChat.find().sort({ createdAt: -1 }).limit(50);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat messages", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = new ModeratorChat({ text, author: req.user.id });

    await message.save();
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

export const getUsersWithWarnings = async (req, res) => {
  try {
    const users = await User.find({ warnings: { $exists: true, $not: { $size: 0 } } }).select("username warnings");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users with warnings", error });
  }
};

export const issueWarning = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const log = new ModeratorLog({ moderator: req.user.id, user: userId, action: "warning" });
    await log.save();

    user.warnings.push(log._id);
    await user.save();

    res.json({ message: "Warning issued successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error issuing warning", error });
  }
};
