require("./db");
require("dotenv").config();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
app.use(logger("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.set("trust proxy", 1);

const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  },
});

require("./socket/socket.js")(io);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes.js");
app.use("/users", userRoutes);

const postRoutes = require("./routes/post.routes.js");
app.use("/posts", postRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes);

const commentRoutes = require("./routes/comment.routes");
app.use("/comment", commentRoutes);

const postRepost = require("./routes/repost.routes");
app.use("/repost", postRepost);

const favoriteRoutes = require("./routes/favorite.routes");
app.use("/favorite", favoriteRoutes);

const notificationRoutes = require("./routes/notification.routes");
app.use("/notifications", notificationRoutes);

const postDetailRoutes = require("./routes/postDetail.routes");
app.use("/", postDetailRoutes);

const followRoutes = require("./routes/followRoutes.js");
app.use("/follow", followRoutes);

const unfollowRoutes = require("./routes/unfollowRoutes.js");
app.use("/unfollow", unfollowRoutes);

const followingPosts = require("./routes/followingPosts");
app.use("/followingPosts", followingPosts);

const messageRoutes = require("./routes/message.routes.js");
app.use("/", messageRoutes);

const rightSideBarRoutes = require("./routes/right-side-bar.route");
app.use("/", rightSideBarRoutes);

const forgotPasswordRoutes = require("./routes/forgotPassword.routes.js");
app.use("/", forgotPasswordRoutes);

const subscriptionRoutes = require("./routes/subscription.routes.js");
app.use("/", subscriptionRoutes);

const lastActivitiesRoutes = require("./routes/lastActivitiesRoutes.js");
app.use("/", lastActivitiesRoutes);

const bookmarkRoutes = require("./routes/bookmark.routes.js");
app.use("/", bookmarkRoutes);

const settingRoutes = require("./routes/setting.routes");
app.use("/", settingRoutes);

module.exports = { app, server };
