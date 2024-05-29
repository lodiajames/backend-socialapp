const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String }],
  file: String,
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
