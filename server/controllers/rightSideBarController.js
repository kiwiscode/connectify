const User = require("../models/User.model");

const handleGetAllUsers = (req, res) => {
  const { userId } = req.user;
  User.find()
    .then((allUsersFromDataBase) => {
      const filteredFromUser = allUsersFromDataBase.filter((eachUser) => {
        return eachUser._id.toString() !== userId;
      });

      const updatedUsers = filteredFromUser.map((user) => ({
        ...user,
        fullname: user.fullname.split(" ").join("").toLowerCase(),
        username: user.username.split(" ").join("").toLowerCase(),
      }));

      res.status(201).json({ allUsers: updatedUsers });
    })
    .catch(() => {
      res.status(500).json({
        errorMessage:
          "Error occured while trying to fetch all users from database !",
      });
    });
};

const getFirst3MostFollowedUser = (req, res) => {
  const { userId } = req.user;
  User.find({
    _id: { $ne: userId },
  })
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
  getFirst3MostFollowedUser,
  handleGetAllUsers,
};
