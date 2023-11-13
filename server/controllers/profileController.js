const User = require("../models/User.model");
const Post = require("../models/Post.model");
const handleProfile = (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  User.findById(userId)
    // start to check
    .populate({
      path: "posts",
      options: { sort: { createdAt: -1 } }, // createdAt tarihine göre tersten sıralama
    })
    // finish to check
    // .populate("posts")
    .then((user) => {
      Post.find({ reposted: userId })
        .then((responsePosts) => {
          console.log("PROFILE OF USER =>", user);
          console.log(
            "ALL THE POSTS THAT ACTIVE USER REPOSTED =>",
            responsePosts
          );
        })
        .catch(() => {});
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
    // .populate({
    //   path: "posts",
    //   options: { sort: { createdAt: -1 } }, // createdAt tarihine göre tersten sıralama
    // })
    // .populate({
    //   path: "favorites",
    //   options: { sort: { createdAt: -1 } }, // Favorites için de createdAt tarihine göre tersten sıralama
    // })
    // finish to check
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
