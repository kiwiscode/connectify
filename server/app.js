require("./db");
require("dotenv").config();
require("./utils/pasaport.js");

const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const passport = require("passport");
const session = require("express-session");
const getUserIp = require("./middleware/getUserIp.js");

app.use(logger("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.set("trust proxy", 1);
app.use(getUserIp);

const FRONTEND_URL = process.env.FRONTEND_URL;

const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  },
});

require("./socket/socket.js")(io);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

// google auth
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes.js");
const postRoutes = require("./routes/post.routes.js");
const profileRoutes = require("./routes/profile.routes");
const commentRoutes = require("./routes/comment.routes");
const postRepost = require("./routes/repost.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const notificationRoutes = require("./routes/notification.routes");
const postDetailRoutes = require("./routes/postDetail.routes");
const followRoutes = require("./routes/followRoutes.js");
const unfollowRoutes = require("./routes/unfollowRoutes.js");
const followingPosts = require("./routes/followingPosts");
const messageRoutes = require("./routes/message.routes.js");
const rightSideBarRoutes = require("./routes/right-side-bar.route");
const forgotPasswordRoutes = require("./routes/forgotPassword.routes.js");
const subscriptionRoutes = require("./routes/subscription.routes.js");
const lastActivitiesRoutes = require("./routes/lastActivitiesRoutes.js");
const bookmarkRoutes = require("./routes/bookmark.routes.js");
const settingRoutes = require("./routes/setting.routes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/profile", profileRoutes);
app.use("/comment", commentRoutes);
app.use("/repost", postRepost);
app.use("/favorite", favoriteRoutes);
app.use("/notifications", notificationRoutes);
app.use("/", postDetailRoutes);
app.use("/follow", followRoutes);
app.use("/unfollow", unfollowRoutes);
app.use("/followingPosts", followingPosts);
app.use("/", messageRoutes);
app.use("/", rightSideBarRoutes);
app.use("/", forgotPasswordRoutes);
app.use("/", subscriptionRoutes);
app.use("/", lastActivitiesRoutes);
app.use("/", bookmarkRoutes);
app.use("/", settingRoutes);

module.exports = { app, server };
