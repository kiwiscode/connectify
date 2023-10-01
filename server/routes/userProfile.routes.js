const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");
const fileUploader = require("../config/cloudinary.config");

router.get("/", authenticateToken, profileController.handleProfile);

module.exports = router;
