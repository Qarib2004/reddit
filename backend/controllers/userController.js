import User from "../models/User.js";
import Topic from "../models/Topic.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

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

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedPosts.includes(postId);

    if (alreadySaved) {
    
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
     
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      message: alreadySaved ? "Post removed from saved" : "Post saved",
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(userId);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    if (receiver.friendRequests.includes(sender._id))
      return res.status(400).json({ message: "Request already sent" });

    receiver.friendRequests.push(sender._id);
    await receiver.save();

    res.json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const sender = await User.findById(userId);
    const receiver = await User.findById(req.user.id);

    if (!sender || !receiver) return res.status(404).json({ message: "User not found" });

    receiver.friends.push(sender._id);
    sender.friends.push(receiver._id);

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getUserNotifications = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendRequests = user.friendRequests.length;
    const unreadMessages = await Message.countDocuments({
      recipientId: userId,
      read: false, 
    });

    

    res.json({ friendRequests, unreadMessages });
  } catch (error) {
    console.error("An error of receipt of notifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUsers = async (req, res) => {
  try {
   

    const users = await User.find({}, "username avatar karma createdAt");

   
    res.json(users);
  } catch (error) {
    console.error("Error when receiving users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
