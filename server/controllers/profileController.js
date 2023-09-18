const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");
const capitalize = require("../utils/capitalize");

const handleGetUserProfile = (req, res, next) => {};

module.exports = {
  handleGetUserProfile,
};
