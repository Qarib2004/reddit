import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  dislikePost,
  searchPosts
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import upload from "../middlewares/uploadMiddleware.js"
import  {createComment,getCommentsByPost,deleteComment}  from "../controllers/commentController.js"

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  [
    body("title").notEmpty().withMessage("The title is required"),
    body("postType").isIn(["text", "image", "link"]).withMessage("The unacceptable type of post"),
    body("content")
      .if(body("postType").equals("text"))
      .notEmpty()
      .withMessage("required"),
    body("community").notEmpty().withMessage("required"),
  ],
  createPost
);

router.get("/", getPosts);
router.get("/search/:query", searchPosts);
router.get("/:id", getPost);
router.delete("/:id", authMiddleware, deletePost);

router.post("/:id/upvotes", authMiddleware, likePost); 
router.post("/:id/downvotes", authMiddleware, dislikePost); 


router.post(
  "/",
  authMiddleware,
  [
    body("content").notEmpty().withMessage("Comment cannot be empty"),
    body("post").notEmpty().withMessage("Post ID is required"),
  ],
  createComment
);

router.get("/:postId/comments", getCommentsByPost);

router.delete("/:id", authMiddleware, deleteComment);

export default router;
