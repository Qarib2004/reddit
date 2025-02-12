import express from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  updateUser,
  getMe,
  sendForgotPasswordSMS,
  updateUserAvatar,
} from "../controllers/authController.js";
import {  makeModerator } from "../controllers/userController.js";
import passport from "passport";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/checkRole.js";
import { body } from "express-validator";
import { deletePost } from "../controllers/postController.js";
import { getAdminDashboard } from "../controllers/dashboardController.js";
import upload from "../middlewares/uploadMiddleware.js"

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
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Incorrect email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);
router.post("/logout", logout);


router.get("/verify-email", verifyEmail);


router.get("/me", authMiddleware, getMe);
router.put("/update", authMiddleware, updateUser);
router.put("/update-avatar", authMiddleware, upload.single("avatar"), updateUserAvatar);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/login");
    }
    res.cookie("token", req.user.token, { httpOnly: true, secure: false, sameSite: "Strict" });
    res.redirect("http://localhost:5173");
  }
);


router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
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


router.put("/make-moderator/:userId", authMiddleware, checkRole("admin"), makeModerator); 
router.delete("/posts/:id", authMiddleware, checkRole("moderator"), deletePost); 
router.get("/admin", authMiddleware, checkRole("admin"), getAdminDashboard);



router.post("/forgot-password", sendForgotPasswordSMS);

export default router;
