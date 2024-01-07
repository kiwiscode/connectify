const express = require("express");
const router = express();
const postDetailController = require("../controllers/postDetailController");

router.get("/postDetail-route-test", (req, res) => {
  res.send("Route is working !");
});
router.get("/:postOwner/status/:postId", postDetailController.getPostDetail);
module.exports = router;
