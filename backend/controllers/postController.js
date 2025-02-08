import Post from "../models/Post.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";





export const createPost = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, community, postType, mediaUrl } = req.body;

  if (!mongoose.Types.ObjectId.isValid(community)) {
    return res.status(400).json({ message: "Invalid community ID" });
  }

  try {
    let uploadedMediaUrl = mediaUrl || null;

    if (req.file) {
     
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
        resource_type: "auto",
      });

      uploadedMediaUrl = result.secure_url;
     
    }

    const newPost = new Post({
      title,
      postType,
      community: new mongoose.Types.ObjectId(community),
      author: req.user.id,
      content: postType === "text" ? content || "" : "",
      mediaUrl: uploadedMediaUrl,
    });

    await newPost.save();
    console.log("The post was successfully created:", newPost);

    res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error(" Error in creating a post:", error);
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


export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.upvotes.includes(req.user.id)) {
      post.upvotes.push(req.user.id);
      post.downvotes = post.downvotes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      await post.save();
      return res.json({ message: "Post liked", upvotes: post.upvotes.length });
    } else {
      post.upvotes = post.upvotes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      await post.save();
      return res.json({ message: "Like removed", upvotes: post.upvotes.length });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.downvotes.includes(req.user.id)) {
      post.downvotes.push(req.user.id);
      post.upvotes = post.upvotes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      await post.save();
      return res.json({
        message: "Post disliked",
        downvotes: post.downvotes.length,
      });
    } else {
      post.downvotes = post.downvotes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      await post.save();
      return res.json({
        message: "Dislike removed",
        downvotes: post.downvotes.length,
      });
    }
  } catch (error) {
    console.error("Error disliking post:", error);
    res.status(500).json({ message: "Server error", error });
  }
};