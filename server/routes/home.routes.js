const express = require("express");
const router = express();
const homeController = require("../controllers/homeController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.post("/post", authenticateToken, homeController.handlePost);
router.get("/", authenticateToken, homeController.handleShowPosts);
module.exports = router;
