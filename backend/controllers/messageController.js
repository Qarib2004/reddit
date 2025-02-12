import Message from "../models/Message.js";
import User from "../models/User.js";

export const getMessages = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error of receiving messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "The recipient was not found" });
    }

    const newMessage = new Message({ senderId, recipientId, message });
    await newMessage.save();

    res.status(201).json({ message: "The message is sent", newMessage });
  } catch (error) {
    console.error("Message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCounts = await Message.aggregate([
      { $match: { recipientId: userId, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    const unreadMap = {};
    unreadCounts.forEach(({ _id, count }) => {
      unreadMap[_id] = count;
    });

    res.json(unreadMap);
  } catch (error) {
    console.error("Error in obtaining unread messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const recipientId = req.user.id;

    await Message.updateMany(
      { senderId, recipientId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error at the mark of messages as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};
