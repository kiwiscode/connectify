const User = require("../models/User.model");

const searchUsers = (req, res) => {
  console.log("Right side bar controller working !");
};

const getFirst3MostFollowedUser = (req, res) => {
  console.log("Right side bar controller 2 working !");

  User.find()
    .sort({ "followers.length": 1 })
    .limit(3)
    .then((users) => {
      res.status(201).json({ first3User: users.reverse() });
    })
    .catch(() => {
      res.status(404).json({
        errorMessage: "Error occurred while fetching users from the database!",
      });
    });
};

module.exports = {
  searchUsers,
  getFirst3MostFollowedUser,
};
