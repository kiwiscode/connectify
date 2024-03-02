const router = require("express").Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const rightSideBarController = require("../controllers/rightSideBarController");
router.get(
  "/search-users",
  authenticateToken,
  rightSideBarController.searchUsers
);

router.get(
  "/get-most-followed-3-user",
  authenticateToken,
  rightSideBarController.getFirst3MostFollowedUser
);

module.exports = router;
