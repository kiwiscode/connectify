const User = require("../models/User.model");
const Post = require("../models/Post.model");
const cloudinary = require("../utils/cloudinary");

const handleProfile = (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    // start to check
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } }, // createdAt tarihine göre tersten sıralama
    })
    // finish to check
    // .populate("posts")
    .then((user) => {
      console.log("PROFILE POSTS =>", user.posts.length);
      Post.find({
        $or: [
          { userId: userId },
          { reposted: { $elemMatch: { $eq: userId } } },
        ],
      })
        .then((responsePosts) => {
          console.log("PROFILE POSTS 2 => ", responsePosts);
        })
        .catch(() => {
          console.log("Post not found");
        });
      res.status(200).json({ posts: user.posts, user });
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
    // start to check
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } }, // createdAt tarihine göre tersten sıralama
    })
    .populate({
      path: "favorites",
      options: { sort: { createdAt: -1 } }, // Favorites için de createdAt tarihine göre tersten sıralama
    })
    // finish to check
    // .populate("posts")
    // .populate("favorites")
    .then((response) => {
      res.status(200).json(response);

      console.log(response);
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

const handleProfilePicture = (req, res) => {
  const { userId } = req.user;
  const { profileImage } = req.body;

  console.log(
    "PROFILE IMAGE CURRENT RECEIVED FROM REQ.BODY=>",
    profileImage.slice(0, 21)
  );

  console.log(
    "Active user who is trying to change profile picture => ",
    userId
  );

  User.findById(userId)
    .then((user) => {
      if (profileImage) {
        cloudinary.uploader
          .upload(profileImage, {
            folder: "connectify",
            allowed_formats: [
              "mp4",
              "ogv",
              "jpg",
              "png",
              "pdf",
              "webm",
              "webp",
            ],
            width: 133,
            height: 133,
            radius: "max",
            crop: "fill",
          })
          .then((imageInfo) => {
            console.log("AFTER UPLOADING THE IMAGE =>", imageInfo);
            user.imageUrl = imageInfo.url;
            user.save();

            res.status(200).json(imageInfo);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "USER NOT FOUND!" });
    });
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
  handleProfilePicture,
};
