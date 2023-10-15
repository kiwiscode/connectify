const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");

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
  console.log(userId, postId);

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json("User not found");
      }
      user.favorites = user.favorites.filter(
        (postId) => postId !== postIdToDelete
      );

      return user
        .save()
        .then(() => {
          res.status(200).json("Post deleted from favorites array.");
        })
        .catch(() => {
          res.status(500).json("User not found!");
        });
    })
    .catch((err) => {
      res.status(404).json("User not found!");
    });

  // .then(() => {
  //   Post.findById(postId).then(() => {
  //     Favorite.findOne({ userId: userId, postId: postId })
  //       .then((foundItem) => {
  //         if (foundItem) {
  //           const mainId = foundItem._id;
  //           Favorite.findByIdAndDelete(mainId)
  //             .then(() => {
  //               res
  //                 .status(200)
  //                 .json({ message: "Main favorite model deleted." });
  //             })
  //             .catch((error) => {
  //               res
  //                 .status(500)
  //                 .json({ errorMessage: "Deletion error." }, error);
  //             });
  //         } else {
  //           res.status(404).json({ errorMessage: "No matching item found." });
  //         }
  //       })
  //       .catch((err) => {
  //         res.status(501).json(
  //           {
  //             errorMessage: "Search error:",
  //           },
  //           err
  //         );
  //       });
  //   });
  // })
};

module.exports = {
  handleProfile,
  handleShowSpesificProfile,
  handleDeleteFavorite,
};
