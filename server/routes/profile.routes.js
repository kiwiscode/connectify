const express = require("express");
const router = express();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");

router.get("/", authenticateToken, profileController.handleProfile);
router.get("/:id", (req, res) => {
  const profileId = req.params.id;

  User.findById(profileId)
    .then((response) => {
      console.log(response);
      res.status(200).json({ data: response });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
});
module.exports = router;
