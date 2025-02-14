import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const hashUserId = (userId) => {
  return crypto.createHash("sha256").update(userId).digest("hex");
};

const moderatorMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No access, please log in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "moderator") {
      return res.status(403).json({ message: "Access denied. Moderators only." });
    }

    if (user.banned) {
      return res.status(403).json({ message: "Your account has been banned." });
    }

    req.user = {
      id: hashUserId(user._id.toString()),
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token or not authorized", error });
  }
};

export default moderatorMiddleware;
