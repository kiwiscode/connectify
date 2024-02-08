const express = require("express");
const router = express();
const followController = require("../controllers/followController");

router.post("/", followController.handleFollow);

module.exports = router;
