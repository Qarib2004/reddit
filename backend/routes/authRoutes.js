import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username required"),
    body("email").isEmail().withMessage("Email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Incorrect email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/logout", logout);

export default router;
