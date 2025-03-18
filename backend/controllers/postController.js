import Post from "../models/Post.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";
import User  from "../models/User.js"
import Community from "../models/Community.js";



export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, community, postType, mediaUrl,tags } = req.body;

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
      tags: tags ? tags.map(tag => tag.toLowerCase().trim()) : []
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
    let { sort = "hot", search = "", community } = req.query;
    let query = {};

    
    if (community) {
      query.community = community;
    }

   
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    
    let sortOption = {};
    switch (sort) {
      case "new":
        sortOption = { createdAt: -1 }; 
        break;
      case "top":
        sortOption = { upvotes: -1, downvotes: 1 }; 
        break;
      case "best":
        sortOption = { upvotes: -downvotes };
        break;
      default:
        sortOption = { createdAt: -1 }; 
    }

    
    const posts = await Post.find(query)
      .populate("author", "username")
      .populate("community", "name")
      .sort(sortOption);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const searchPosts = async (req, res) => {
  try {
    const { query } = req.params;
    const searchResults = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })
      .populate("author", "username")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ message: "Error searching posts", error });
  }
};


export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate({
        path: "community",
        select: "_id name description type members joinRequests", 
      });

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

    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const author = await User.findById(post.author);
    if (!author) return res.status(404).json({ message: "Author not found" });

    const hasLiked = post.upvotes.includes(userId);
    const hasDisliked = post.downvotes.includes(userId);

    if (hasLiked) {
      post.upvotes = post.upvotes.filter((uid) => uid.toString() !== userId);
      author.karma -= 1;
    } else {
      post.upvotes.push(userId);
      author.karma += 1
      if (hasDisliked) {
        post.downvotes = post.downvotes.filter(
          (uid) => uid.toString() !== userId
        );
        author.karma += 1;
      }
    }

    await post.save();
    await author.save();
    res.status(200).json({
      message: "Like updated",
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      karma: author.karma,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const author = await User.findById(post.author);
    if (!author) return res.status(404).json({ message: "Author not found" });

    const hasLiked = post.upvotes.includes(userId);
    const hasDisliked = post.downvotes.includes(userId);

    if (hasDisliked) {
      post.downvotes = post.downvotes.filter(
        (uid) => uid.toString() !== userId
      );
      author.karma += 1;
    } else {
      post.downvotes.push(userId);
      author.karma -= 1;
      if (hasLiked) {
        post.upvotes = post.upvotes.filter((uid) => uid.toString() !== userId);
        author.karma -= 1;
      }
    }

    await post.save();
    await author.save();
    res.status(200).json({
      message: "Dislike updated",
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      karma: author.karma,

    });
  } catch (error) {
    console.error("Error disliking post:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




export const reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.reports.includes(userId)) {
      post.reports.push(userId);
      await post.save();
      return res.status(200).json({ message: "Post reported successfully" });
    } else {
      return res.status(400).json({ message: "You have already reported this post" });
    }
  } catch (error) {
    console.error("Error reporting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const hidePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.hiddenPosts.includes(postId)) {
      user.hiddenPosts.push(postId);
      await user.save();
      return res.status(200).json({ message: "Post hidden successfully" });
    } else {
      return res.status(400).json({ message: "Post is already hidden" });
    }
  } catch (error) {
    console.error("Error hiding post:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const showFewerPosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; 

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.showFewerByUsers) {
      post.showFewerByUsers = [];
    }

    if (!post.showFewerByUsers.includes(userId)) {
      post.showFewerByUsers.push(userId);
      await post.save();
      return res.json({ message: "Post marked for fewer visibility", post });
    }

    res.json({ message: "User has already marked this post", post });
  } catch (error) {
    console.error("Error in showFewerPosts:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, postType } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

   

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (postType) post.postType = postType;

    const updatedPost = await post.save();


    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error while updating post" });
  }
};


export const getSubscribedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    const subscribedCommunities = user.subscriptions || [];
    
    const memberCommunities = await Community.find({
      members: userId
    }).select('_id');
    
    const communityIds = [
      ...subscribedCommunities,
      ...memberCommunities.map(c => c._id)
    ];
    
    const uniqueCommunityIds = [...new Set(communityIds.map(id => id.toString()))];
    
    const posts = await Post.find({
      community: { $in: uniqueCommunityIds }
    })
    .populate('author', 'username avatar')
    .populate('community', 'name avatar')
    .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
