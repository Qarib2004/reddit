import Community from "../models/Community.js";
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
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (!community.members.includes(req.user.id)) {
      community.members.push(req.user.id);
      await community.save();
    }
    res.json({ message: "You have joined the community", community });
  } catch (error) {
    res.status(500).json(error.message);
  }
};