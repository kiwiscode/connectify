const User = require("../models/User.model");
const Post = require("../models/Post.model");

const handleGetFavorites = (req, res) => {
  const { userId } = req.user;
  console.log(userId);
  User.findById(userId)
    .populate("favorites")
    .then((favoritesFromDataBase) => {
      res.json({ favorites: favoritesFromDataBase });
    })
    .catch(() => {
      res.status(404).json({
        errorMessage: "Error occurred while fetching favorites!",
      });
    });
};

const handleAddFavorite = (req, res) => {
  const { postId } = req.body;
  const { userId } = req.user;
  console.log("USER ID", userId);
  console.log("POST ID", postId);

  User.findById(userId)
    .populate("favorites")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      Post.findById(postId)
        .then((post) => {
          console.log(user.favorites[0]._id.toString());
          console.log(post._id.toString());

          function findId(item) {
            return item._id.toString() === post._id.toString();
          }

          const result = user.favorites.find(findId);
          console.log(result);
          if (!result) {
            user.favorites.push(post);
            return user.save().then(() => {
              res
                .status(200)
                .json("Favorite added to User's favorite array of object!");
            });
          }
        })
        .catch(() => {
          res.status(404).json({
            errorMessage:
              "Error occured while trying to add post! This post is already added to favorites!",
          });
        });
    })
    .catch(() => {
      res
        .status(501)
        .json({ errorMessage: "Error occured while trying to find post!" });
    });
};

module.exports = {
  handleAddFavorite,
  handleGetFavorites,
};
