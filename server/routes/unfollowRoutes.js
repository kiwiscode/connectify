const express = require("express");
const router = express();
const unfollowController = require("../controllers/unfollowController");

router.post("/", unfollowController.handleUnfollow);
module.exports = router;
