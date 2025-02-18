import Community from "../models/Community.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Topic from "../models/Topic.js";
import { validationResult } from "express-validator";



export const createCommunity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description,type, categories = [], topics = [] } = req.body;

  try {
  

    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Such a community already exists" });
    }

    console.log("Validating categories...");
    const validCategories = categories.length
      ? await Category.find({ _id: { $in: categories } })
      : [];

    
    const validTopics = topics.length
      ? await Topic.find({ _id: { $in: topics } })
      : [];

   

    const community = new Community({
      name,
      description,
      type,
      creator: req.user.id,
      members: [req.user.id],
      categories: validCategories.map((cat) => cat._id),
      topics: validTopics.map((topic) => topic._id),
    });

    await community.save();

    res.status(201).json({ message: "Community created", community });
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("creator", "username")
      .populate("categories", "title icon") 
      .populate("topics", "name");

    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("creator", "username")
      .populate("members", "_id username")
      .populate("joinRequests", "_id username");;
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    console.log("Full Community Object from DB:", community);
    console.log("Community Type:", community.type);
    res.json(community);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


export const joinCommunity = async (req, res) => {
  try {
   
    const { id } = req.params; 
    const userId = req.user.id;
    console.log(`Community ID: ${id}, User ID: ${userId}`);

   
    const community = await Community.findById(id);
    if (!community) {
      console.warn(`Community with ID ${id} not found`);
      return res.status(404).json({ message: "Community not found" });
    }

  
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    
    const isMember = community.members.includes(userId);
    console.log(`User is already a member: ${isMember}`);
    if (isMember) {
      console.warn(`User ${userId} is already a member of community ${id}`);
      return res.status(400).json({ message: "Already a member" });
    }

   
    community.members.push(userId);
    await community.save();

    
    user.subscriptions.push(community._id);
    await user.save();

    console.log(`User ${userId} successfully joined community ${id}`);
    res.status(200).json({ 
      message: "Joined community successfully", 
      community: community._id,
      subscriptions: user.subscriptions,
      members: community.members,
    });

  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id; 
   

    const community = await Community.findById(id);
    if (!community) {
      console.warn(` Community ${id} not found`);
      return res.status(404).json({ message: "Community not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn(` User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const isMember = community.members.includes(userId);
    if (!isMember) {
      console.warn(` User ${userId} is not a member of Community ${id}`);
      return res.status(400).json({ message: "You are not a member of this community" });
    }

    community.members = community.members.filter((member) => member.toString() !== userId);
    await community.save();

   
    user.subscriptions = user.subscriptions.filter((sub) => sub.toString() !== id);
    await user.save();

   
    res.status(200).json({
      message: "Left community successfully",
      community: community._id,
      subscriptions: user.subscriptions,
    });
  } catch (error) {
    console.error(" Error leaving community:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const requestToJoinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id) {
      return res.status(400).json({ message: "Community ID is required" });
    }

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.type !== "Private") {
      return res.status(400).json({ message: "This community is not private" });
    }

    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member" });
    }

    if (community.joinRequests?.includes(userId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    community.joinRequests.push(userId);
    await community.save();

    res.status(200).json({ message: "Join request sent", joinRequests: community.joinRequests });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


  


export const getJoinRequests = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id;

    const community = await Community.findById(communityId).populate("joinRequests", "username email");
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() !== userId) {
      return res.status(403).json({ message: "Only the creator can view requests." });
    }

    res.status(200).json(community.joinRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const approveJoinRequest = async (req, res) => {
  try {
    const { communityId, userId } = req.params;
    const ownerId = req.user.id;

    const community = await Community.findById(communityId).populate("members", "_id username");
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() !== ownerId) {
      return res.status(403).json({ message: "Only the creator can approve requests." });
    }

    if (!community.joinRequests.includes(userId)) {
      return res.status(400).json({ message: "No request from this user." });
    }

    community.members.push(userId);
    community.joinRequests = community.joinRequests.filter(id => id.toString() !== userId);
    await community.save();

    res.status(200).json({ 
      message: "User added to the community.", 
      members: community.members 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const rejectJoinRequest = async (req, res) => {
  try {
    const { communityId, userId } = req.params;
    const ownerId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() !== ownerId) {
      return res.status(403).json({ message: "Only the creator can reject requests." });
    }

    community.joinRequests = community.joinRequests.filter(id => id.toString() !== userId);
    await community.save();

    res.status(200).json({ message: "Join request rejected." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};