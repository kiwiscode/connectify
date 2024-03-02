const router = require("express").Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const rightSideBarController = require("../controllers/rightSideBarController");

router.get(
  "/allUsersFromDataBase",
  authenticateToken,
  rightSideBarController.handleGetAllUsers
);

router.get(
  "/get-most-followed-3-user",
  authenticateToken,
  rightSideBarController.getFirst3MostFollowedUser
);

module.exports = router;
