const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");
const { post } = require("../routes/profile.routes");

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
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

const handleDeleteFavorite = (req, res) => {
  const { userId, postId } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      Post.findById(postId).then((postToDelete) => {
        postToDelete.likes = postToDelete.likes.filter(
          (postToDelete) => postToDelete._id.toString() !== userId
        );
        postToDelete.save();

        Favorite.findOne({ userId: userId, postId: postId })
          .then((foundItem) => {
            if (foundItem) {
              const mainId = foundItem._id;
              Favorite.findByIdAndDelete(mainId).then(() => {
                user.favorites = user.favorites.filter(
                  (postId) =>
                    postId._id.toString() !== postToDelete._id.toString()
                );

                return user.save().then(() => {
                  res
                    .status(200)
                    .json({
                      message:
                        "Favorite deleted from favorites model,user favorites array and post likes...",
                    });
                });
              });
            }
            return;
          })
          .catch(() => {
            res.status(501).json({ errorMessage: "Search Error" });
          });
      });
    })
    .catch(() => {
      res.status(404).json("User not found!");
    });
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
  handleDeleteFavorite,
};
