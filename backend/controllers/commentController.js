import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";
import Post from "../models/Post.js";


  export const createComment = async (req, res) => {
    
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { content, parentComment } = req.body;
    const { postId } = req.params;
  
    
  
    try {
      const comment = new Comment({
        content,
        author: req.user.id,
        post: postId, 
        parentComment: parentComment || null,
      });
  
      await comment.save();
    
      res.status(201).json({ message: "Comment created", comment });
    } catch (error) {
      console.error(" Server error:", error);
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


export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.upvotes.includes(userId);
    const hasDisliked = comment.downvotes.includes(userId);

    if (hasLiked) {
      comment.upvotes = comment.upvotes.filter((uid) => uid.toString() !== userId);
    } else {
      comment.upvotes.push(userId);
      if (hasDisliked) {
        comment.downvotes = comment.downvotes.filter((uid) => uid.toString() !== userId);
      }
    }

    await comment.save();
    res.status(200).json({ message: "Like updated", upvotes: comment.upvotes, downvotes: comment.downvotes });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const dislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.upvotes.includes(userId);
    const hasDisliked = comment.downvotes.includes(userId);

    if (hasDisliked) {
      comment.downvotes = comment.downvotes.filter((uid) => uid.toString() !== userId);
    } else {
      comment.downvotes.push(userId);
      if (hasLiked) {
        comment.upvotes = comment.upvotes.filter((uid) => uid.toString() !== userId);
      }
    }

    await comment.save();
    res.status(200).json({ message: "Dislike updated", upvotes: comment.upvotes, downvotes: comment.downvotes });
  } catch (error) {
    console.error("Error disliking comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};