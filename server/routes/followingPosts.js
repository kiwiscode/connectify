const express = require("express");
const router = express();
const handleShowFollowingPosts = require("../controllers/followingPostsController");
const User = require("../models/User.model");
router.get("/", handleShowFollowingPosts.handleShowFollowingPosts);

module.exports = router;
