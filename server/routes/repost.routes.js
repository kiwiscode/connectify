const express = require("express");
const router = express();

const repostController = require("../controllers/repostController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.post("/", authenticateToken, repostController.handleRepost);
router.post("/delete", authenticateToken, repostController.handleDeleteReposts);
router.get("/", (req, res) => {
  res.send("Route and postman is working!");
});

module.exports = router;
