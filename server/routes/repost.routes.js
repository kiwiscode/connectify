const express = require("express");
const router = express();

const repostController = require("../controllers/repostController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.post("/", authenticateToken, repostController.handleRepost);
router.post(
  "/delete-repost",
  authenticateToken,
  repostController.handleDeleteReposts
);
router.get("/", authenticateToken, repostController.handleGetReposts);

module.exports = router;
