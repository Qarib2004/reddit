import User from "../models/User.js";
import Community from "../models/Community.js";

export const subscribe = async (req, res) => {
  const { communityId } = req.body;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.subscriptions.includes(communityId)) {
      user.subscriptions.push(communityId);
      await user.save();
    }

    res.json({
      message: "You have subscribed to the community",
      subscriptions: user.subscriptions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const unsubscribe = async (req, res) => {
  const { communityId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    user.subscriptions = user.subscriptions.filter(
      (id) => id.toString() !== communityId
    );
    await user.save();

    res.json({
      message: "You have unsubscribed from the community",
      subscriptions: user.subscriptions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
