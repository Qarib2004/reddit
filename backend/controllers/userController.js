import User from "../models/User.js";
import Topic from "../models/Topic.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import { sendSMSCode } from "../utils/sms.js"; 
import bcrypt from "bcrypt";



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

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friendRequests", "username avatar");
    res.json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
   

    const sender = await User.findById(requestId);
    const receiver = await User.findById(req.user.id);

    if (!sender || !receiver) {
     
      return res.status(404).json({ message: "User not found" });
    }

    receiver.friends.push(sender._id);
    sender.friends.push(receiver._id);

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());

    await receiver.save();
    await sender.save();

   
    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Mistake when accepting a request for friends:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    

    const user = await User.findById(req.user.id);
    if (!user) {
      
      return res.status(404).json({ message: "User not found" });
    }

    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== req.params.requestId);
    await user.save();

   
    res.json({ message: "Friend request rejected" });
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
    const { excludeSelf, sortBy } = req.query; 

    let query = {};

    
    if (excludeSelf && req.user) {
      query._id = { $ne: req.user.id };
    }

    
    let sortOptions = {};
    if (sortBy === "karma") {
      sortOptions.karma = -1; 
    } else if (sortBy === "createdAt") {
      sortOptions.createdAt = -1; 
    }

   
    const users = await User.find(query, "username avatar karma createdAt")
      .sort(sortOptions)
      .lean(); 

    res.json(users);
  } catch (error) {
    console.error("Error when receiving users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "friends",
        select: "username avatar karma createdAt",
        options: { sort: sortBy === "username" ? { username: 1 } : { createdAt: -1 } }, 
      })
      .lean(); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.friends);
  } catch (error) {
    console.error("Error when receiving friends:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const requestPasswordChange = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendSMSCode(phoneNumber, resetCode);
    res.json({ message: "Reset code sent to your phone" });
  } catch (error) {
    res.status(500).json({ message: "Error sending SMS", error });
  }
};


export const changePassword = async (req, res) => {
  

  try {
    const { phoneNumber, resetCode, newPassword } = req.body;

    if (!phoneNumber || !resetCode || !newPassword) {
      console.error("Error: Not all fields are filled!");
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      console.error("Error: The user is not found!");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetCode !== resetCode || user.resetCodeExpires < Date.now()) {
      console.error("Error: incorrect or expired code!");
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Error changing password", error });
  }
};



export const updatePersonalization = async (req, res) => {
  try {
    const { theme, fontSize, showTrending } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.theme = theme || user.theme;
    user.fontSize = fontSize || user.fontSize;
    user.showTrending = showTrending !== undefined ? showTrending : user.showTrending;

    await user.save();
    res.json({ message: "Personalization updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating personalization", error });
  }
};




export const getUserSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("subscriptions");
    res.json(user.subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriptions", error });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error });
  }
};


export const requestModeratorRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.moderatorRequests === "pending") {
      return res.status(400).json({ message: "You already have a pending request" });
    }

    user.moderatorRequests = "pending";
    await user.save();

    res.json({ message: "Request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getModeratorRequests = async (req, res) => {
  try {
    const requests = await User.find({ moderatorRequests: "pending" }).select("username email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateModeratorRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (status === "approved") {
      user.role = "moderator";
      user.moderatorRequests = "approved";
    } else {
      user.moderatorRequests = "rejected";
    }

    await user.save();
    res.json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body; 

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const banUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

    user.banned = !user.banned;
    user.banUntil = user.banned ? banUntil : null;
    await user.save();

    res.json({ message: `User ${user.banned ? "banned" : "unbanned"} until ${banUntil || "∞"}`, banUntil });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ message: "Server error" });
  }
};