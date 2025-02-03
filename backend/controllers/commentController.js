import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";

export const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, post, parentComment } = req.body;

  try {
    const comment = new Comment({
      content,
      author: req.user.id,
      post,
      parentComment: parentComment || null,
    });

    await comment.save();
    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username")
      .populate("parentComment");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "No access" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: " Server error", error });
  }
};
