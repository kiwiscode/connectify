const express = require("express");
const router = express();
const handleShowFollowingPosts = require("../controllers/followingPostsController");

router.get("/", handleShowFollowingPosts.handleShowFollowingPosts);

module.exports = router;
