import Post from "../models/Post.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";



export const createPost = async (req, res) => {
 

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, community, postType } = req.body;

  if (!mongoose.Types.ObjectId.isValid(community)) {
   
    return res.status(400).json({ message: "Invalid community ID" });
  }

  try {
    const newPost = {
      title,
      postType,
      community: new mongoose.Types.ObjectId(community),
      author: req.user.id,
    };

    if (postType === "text") {
      newPost.content = content || "";
    }

    const post = new Post(newPost);
    await post.save();

    console.log("✅ Пост создан:", post);
    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("❌ Ошибка сервера:", error);
    res.status(500).json({ message: "Server error", error });
  }
};





export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("community", "name");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("community", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "No access" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
