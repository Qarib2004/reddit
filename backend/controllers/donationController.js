import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const sendDonation = async (req, res) => {
  const { senderId, recipientId, amount } = req.body;

  if (!senderId || !recipientId || amount <= 0) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const sender = await User.findById(senderId);
  const recipient = await User.findById(recipientId);

  if (!sender || !recipient) {
    return res.status(404).json({ message: "User not found" });
  }

  if (sender.coins < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  sender.coins -= amount;
  recipient.coins += amount;

  await sender.save();
  await recipient.save();

  await Transaction.create({ userId: senderId, type: "donation", amount: -amount });
  await Transaction.create({ userId: recipientId, type: "donation", amount });

  res.json({ message: "Donation sent successfully" });
};
