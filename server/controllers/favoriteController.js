const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");

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

      Post.findById(postId).then((post) => {
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        function findId(item) {
          return item._id.toString() === post._id.toString();
        }
        const result = user.favorites.find(findId);

        if (!result) {
          post.likes.push(user);
          post.save();
          user.favorites.push(post);
          Favorite.create({
            userId: userId,
            postId: postId,
            content: post,
          });
          return user.save().then(() => {
            res.status(200).json("Favorite added to your favorites");
          });
        } else {
          console.log("This line is working Line first!");

          return res
            .status(400)
            .json({ errorMessage: "Post already exists in User's favorites" });
        }
      });
    })
    .catch(() => {
      console.log("This line is working Line second!");

      res
        .status(501)
        .json({ errorMessage: "Error occured while trying to find post!" });
    });
};

module.exports = {
  handleAddFavorite,
  handleGetFavorites,
};
