const User = require("../models/User.model");
const Post = require("../models/Post.model");
const cloudinary = require("../config/cloudinary.config");

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

const handleUploadMedia = async (req, res, next) => {};

module.exports = {
  handleProfile,
  handleUploadMedia,
};
