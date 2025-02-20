import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/email.js";
import { sendSMSCode } from "../utils/sms.js";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js";
dotenv.config();
import * as faceapi from "face-api.js";
 

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await user.save();

    const emailToken = jwt.sign(
      { id: user._id },
      process.env.EMAIL_SECRET,
      { expiresIn: "1d" }
    );

    await sendVerificationEmail(user, emailToken);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(201).json({ message: "User registered. Check your email to confirm email.", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });
    res.json({ message: "Login completed", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

export const verifyEmail = async (req, res) => {
  try {
   

    const { token } = req.query;
    if (!token) {
      console.log("No token provided.");
      return res.status(400).json({ message: "Missing verification token" });
    }

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
   

    const user = await User.findById(decoded.id);
    if (!user) {
     
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

   
    res.json({ message: "Email successfully verified" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error confirming email", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, selectedTopics,avatar,bio, country, timezone,phoneNumber,faceId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (selectedTopics) user.selectedTopics = selectedTopics;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;
    if (country) user.country = country;
    if (timezone) user.timezone = timezone;
    if(phoneNumber) user.phoneNumber = phoneNumber;
    if(faceId) user.faceId = faceId;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};


export const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    });

    user.avatar = result.secure_url;
    await user.save();

    res.json({ message: "Avatar updated", avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: "Error updating avatar", error });
  }
};


export const sendForgotPasswordSMS = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendSMSCode(phoneNumber, resetCode);
    res.json({ message: "Reset code sent to your phone" });
  } catch (error) {
    res.status(500).json({ message: "Error sending SMS", error });
  }
};



const euclideanDistance = (face1, face2) => {
  return Math.sqrt(face1.reduce((sum, val, i) => sum + Math.pow(val - face2[i], 2), 0));
};

export const registerFaceId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { faceId } = req.body;

   

    if (!faceId || !Array.isArray(faceId)) {
      return res.status(400).json({ message: "Invalid face ID data" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { faceId: faceId.map(Number) }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Face ID registered successfully" });
  } catch (error) {
    console.error("Face ID registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginWithFaceId = async (req, res) => {
  try {
    const { faceId } = req.body;
    if (!faceId || !Array.isArray(faceId)) {
      return res.status(400).json({ message: "Invalid face ID data" });
    }

    const users = await User.find({ faceId: { $exists: true, $ne: null } });
    console.log("🔍 Найдено пользователей с Face ID:", users.length);

    let bestMatch = null;
    let bestDistance = Infinity;

    users.forEach((user) => {
      if (!user.faceId) return;

      const distance = euclideanDistance(faceId, user.faceId);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = user;
      }
    });

    if (!bestMatch || bestDistance > 0.75) {
      return res.status(401).json({ message: "Face not recognized" });
    }


    const token = jwt.sign({ id: bestMatch._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ success: true, user: bestMatch });
  } catch (error) {
    console.error("Face ID authorization error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

