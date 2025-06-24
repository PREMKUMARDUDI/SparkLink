import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import bcrypt from "bcrypt";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.status(200).json({ message: "Post created!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    await Post.findByIdAndDelete(post_id);

    return res.status(200).json({ message: "Post deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comment.save();

    return res.status(200).json({ message: "Comment added!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "name username profilePicture"
    );

    return res.status(200).json({ comments: comments.reverse() });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const comment = await Comment.findOne({ _id: comment_id });

    if (!comment) {
      return res.status(404).json("Comment not found!");
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    await Comment.findByIdAndDelete(comment_id);

    return res.status(200).json({ message: "Comment deleted!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const increment_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    post.likes = post.likes + 1;

    await post.save();

    return res.json("Likes Incremented!");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const increment_likes2 = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    if (post.userId.toString() === user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    post.likes = post.likes + 1;

    await post.save();

    return res.json("Likes Incremented!");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
