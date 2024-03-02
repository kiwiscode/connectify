const User = require("../models/User.model");

const handleGetAllUsers = (req, res) => {
  const { userId } = req.user;
  console.log("uSER Id =>", userId);
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

      console.log("Filtered array fullname =>", filteredFromUser[0].fullname);
      console.log("Updated users array  =>", updatedUsers[0].fullname);
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
  getFirst3MostFollowedUser,
  handleGetAllUsers,
};
