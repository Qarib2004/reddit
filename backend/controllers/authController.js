import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status.json({ message: "User is exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    return res.status(500).json(error.message);
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
        return res.status(400).json({ message: 'Incorrect credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.json({ message: 'Login completed', user });
    } catch (error) {
      res.status(500).json({ message: 'Error server', error });
    }
  };
  

  export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'The exit is complete' });
  };