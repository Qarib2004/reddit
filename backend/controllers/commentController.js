import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";
import Post from "../models/Post.js";
import User from "../models/User.js";


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
      const comments = await Comment.find({ post: req.params.postId, parentComment: null })
        .populate({
          path: "replies",
          populate: { path: "author", select: "username" },
        })
        .populate("author", "username");
  
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments", error });
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
    const author = await User.findById(comment.author);
    if (!author) return res.status(404).json({ message: "Author not found" });

    const hasLiked = comment.upvotes.includes(userId);
    const hasDisliked = comment.downvotes.includes(userId);

    if (hasLiked) {
      comment.upvotes = comment.upvotes.filter((uid) => uid.toString() !== userId);
      author.karma -= 1;
    } else {
      comment.upvotes.push(userId);
      author.karma += 1;
      if (hasDisliked) {
        comment.downvotes = comment.downvotes.filter((uid) => uid.toString() !== userId);
        author.karma += 1;
      }
    }

    await comment.save();
    await author.save();
    res.status(200).json({ message: "Like updated", upvotes: comment.upvotes, downvotes: comment.downvotes, karma: author.karma});
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

    const author = await User.findById(comment.author);
    if (!author) return res.status(404).json({ message: "Author not found" });

    const hasLiked = comment.upvotes.includes(userId);
    const hasDisliked = comment.downvotes.includes(userId);

    if (hasDisliked) {
      comment.downvotes = comment.downvotes.filter((uid) => uid.toString() !== userId);
      author.karma += 1;
    } else {
      comment.downvotes.push(userId);
      author.karma -= 1;
      if (hasLiked) {
        comment.upvotes = comment.upvotes.filter((uid) => uid.toString() !== userId);
        author.karma -= 1;
      }
    }

    await comment.save();
    await author.save();
    res.status(200).json({ message: "Dislike updated", upvotes: comment.upvotes, downvotes: comment.downvotes,karma:author.karma });
  } catch (error) {
    console.error("Error disliking comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const replyToComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const { parentId } = req.params;
    const userId = req.user.id;

    if (!content.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

   
    const newReply = new Comment({
      content,
      author: userId,
      post: postId,
      parentComment: parentId,
    });

    await newReply.save();

    
    parentComment.replies.push(newReply._id);
    await parentComment.save();

    res.status(201).json({ message: "Reply added successfully", comment: newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const likeReply = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id;

    const reply = await Comment.findById(id);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const hasLiked = reply.upvotes.includes(userId);
    const hasDisliked = reply.downvotes.includes(userId);

    if (hasLiked) {
      reply.upvotes = reply.upvotes.filter(uid => uid.toString() !== userId);
    } else {
      reply.upvotes.push(userId);
      if (hasDisliked) {
        reply.downvotes = reply.downvotes.filter(uid => uid.toString() !== userId);
      }
    }

    await reply.save();

    res.status(200).json({ 
      message: "Reply like updated", 
      upvotes: reply.upvotes,
      downvotes: reply.downvotes 
    });
  } catch (error) {
    console.error("Error liking reply:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const dislikeReply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reply = await Comment.findById(id);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const hasLiked = reply.upvotes.includes(userId);
    const hasDisliked = reply.downvotes.includes(userId);

    if (hasDisliked) {
      reply.downvotes = reply.downvotes.filter(uid => uid.toString() !== userId);
    } else {
      reply.downvotes.push(userId);
      if (hasLiked) {
        reply.upvotes = reply.upvotes.filter(uid => uid.toString() !== userId);
      }
    }

    await reply.save();

    res.status(200).json({ 
      message: "Reply dislike updated", 
      upvotes: reply.upvotes,
      downvotes: reply.downvotes 
    });
  } catch (error) {
    console.error("Error disliking reply:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const reportComment = async (req, res) => {
  try {
   
    
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
     
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    if (!reason) {
      return res.status(400).json({ message: "Report reason is required" });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.reports) {
      comment.reports = [];
    }


    comment.reports.push({ userId, reason, timestamp: new Date() });
    await comment.save();

    res.status(200).json({ message: "Comment reported successfully" });
  } catch (error) {
    console.error("Error in reportComment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
