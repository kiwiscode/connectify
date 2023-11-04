require("dotenv").config();

require("./db");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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

const addFavoriteRoutes = require("./routes/favorite.routes");
app.use("/favorite", addFavoriteRoutes);

const postRepost = require("./routes/repost.routes");
app.use("/repost", postRepost);

module.exports = app;
