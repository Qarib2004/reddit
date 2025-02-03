import express from "express";
import { votePost, voteComment } from "../controllers/voteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/post",
  authMiddleware,
  [
    body("postId").notEmpty().withMessage("Post ID is required"),
    body("voteType")
      .isIn(["upvote", "downvote"])
      .withMessage("Incorrect voting type"),
  ],
  votePost
);

router.post(
  "/comment",
  authMiddleware,
  [
    body("commentId").notEmpty().withMessage("Comment ID is required"),
    body("voteType")
      .isIn(["upvote", "downvote"])
      .withMessage("Incorrect voting type"),
  ],
  voteComment
);

export default router;
