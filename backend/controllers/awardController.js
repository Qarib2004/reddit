import Award from "../models/Award.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const getAwards = async (req, res) => {
  try {
    const awards = await Award.find();
    res.json(awards);
  } catch (error) {
    res.status(500).json({ message: "Error when receiving awards", error });
  }
};

export const sendAward = async (req, res) => {
    try {
      const { awardId, commentId } = req.body;
      const userId = req.user.id;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const award = await Award.findById(awardId);
      if (!award) return res.status(404).json({ message: "Award not found" });
  
      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (user.wallet < award.price) {
        return res.status(400).json({ message: "Not enough coins" });
      }
  
      user.wallet -= award.price;
      
      user.awards.push({ award: award._id, receivedAt: new Date() });
  
      await user.save();
  
      comment.awards.push({ award: award._id, from: userId });
      await comment.save();
  
      res.json({ message: "Award sent successfully!", wallet: user.wallet, userAwards: user.awards });
    } catch (error) {
      res.status(500).json({ message: "Error when sending a reward", error });
    }
  };

export const createAward = async (req, res) => {
  try {
    const { name, icon, price, description } = req.body;

    if (!name || !icon || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const award = new Award({ name, icon, price, description });
    await award.save();

    res.status(201).json({ message: "Award created successfully", award });
  } catch (error) {
    res.status(500).json({ message: "Error in creating a reward", error });
  }
};
