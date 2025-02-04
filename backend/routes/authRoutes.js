import express from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  updateUser,
  getMe,
} from "../controllers/authController.js";
import passport from "passport";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email "),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  register
);
router.get("/me", authMiddleware, getMe);

router.get("/verify-email", verifyEmail);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Incorrect email"),
    body("password").notEmpty().withMessage(" Password is required"),
  ],
  login
);

router.put("/update", authMiddleware, updateUser);

router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login",
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login",
  })
);

router.get("/twitter", passport.authenticate("twitter"));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login",
  })
);

export default router;
