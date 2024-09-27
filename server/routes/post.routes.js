const express = require("express");
const router = express();
const postController = require("../controllers/postController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, postController.handleShowPosts);
router.post("/", authenticateToken, postController.handlePost);
router.post("/delete-post", authenticateToken, postController.handleDeletePost);
router.patch("/:postId/pin", authenticateToken, postController.handlePinPost);

module.exports = router;
