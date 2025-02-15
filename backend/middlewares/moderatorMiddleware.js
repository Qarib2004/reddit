import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const moderatorMiddleware = async (req, res, next) => {
  console.log("Cookies received:", req.cookies);

  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No access, please log in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "moderator" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Moderators only." });
    }

    req.user = { id: user._id, username: user.username, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token or not authorized", error });
  }
};

export default moderatorMiddleware;
