const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");

const handleGetFavorites = (req, res) => {
  const { userId } = req.user;

  User.findById(userId)
    .populate({
      path: "favorites",
      options: { sort: { createdAt: -1 } },
    })
    .then((favoritesFromDataBase) => {
      console.log(
        "All the favorites from data base for spesific user =>",
        favoritesFromDataBase
      );
      res.json({ favorites: favoritesFromDataBase.favorites });
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

          // NOTE start to check send notification after adding favorite
          const checkingNotifications = user.notifications.filter(
            (eachNotification) => {
              return (
                eachNotification.post.toString() === post._id.toString() &&
                eachNotification.isFavorite.value
              );
            }
          );

          console.log(
            "let's see all the notifications according to this post id =>",
            checkingNotifications
          );
          if (!checkingNotifications.length) {
            const newNotification = {
              post: post._id,
              notificationReceiver: post.userId,
              isFavorite: {
                value: true,
                profileImageUrl: user.imageUrl,
                userFullName: user.fullname,
                favoritedPostContent: post.content,
              },
            };

            user.notifications.push(newNotification);
          }
          // NOTE finish to check send notification after adding favorite

          return user.save().then(() => {
            res.status(200).json("Favorite added to your favorites");
          });
        } else {
          return res
            .status(400)
            .json({ errorMessage: "Post already exists in User's favorites" });
        }
      });
    })
    .catch(() => {
      res
        .status(501)
        .json({ errorMessage: "Error occured while trying to find post!" });
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

        // NOTE start to check delete if favorite notification readed
        const checkingNotifications = user.notifications.filter(
          (eachNotification) => {
            return (
              eachNotification.post.toString() ===
                postToDelete._id.toString() && eachNotification.isFavorite.value
            );
          }
        );

        console.log(
          "let's see all the notifications according to this post id =>",
          checkingNotifications
        );

        // let's find the index of this post and delete the notification
        const findIndex = user.notifications.findIndex((notification) => {
          return notification.post.toString() === postToDelete._id.toString();
        });

        console.log("THIS IS THE INDEX OF THE FAVORITE =>", findIndex);

        if (findIndex) {
          user.notifications.splice(findIndex, 1);
        }
        // NOTE finish to check delete if favorite notification readed

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
                  res.status(200).json({
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
  handleAddFavorite,
  handleGetFavorites,
  handleDeleteFavorite,
};
