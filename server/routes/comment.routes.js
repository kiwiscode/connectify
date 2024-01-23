const express = require("express");
const router = express();
const commentController = require("../controllers/commentController.js");

// add comment start to check
router.post("/", commentController.addComment);
// add comment finish to check
module.exports = router;
