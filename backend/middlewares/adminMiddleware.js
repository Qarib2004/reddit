import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  
  console.log("Cookies received:", req.cookies);
  const token = req.cookies?.token; 

  if (!token) {
    return res.status(403).json({ message: "Access denied: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    console.log("User authenticated:", req.user);

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    console.log("Admin access granted!");
    next();
  } catch (error) {
    console.log("Invalid token, sending 403 Forbidden");
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default adminMiddleware;
