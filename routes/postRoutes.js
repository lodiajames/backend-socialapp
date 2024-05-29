const express = require("express");

const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/posts", upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file ? req.file.filename : undefined;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = new Post({ title, content, file });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log("Error creating post", error);
    res.status(500).json({ error: "Oops server error" });
  }
});

router.post("/api/posts/like/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    console.log("Error liking post:", error);
    res.status(500).json({ error: "Oops server error" });
  }
});

router.post("/api/posts/comment/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ text });
    await post.save();
    res.json(post);
  } catch (error) {
    console.log("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
