const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, favoriteController.handleGetFavorites);
router.post("/", authenticateToken, favoriteController.handleAddFavorite);
module.exports = router;
