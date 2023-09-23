const express = require("express");
const router = express();
const homeController = require("../controllers/homeController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", homeController.handleMainPage);

router.post("/post", authenticateToken, homeController.handlePost);

module.exports = router;
