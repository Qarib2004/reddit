import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const votePost = async (req, res) => {
  const { postId, voteType } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (voteType === "upvote") {
      post.upvotes += 1;
    } else if (voteType === "downvote") {
      post.downvotes += 1;
    } else {
      return res.status(400).json({ message: "Incorrect voting type" });
    }

    await post.save();
    res.json({ message: "Vote counted", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const voteComment = async (req, res) => {
  const { commentId, voteType } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (voteType === "upvote") {
      comment.upvotes = (comment.upvotes || 0) + 1;
    } else if (voteType === "downvote") {
      comment.downvotes = (comment.downvotes || 0) + 1;
    } else {
      return res.status(400).json({ message: "Incorrect voting type" });
    }

    await comment.save();
    res.json({ message: "Vote counted", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
