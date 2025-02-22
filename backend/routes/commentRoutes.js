import express from "express";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  dislikeComment,
  likeComment,
  replyToComment,
  likeReply,
  dislikeReply,
  reportComment,
  updateComment,
  getCommentById
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

router.post(
  "/:parentId/reply",
  authMiddleware,
  [body("content").notEmpty().withMessage("Comment cannot be empty")],
  replyToComment
);

router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);
router.get("/post/:postId", getCommentsByPost);
router.get("/:id", getCommentById);


router.post("/:id/upvotes", authMiddleware, likeComment);


router.post("/:id/downvotes", authMiddleware, dislikeComment);

router.post("/:id/reply/upvotes", authMiddleware, likeReply);
router.post("/:id/reply/downvotes", authMiddleware, dislikeReply);

router.post("/report/:id", authMiddleware, reportComment);

export default router;
