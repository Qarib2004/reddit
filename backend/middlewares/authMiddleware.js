import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No access, please log in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "uncorect токен" });
  }
};

export default authMiddleware;

export const checkBanStatus = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.banned && user.banUntil && new Date() < new Date(user.banUntil)) {
    return res.status(403).json({ message: "Your account is banned until " + user.banUntil });
  }

  next();
};
