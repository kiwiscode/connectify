const User = require("../models/User.model");
const Post = require("../models/Post.model");

const handleProfile = (req, res) => {
  const userId = req.user.userId;

  console.log(userId);

  User.findById(userId)
    .populate("posts")
    .then((response) => {
      res.status(200).json({ posts: response.posts, response });
    })
    .catch((err) => {
      console.log(err);
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
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
};
