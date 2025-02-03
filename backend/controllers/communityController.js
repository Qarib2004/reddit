import Community from "../models/Community.js";
import { validationResult } from "express-validator";

export const createCommunity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description } = req.body;

  try {
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res
        .status(400)
        .json({ message: "Such a community already exists" });
    }

    const community = new Community({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id],
    });
    await community.save();
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate("creator", "username");
    res.json(communities);
  } catch (error) {
    res.status(500).json(error.message);
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
