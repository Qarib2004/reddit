import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/email.js";
import { sendSMSCode } from "../utils/sms.js";
import dotenv from "dotenv";
dotenv.config();

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
    const emailToken = jwt.sign({ id: user._id }, process.env.EMAIL_SECRET, { expiresIn: "1d" });
    await sendVerificationEmail(user,emailToken);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Strict" });
    res.json({ message: "Login completed", user });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "The exit is complete" });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
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
    res.status(500).json({ message: "Error confirming email", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
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