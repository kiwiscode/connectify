const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Favorite = require("../models/Favorite.model");
const ObjectId = require("mongoose").Types.ObjectId;

const handleGetFavorites = (req, res) => {
  const { userId } = req.user;

  User.findById(userId)
    .populate({
      path: "favorites",
      options: { sort: { createdAt: -1 } },
    })
    .populate({
      path: "favorites",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .then((userFromDataBase) => {
      console.log(
        "All the favorites from data base for spesific user =>",
        userFromDataBase.favorites[0]
      );

      res.json({ favorites: userFromDataBase.favorites });
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
  console.log("This line is working 1!", userId);
  User.findById(userId)
    .populate("favorites")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("This line is working 2!");

      Post.findById(postId).then((post) => {
        // notification ekleme start to check
        // user kendisine notification gönderemez !
        if (post.userId.toString() !== userId) {
          User.findById(post.userId.toString())
            .then((notifiedUser) => {
              console.log("Notified user =>", notifiedUser);
              const newNotification = {
                post: post._id,
                notificationReceiver: post.userId,
                notificationSender: userId,
                isFavorite: {
                  value: true,
                  profileImageUrl: user.imageUrl,
                  senderId: userId,
                  userFullName: user.fullname,
                  favoritedPostContent: post.content,
                },
              };

              notifiedUser.notifications.unshift(newNotification);
              notifiedUser.save();
            })
            .catch(() => {});
        } else {
        }
        // notification ekleme finish to check
        // eğer favorilere eklenen post comment ise onu comment collectionunda bul ve ayrıca likeslarına userı ekle start to check

        if (post.isComment) {
          Comment.find({ postId: post._id.toString() })
            .then((commentFromDataBase) => {
              commentFromDataBase[0].likes.unshift(userId);
              commentFromDataBase[0].save();
            })
            .catch((error) => {
              console.log("Error =>", error);
            });
        }
        // eğer favorilere eklenen post comment ise onu comment collectionunda bul ve ayrıca likeslarına userı ekle finish to check

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        const userFavoriteIds = user.favorites.map((eachFavorite) => {
          return eachFavorite._id.toString();
        });

        if (
          !post.isReposted &&
          !post.reposted.length &&
          !userFavoriteIds.includes(userId)
        ) {
          post.likes.unshift(user);
          post.save();
          user.favorites.unshift(post);
          Favorite.create({
            userId: userId,
            postId: postId,
            content: post,
          });

          return user.save().then(() => {
            res.status(200).json("Favorite added to your favorites");
          });
        } else if (
          post.reposted.length &&
          !post.isReposted &&
          !userFavoriteIds.includes(userId)
        ) {
          Post.find({
            repostedFromThisOriginalPost: {
              $elemMatch: {
                $eq: post._id,
              },
            },
          })
            .then((repostedPost) => {
              console.log("This then block is working!");
              console.log(repostedPost);

              repostedPost[0].likes.unshift(user);
              repostedPost[0].save();
              post.likes.unshift(user);
              post.save();
              user.favorites.unshift(post);
              Favorite.create({
                userId: userId,
                postId: postId,
                content: post,
              });

              return user.save().then(() => {
                res.status(200).json("Favorite added to your favorites");
              });
            })
            .catch((error) => {
              console.log("error => Second post not found !", error);
            });
        } else if (
          post.reposted.length &&
          post.isReposted &&
          !userFavoriteIds.includes(userId)
        ) {
          Post.find({
            _id: post.repostedFromThisOriginalPost[0],
          })
            .then((originalPost) => {
              console.log("Reposted post =>", post);
              console.log("Original post =>", originalPost);

              originalPost[0].likes.unshift(user);
              originalPost[0].save();
              post.likes.unshift(user);
              post.save();
              user.favorites.unshift(originalPost[0]);
              Favorite.create({
                userId: userId,
                postId: postId,
                content: post,
              });

              return user.save().then(() => {
                res.status(200).json("Favorite added to your favorites");
              });
            })
            .catch((error) => {
              console.log("error => Original post not found !", error);
            });
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

      Post.findById(postId).then((post) => {
        if (userId !== post.userId.toString()) {
          // notified olması mümkün olan kullanıcıdan notificationı silme veya bırakma işlemi start to check
          const isReposted = post.isReposted;
          const doesRepostedLength = post.reposted.length;

          User.findById(post.userId.toString())
            .then((notifiedUser) => {
              if (isReposted) {
                Post.findById(post.repostedFromThisOriginalPost[0].toString())
                  .then((originalPost) => {
                    const notification = notifiedUser.notifications.find(
                      (notification) => {
                        return (
                          (notification.post.toString() === postId ||
                            notification.post.toString() ===
                              originalPost._id.toString()) &&
                          notification.notificationSender.toString() ===
                            userId &&
                          notification.isFavorite.value
                        );
                      }
                    );
                    const notificationIndex =
                      notifiedUser.notifications.indexOf(notification);

                    notifiedUser.notifications.splice(notificationIndex, 1);
                    notifiedUser.save();
                  })
                  .catch(() => {});
              } else if (
                (doesRepostedLength || !doesRepostedLength) &&
                !isReposted
              ) {
                // belki doesRepostedLength olabilir check et start to check
                let originalPostId;
                Post.find({ repostedFromThisOriginalPost: postId })
                  .then((referencePost) => {
                    originalPostId = referencePost[0]._id.toString();

                    const notification = notifiedUser.notifications.find(
                      (notification) => {
                        return (
                          (notification.post.toString() === postId ||
                            notification.post.toString() === originalPostId) &&
                          notification.notificationSender.toString() ===
                            userId &&
                          notification.isFavorite.value
                        );
                      }
                    );

                    const notificationIndex =
                      notifiedUser.notifications.indexOf(notification);

                    notifiedUser.notifications.splice(notificationIndex, 1);
                    notifiedUser.save();
                  })
                  .catch(() => {
                    const notification = notifiedUser.notifications.find(
                      (notification) => {
                        return (
                          notification.post.toString() === postId &&
                          notification.notificationSender.toString() ===
                            userId &&
                          notification.isFavorite.value
                        );
                      }
                    );

                    const notificationIndex =
                      notifiedUser.notifications.indexOf(notification);

                    notifiedUser.notifications.splice(notificationIndex, 1);
                    notifiedUser.save();
                  });

                // belki doesRepostedLength olabilir check et finish to check
              } else {
              }
            })
            .catch(() => {});
          // notified olması mümkün olan kullanıcıdan notificationı silme veya bırakma işlemi finish to check
        }

        // eğer user kendi postundan favorite silmiyorsa finish to check

        if (post.isComment) {
          console.log("This post is comment =>", post);
          Comment.find({ postId: post._id })
            .then((commentFromDataBase) => {
              // splice the user id from comment start to check

              const newLikesArray = commentFromDataBase[0].likes.filter(
                (eachLiker) => {
                  return eachLiker._id.toString() !== userId;
                }
              );

              commentFromDataBase[0].likes = newLikesArray;
              commentFromDataBase[0].save();

              // splice the user id from comment finish to check
            })
            .catch((error) => {
              console.log("Error =>", error);
            });
        }

        // REVIEWED start to check
        if (!post.isReposted && post.reposted.length) {
          console.log("This line is working 1st conditional block");

          Post.find({
            repostedFromThisOriginalPost: {
              $elemMatch: {
                $eq: post._id,
              },
            },
          }).then((repostedPost) => {
            console.log("Original post =>", post);
            console.log("Reposted post =>", repostedPost);
            console.log(post.likes);
            const filterPostLikes = post.likes.filter((eachLike) => {
              return eachLike._id.toString() !== userId;
            });
            console.log(filterPostLikes);

            post.likes = filterPostLikes;
            post.save();
            repostedPost[0].likes = filterPostLikes;
            repostedPost[0].save();

            // NOTE start to check delete favorite notification

            User.findById(post.userId.toString())
              .then((notifiedUser) => {
                const notifiedUserNotificationIds =
                  notifiedUser.notifications.map((eachNotification) => {
                    return eachNotification.post.toString();
                  });

                console.log(
                  "Notificationların içerisindeki tüm mevcut post idleri => ",
                  notifiedUserNotificationIds
                );
                // bildirimi alan kişi = notifiedUser !!!
                // let's find the index of this post and delete the notification
                const findedPost = notifiedUser.notifications.find(
                  (eachNotification) => {
                    return (
                      eachNotification.isFavorite.value &&
                      post._id.toString() === post._id.toString()
                    );
                  }
                );

                const findIndex =
                  notifiedUser.notifications.indexOf(findedPost);

                if (!findIndex && findIndex !== 0) {
                  const filteredFavoritesUserArray = user.favorites.filter(
                    (eachFavorite) => {
                      return (
                        eachFavorite._id.toString() !== post._id.toString()
                      );
                    }
                  );
                  console.log(
                    "Bu kisim calisiyor !",
                    user.favorites,
                    filteredFavoritesUserArray
                  );
                  user.favorites = filteredFavoritesUserArray;
                  user.save();

                  console.log(
                    "User favorites filtreledikten sonra kisim calisiyor !",
                    user.favorites
                  );
                } else if (
                  (findIndex === 0 &&
                    notifiedUser.notifications[findIndex].isFavorite.value) ||
                  (findIndex > 0 &&
                    notifiedUser.notifications[findIndex].isFavorite.value)
                ) {
                  if (notifiedUser._id.toString() === user._id.toString()) {
                    const filteredFavoritesUserArray = user.favorites.filter(
                      (post) =>
                        post._id.toString() !==
                          repostedPost[0]._id.toString() &&
                        post._id.toString() !== postId
                    );
                    notifiedUser.favorites = filteredFavoritesUserArray;
                    // notifiedUser.notifications.splice(findIndex, 1);
                    notifiedUser.save();
                    console.log("THIS LINE IS WORKING 1");
                  } else if (
                    notifiedUser._id.toString() !== user._id.toString()
                  ) {
                    console.log("Line 338 working");

                    // notifiedUser.notifications.splice(findIndex, 1);
                    notifiedUser.save();
                    console.log("POST ID =>", postId);
                    console.log(
                      "REPOSTED POST ID =>",
                      repostedPost[0]._id.toString()
                    );

                    console.log("User favorites =>", user.favorites);
                    const filteredFavoritesUserArray = user.favorites.filter(
                      (post) =>
                        post._id.toString() !==
                          repostedPost[0]._id.toString() &&
                        post._id.toString() !== postId
                    );
                    console.log(
                      "User favorites after filtering=>",
                      filteredFavoritesUserArray
                    );

                    user.favorites = filteredFavoritesUserArray;
                    user.save();
                    console.log(
                      "User favorites after filtering=>",
                      user.favorites
                    );
                  } else {
                    return;
                  }
                } else if (
                  notifiedUser._id.toString() === user._id.toString()
                ) {
                  Post.findOne({ repostedFromThisOriginalPost: post._id })
                    .then((originalPost) => {
                      console.log("User favorites =>", user.favorites);
                      console.log("ID 1 =>", post._id.toString());
                      console.log("ID 2 =>", originalPost._id.toString());
                      const userFavoriteIds = user.favorites.map(
                        (eachFavorite) => {
                          return eachFavorite._id.toString();
                        }
                      );

                      console.log(userFavoriteIds);
                      if (
                        userFavoriteIds.includes(originalPost._id.toString())
                      ) {
                        const filteredFavoritesUserArray =
                          user.favorites.filter((eachFavorite) => {
                            return (
                              eachFavorite._id.toString() !==
                              originalPost._id.toString()
                            );
                          });
                        user.favorites = filteredFavoritesUserArray;
                        user.save();
                        console.log("Check favorites array !");
                        console.log("Original post =>", originalPost);
                      } else if (
                        userFavoriteIds.includes(post._id.toString())
                      ) {
                        const filteredFavoritesUserArray =
                          user.favorites.filter((eachFavorite) => {
                            return (
                              eachFavorite._id.toString() !==
                              post._id.toString()
                            );
                          });
                        user.favorites = filteredFavoritesUserArray;
                        user.save();
                        console.log("Check favorites array 2!");
                        console.log("Original post =>", originalPost);
                      } else {
                        return;
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                res.status(404).json({
                  erroMessage: "Notification receiver user not found!",
                });
              });

            // NOTE finish to check delete favorite notification

            // NOTE start to check delete favorite collection

            Favorite.findOne({
              userId: userId,
              $or: [
                { postId: postId },
                { postId: repostedPost[0]._id.toString() },
              ],
            })
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
                }
              })
              .catch(() => {
                res.status(501).json({ errorMessage: "Search Error" });
              });
            // NOTE finish to check delete favorite collection
          });
        }
        // REVIEWED finish to check
        // REVIEWED 2 start to check ...
        else if (post.isReposted && post.reposted.length) {
          console.log("This line is working 2nd conditional block");

          Post.find({
            _id: post.repostedFromThisOriginalPost[0],
          })
            .then((originalPost) => {
              console.log(post.likes);
              const filterPostLikes = post.likes.filter((eachLike) => {
                return eachLike._id.toString() !== userId;
              });

              post.likes = filterPostLikes;
              post.save();
              originalPost[0].likes = filterPostLikes;
              originalPost[0].save();

              // NOTE start to check delete if favorite notification

              User.findById(post.userId.toString())
                .then((notifiedUser) => {
                  const notifiedUserNotificationIds =
                    notifiedUser.notifications.map((eachNotification) => {
                      return eachNotification.post.toString();
                    });

                  console.log(
                    "Notificationların içerisindeki tüm mevcut post idleri => ",
                    notifiedUserNotificationIds
                  );

                  const findedPost = notifiedUser.notifications.find(
                    (eachNotification) => {
                      return (
                        eachNotification.isFavorite.value &&
                        post._id.toString() === post._id.toString()
                      );
                    }
                  );

                  const findIndex =
                    notifiedUser.notifications.indexOf(findedPost);

                  console.log("We are here =>");

                  console.log("First condition =>", findedPost);
                  console.log("Second condition =>", findIndex);

                  if (
                    (findIndex === 0 &&
                      notifiedUser.notifications[findIndex].isFavorite.value) ||
                    (findIndex > 0 &&
                      notifiedUser.notifications[findIndex].isFavorite.value)
                  ) {
                    console.log("We are here => 2");

                    if (notifiedUser._id.toString() === user._id.toString()) {
                      console.log("We are here => 3");

                      const filteredFavoritesUserArray = user.favorites.filter(
                        (post) =>
                          post._id.toString() !==
                            originalPost[0]._id.toString() &&
                          post._id.toString() !== postId
                      );
                      notifiedUser.favorites = filteredFavoritesUserArray;
                      // notifiedUser.notifications.splice(findIndex, 1);
                      notifiedUser.save();
                    } else if (
                      notifiedUser._id.toString() !== user._id.toString()
                    ) {
                      console.log("User favorites sss=>", user.favorites);

                      Post.find({
                        _id: post.repostedFromThisOriginalPost[0],
                      }).then((originalPost) => {
                        console.log("Original post =>", originalPost);

                        console.log("User favorites =>", user.favorites);
                        const filteredFavoritesUserArray =
                          user.favorites.filter(
                            (post) =>
                              post._id.toString() !==
                                originalPost[0]._id.toString() &&
                              post._id.toString() !== postId
                          );

                        user.favorites = filteredFavoritesUserArray;
                        user.save();

                        // notifiedUser.notifications.splice(findIndex, 1);
                        notifiedUser.save();

                        console.log(
                          "User id for favorite collection delete =>",
                          userId,
                          "Post id for favorite collection delete =>",
                          originalPost[0]._id,
                          "||",
                          new ObjectId(postId)
                        );
                      });
                    }
                  } else if (
                    notifiedUser._id.toString() === user._id.toString()
                  ) {
                    const filteredFavoritesUserArray = user.favorites.filter(
                      (post) =>
                        post._id.toString() !==
                          originalPost[0]._id.toString() &&
                        post._id.toString() !== postId
                    );

                    user.favorites = filteredFavoritesUserArray;
                    user.save();

                    console.log("Check user favorites array !2");
                  } else {
                    console.log(
                      "Error occured while deleting the notification !"
                    );
                    return;
                  }
                })
                .catch(() => {
                  res.status(404).json({
                    erroMessage: "Notification receiver user not found!",
                  });
                });

              // NOTE finish to check delete if favorite notification
              // NOTE start to check delete favorite collection

              Favorite.findOne({
                userId: userId,
                $or: [
                  { postId: postId },
                  { postId: originalPost[0]._id.toString() },
                ],
              })
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
                  }
                })
                .catch(() => {
                  res.status(501).json({ errorMessage: "Search Error" });
                });
              // NOTE finish to check delete favorite collection
            })
            .catch(() => {
              res.status(404).json({ errorMessage: "Post not found !" });
            });
        }
        // REVIEWED 2 finish to check ...
        // REVIEWED 3 start to check
        else if (!post.isReposted && !post.reposted.length) {
          console.log("This line is working 3th conditional block");

          console.log(post.likes);
          const filterPost = post.likes.filter((eachLike) => {
            return eachLike._id.toString() !== userId;
          });

          post.likes = filterPost;
          post.save();
          // NOTE start to check delete if favorite notification

          User.findById(post.userId.toString())
            .then((notifiedUser) => {
              console.log("We are here !");
              // let's find the index of this post and delete the notification
              const findIndex = notifiedUser.notifications.findIndex(
                (notification) => {
                  return notification.post.toString() === post._id.toString();
                }
              );

              console.log("We are here 2", findIndex);

              if (
                findIndex === 0 ||
                (findIndex > 0 &&
                  notifiedUser.notifications[findIndex].isFavorite.value)
              ) {
                console.log("We are here 3");

                if (notifiedUser._id.toString() === user._id.toString()) {
                  console.log(
                    "This line is working because the user who added their post to favorites."
                  );
                  const filteredFavoritesUserArray =
                    notifiedUser.favorites.filter(
                      (postId) => postId._id.toString() !== post._id.toString()
                    );
                  notifiedUser.favorites = filteredFavoritesUserArray;
                  // notifiedUser.notifications.splice(findIndex, 1);
                  notifiedUser.save();
                } else if (
                  notifiedUser._id.toString() !== user._id.toString()
                ) {
                  console.log("We are here 4");
                  // notifiedUser.notifications.splice(findIndex, 1);
                  notifiedUser.save();
                  const filteredFavoritesUserArray = user.favorites.filter(
                    (postId) => postId._id.toString() !== post._id.toString()
                  );

                  user.favorites = filteredFavoritesUserArray;
                  user.save();
                }
              } else if (notifiedUser._id.toString() && user._id.toString()) {
                const filterFavoritesArray = user.favorites.filter(
                  (eachFavorite) => {
                    return eachFavorite._id.toString() !== post._id.toString();
                  }
                );

                user.favorites = filterFavoritesArray;
                user.save();
                console.log("We are here 5");

                return;
              } else {
                res.status(404).json({
                  errorMessage:
                    "Error occured while processing for deleting favorite and sending notifications",
                });
              }
            })
            .catch(() => {
              res.status(404).json({
                erroMessage: "Notification receiver user not found!",
              });
            });

          // NOTE finish to check delete if favorite notification
          // NOTE start to check delete favorite collection

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
              }
            })
            .catch(() => {
              res.status(501).json({ errorMessage: "Search Error" });
            });
          // NOTE finish to check delete favorite collection
        }
        // REVIEWED 3 finish to check
        else {
          res.status(404).json({ errorMessage: "Post not found!" });
        }
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
