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
      .populate("members", "username");
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
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
      subscriptions: user.subscriptions
    });

  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
