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

          User.findById(post.userId.toString())
            .then((notificationReceiver) => {
              const checkingNotifications =
                notificationReceiver.notifications.filter(
                  (eachNotification) => {
                    return (
                      eachNotification.post.toString() ===
                        post._id.toString() && eachNotification.isFavorite.value
                    );
                  }
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

                notificationReceiver.notifications.push(newNotification);
                notificationReceiver.save();

                console.log(
                  "NOTIFICATION RECEIVER INFORMED ABOUT HIS POST GOT FAVORITE"
                );
              }
            })
            .catch(() => {
              res.status(404).json({
                errorMessage: "Notification receiver user not found!",
              });
            });

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

        User.findById(postToDelete.userId.toString())
          .then((notifiedUser) => {
            // let's find the index of this post and delete the notification
            const findIndex = notifiedUser.notifications.findIndex(
              (notification) => {
                return (
                  notification.post.toString() === postToDelete._id.toString()
                );
              }
            );

            if (
              findIndex === 0 ||
              (findIndex > 0 &&
                notifiedUser.notifications[findIndex].isFavorite.value)
            ) {
              if (notifiedUser._id.toString() === user._id.toString()) {
                console.log(
                  "This line is working because the user who added their post to favorites."
                );
                const filteredFavoritesUserArray =
                  notifiedUser.favorites.filter(
                    (postId) =>
                      postId._id.toString() !== postToDelete._id.toString()
                  );
                notifiedUser.favorites = filteredFavoritesUserArray;
                notifiedUser.notifications.splice(findIndex, 1);
                notifiedUser.save();
                console.log("THIS LINE IS WORKING 1");
              } else if (notifiedUser._id.toString() !== user._id.toString()) {
                notifiedUser.notifications.splice(findIndex, 1);
                notifiedUser.save();
                const filteredFavoritesUserArray = user.favorites.filter(
                  (postId) =>
                    postId._id.toString() !== postToDelete._id.toString()
                );

                user.favorites = filteredFavoritesUserArray;
                user.save();
                console.log("THIS LINE IS WORKING 1.1");
              }
            } else {
              return;
            }
          })
          .catch(() => {
            res
              .status(404)
              .json({ erroMessage: "Notification receiver user not found!" });
          });

        // NOTE finish to check delete if favorite notification readed

        Favorite.findOne({ userId: userId, postId: postId })
          .then((foundItem) => {
            if (foundItem) {
              const mainId = foundItem._id;
              Favorite.findByIdAndDelete(mainId).then(() => {
                console.log("THIS LINE IS WORKING 2");

                res.status(200).json({
                  message:
                    "Favorite deleted from favorites model,user favorites array and post likes... and from notifications if exist",
                });
              });

              // return user
              // .save()
              // .then(() => {
              //   console.log("THIS LINE IS WORKING 3");

              //   res.status(200).json({
              //     message:
              //       "Favorite deleted from favorites model,user favorites array and post likes...",
              //   });
              // })
              // .catch((error) => {
              //   console.log(error);
              //   res
              //     .status(500)
              //     .json({
              //       errorMessage:
              //         "Error occured while you trying to delete favorite",
              //     });
              // });
            }
            // return;
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
