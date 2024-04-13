const express = require("express");
const router = express();
const postController = require("../controllers/postController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, postController.handleShowPosts);
router.post("/post", authenticateToken, postController.handlePost);
router.post("/delete-post", authenticateToken, postController.handleDeletePost);

module.exports = router;
