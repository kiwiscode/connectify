require("dotenv").config();

require("./db");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));
app.use(cors());

require("./config")(app);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const logoutRoutes = require("./routes/logout.routes");
app.use("/logout", logoutRoutes);

const homeRoutes = require("./routes/home.routes");
app.use("/home", homeRoutes);

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
module.exports = app;
