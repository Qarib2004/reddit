import express from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  dislikeComment,
  likeComment
} from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  [
    body("content").notEmpty().withMessage("Comment cannot be empty"),
    body("post").notEmpty().withMessage("Post ID is required"),
  ],
  createComment
);

router.get("/post/:postId", getCommentsByPost);

router.delete("/:id", authMiddleware, deleteComment);

router.post("/:id/upvotes", authMiddleware, likeComment);


router.post("/:id/downvotes", authMiddleware, dislikeComment);

export default router;
