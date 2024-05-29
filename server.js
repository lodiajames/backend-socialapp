require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const PostRouter = require("./routes/postRoutes");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectDB = require("./config");

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", PostRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
