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

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const logoutRoutes = require("./routes/logout.routes");
app.use("/logout", logoutRoutes);

const homeRoutes = require("./routes/home.routes");
app.use("/home", homeRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes);

const cloudinaryUpload = require("./routes/post-image.routes");
app.use("/upload", cloudinaryUpload);

module.exports = app;
