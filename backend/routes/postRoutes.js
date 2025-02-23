import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  dislikePost,
  searchPosts,
  reportPost,
  hidePost,
  showFewerPosts,
  updatePost,
  getSubscribedPosts
} from "../controllers/postController.js";
import authMiddleware, { checkBanStatus } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import upload from "../middlewares/uploadMiddleware.js"
import  {createComment,getCommentsByPost,deleteComment}  from "../controllers/commentController.js"
import { searchPostsByTag } from "../controllers/searchController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,checkBanStatus,
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
router.get("/tags/:tag", searchPostsByTag);
 


router.delete("/:id", authMiddleware, deletePost);

router.post("/:id/upvotes", authMiddleware, likePost); 
router.post("/:id/downvotes", authMiddleware, dislikePost); 

router.put("/report/:postId", authMiddleware, reportPost);
router.put("/hide/:postId", authMiddleware, hidePost);
router.put("/show-fewer/:postId", authMiddleware, showFewerPosts);
router.patch("/:id", authMiddleware, updatePost);

router.post(
  "/:postId/comments",
  authMiddleware,
  [
    body("content").notEmpty().withMessage("Comment cannot be empty"),
  ],
  createComment
);


router.get("/:postId/comments", getCommentsByPost);

router.delete("/:id", authMiddleware, deleteComment);

export default router;
