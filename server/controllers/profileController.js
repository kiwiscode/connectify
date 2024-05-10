const User = require("../models/User.model");
const Post = require("../models/Post.model");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcryptjs");
const handleProfile = (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    // start to check

    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    })
    .populate("followers")
    .populate("following")
    .populate({
      path: "favorites",
      options: { sort: { createdAt: -1 } },
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
    .populate({
      path: "posts",
      populate: {
        path: "likes",
        model: "User",
      },
    })
    // .populate("likes")

    // finish to check
    // .populate("posts")
    .then((user) => {
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
      path: "posts",
      populate: {
        path: "likes",
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
        path: "likes",
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

            res.status(200).json({ imageInfo: imageInfo });
          })
          .catch((error) => {
            res.status(501).json({ errorMessage: "Error occured!" });
          });
      } else {
        res.status(501).json({ errorMessage: "Error occured!" });
      }
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "USER NOT FOUND!" });
    });
};

const getFollowers = (req, res) => {
  const { userId } = req.params;

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

async function handleChangePassword(req, res) {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    console.log("is password match =>", isPasswordMatch);
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(newPassword) || newPassword.length < 6) {
      res.status(402).json({
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
}

async function handleDeactivatePasswordConfirmation(req, res) {
  const { userId, deactivatePassword } = req.body;

  try {
    const user = await User.findById(userId);

    const isPasswordMatch = await bcrypt.compare(
      deactivatePassword,
      user.password
    );
    console.log("is password match =>", isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    return res.status(200).json({ message: "Password correct" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: "An error occurred." });
  }
}

const handleDeactivateAccount = (req, res) => {
  const { userId } = req.user;
  console.log("User id ready to deactivate his account =>", userId);

  User.findById(userId)
    .then((user) => {
      user.isDeactivated = true;
      user.deactivatedDate = Date.now();
      user.save();

      Post.updateMany({ userId: userId }, { $set: { deactivatedOwner: true } })
        .then((result) => {
          console.log(
            `${result.nModified} posts have been successfully updated.`
          );
        })
        .catch((error) => {
          console.error("Error updating posts:", error.message);
        });

      User.find()
        .then((users) => {
          users.forEach((user) => {
            user.messages.forEach((message) => {
              message.members.forEach((eachMember) => {
                if (eachMember._id.toString() === userId) {
                  console.log("Room =>", message);

                  if (user._id.toString() !== userId) {
                    message.deactivatedMember = true;
                    user.save();
                  }
                }
              });
            });
          });
          res.status(200).json({ message: "User deactivated!" });
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    })
    .catch(() => {
      console.log("Error");
    });
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
  handleProfilePicture,
  getFollowers,
  getFollowing,
  handlecreateChatSpesificUserInformations,
  handleChangePassword,
  handleDeactivatePasswordConfirmation,
  handleDeactivateAccount,
};
