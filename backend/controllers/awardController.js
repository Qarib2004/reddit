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
    console.log("Request received:", req.body);

    const { awardId, commentId, receiverId } = req.body;
    const senderId = req.user.id;

    console.log(`Sender ID: ${senderId}, Receiver ID: ${receiverId}, Award ID: ${awardId}, Comment ID: ${commentId}`);

    const sender = await User.findById(senderId);
    if (!sender) {
      console.log("Sender not found");
      return res.status(404).json({ message: "Sender not found" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      console.log("Receiver not found");
      return res.status(404).json({ message: "Receiver not found" });
    }

    const award = await Award.findById(awardId);
    if (!award) {
      console.log("Award not found");
      return res.status(404).json({ message: "Award not found" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.log("Comment not found");
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log(`Sender wallet before transaction: ${sender.wallet}`);
    if (sender.wallet < award.price) {
      console.log("Not enough coins");
      return res.status(400).json({ message: "Not enough coins" });
    }

    // Списываем цену награды у отправителя
    sender.wallet -= award.price;

    console.log(`Sender wallet after transaction: ${sender.wallet}`);

    // Добавляем награду отправителю (если нужно)
    sender.awards.push({ award: award._id, sentAt: new Date(), to: receiverId });

    console.log("Sender awards updated:", sender.awards);

    // Добавляем награду получателю
    receiver.awards.push({ award: award._id, receivedAt: new Date(), from: senderId });

    console.log("Receiver awards updated:", receiver.awards);

    await sender.save();
    await receiver.save();

    console.log("Sender and receiver saved successfully");

    // Добавляем награду в комментарий
    comment.awards.push({ award: award._id, from: senderId, to: receiverId });
    await comment.save();

    console.log("Comment updated with new award");

    res.json({
      message: "Award sent successfully!",
      senderWallet: sender.wallet,
      senderAwards: sender.awards,
      receiverAwards: receiver.awards
    });

    console.log("Response sent successfully");

  } catch (error) {
    console.error("Error when sending a reward:", error);
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
