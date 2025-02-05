import User from "../models/User.js";


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
