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
    .populate("followers")
    .populate("following")
    .populate({
      path: "favorites",
      options: { sort: { createdAt: -1 } }, // Favorites için de createdAt tarihine göre tersten sıralama
    })
    .populate({
      path: "posts",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "reposted",
        model: "User",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "repostedFromThisOriginalPost",
        model: "Post",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "commentedForThisPost",
        model: "Post",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "commentedForThisUsersPost",
        model: "User",
      },
    })
    .populate({
      path: "favorites",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    // finish to check
    // .populate("posts")
    .then((user) => {
      console.log("Profile page active!");
      console.log(user.posts.length, user.favorites.length);
      res.status(200).json({ posts: user.posts, user });
    })
    .catch((err) => {
      console.log("Error =>", err);
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
    .populate("followers")
    .populate("following")
    .populate({
      path: "posts",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "repostedFromThisOriginalPost",
        model: "Post",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "commentedForThisPost",
        model: "Post",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "commentedForThisUsersPost",
        model: "User",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "reposted",
        model: "User",
      },
    })
    .populate({
      path: "favorites",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "favorites",
      populate: {
        path: "repostedFromThisOriginalPost",
        model: "Post",
      },
    })
    .populate({
      path: "favorites",
      populate: {
        path: "reposted",
        model: "User",
      },
    })
    // finish to check
    // .populate("posts")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found! 1" });
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
    .populate()
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
            gravity: "face",
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

const getFollowers = (req, res) => {
  console.log("Route is working !");

  const { userId } = req.params;

  console.log("Clicked user id =>", userId);

  User.findById(userId)
    .populate("following")
    .populate("followers")
    .then((user) => {
      res.status(200).json({ followers: user.followers, user: user });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found !" });
    });
};
const getFollowing = (req, res) => {
  const { userId } = req.params;

  console.log("Clicked user id =>", userId);

  // const { userId } = req.user;

  User.findById(userId)
    .populate("following")
    .populate("followers")
    .then((user) => {
      res.status(200).json({ following: user.following, user: user });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found !" });
    });
};

const handlecreateChatSpesificUserInformations = (req, res) => {
  const { userId } = req.user;

  User.findById(userId)
    .populate("following")
    .populate("followers")
    .populate("favorites")
    .populate("posts")
    .populate("messages")
    .then((user) => {
      console.log(
        "User ready to get current message room id =>",
        user.username,
        user.messages
      );

      res.status(200).json({ messages: user.messages });
    })
    .catch((error) => {
      console.log("Error =>", error);
    });
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
  handleProfilePicture,
  getFollowers,
  getFollowing,
  handlecreateChatSpesificUserInformations,
};
