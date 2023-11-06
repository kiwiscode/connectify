const User = require("../models/User.model");

const handleProfile = (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    .populate("posts")
    .then((response) => {
      res.status(200).json({ posts: response.posts, response });
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "An error occured while fetching the data",
        err,
      });
    });
};

const handleShowSpesificProfile = (req, res) => {
  const profileId = req.params.id;

  User.findById(profileId)
    .populate("posts")
    .populate("favorites")
    .then((response) => {
      res.status(200).json(response);

      console.log(response);
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
};
