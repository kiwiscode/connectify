const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");
const Comment = require("../models/Comment.model");
const cloudinary = require("../utils/cloudinary");
const handlePost = (req, res) => {
  const { content, image, modalImage } = req.body;
  const { userId } = req.user;

  User.findById(userId)
    .populate("posts")
    .populate("favorites")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("THIS LINE IS WORKING 1 ", user);

      // start to check

      if (image || modalImage) {
        cloudinary.uploader
          .upload(image || modalImage, {
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
            height: 1000,
            crop: "limit",
          })
          .then((result) => {
            return Post.create({
              userId: userId,
              authorFullName: user.fullname,
              authorUserName: user.username,
              content,
              image: {
                public_id: result.public_id,
                url: result.secure_url,
              },
            });
          })
          .then((post) => {
            user.posts.unshift(post);
            console.log("THIS LINE IS WORKING 2 ", post);
            return user.save().then(() => {
              res.status(200).json({ message: "Post added successfully." });
            });
          })
          .catch((error) => {
            console.log(error);
          });
        // finish to check
      } else if (!image || !modalImage) {
        return Post.create({
          userId: userId,
          authorFullName: user.fullname,
          authorUserName: user.username,
          content,
        })
          .then((post) => {
            user.posts.unshift(post);
            console.log("THIS LINE IS WORKING 2 ", post);
            return user.save().then(() => {
              res.status(200).json({ message: "Post added successfully." });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: "Error finding user", error });
    });
};
const handleShowPosts = (req, res) => {
  const { userId } = req.user;

  Post.find()
    // IMPORTANT
    // start to check
    .sort({ createdAt: -1 })
    // finish to check
    .populate("likes")
    .populate("userId")
    .populate("reposted")
    .populate("repostedFromThisOriginalPost")
    .populate("commentedForThisPost")
    .populate("commentedForThisUsersPost")
    .then((postsFromDataBase) => {
      console.log("ACTIVE USER => ", userId);
      console.log("HELLO WORLD!");
      res.json(postsFromDataBase);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ errorMessage: "An error occurred while fetching posts" });
    });
};

const handleDeletePost = (req, res) => {
  const { userId, postId } = req.body;

  User.findById(userId)
    .populate("posts")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      // STARTING WITH POST DELETING PROCESS
      Post.findById(postId)
        .then((post) => {
          if (post.isReposted) {
            // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array
            // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination
            User.find({
              $or: [
                {
                  favorites: {
                    $in: [
                      postId,
                      post.repostedFromThisOriginalPost[0]._id.toString(),
                    ],
                  },
                },
                {
                  "posts._id": {
                    $in: [
                      postId,
                      post.repostedFromThisOriginalPost[0]._id.toString(),
                    ],
                  },
                },
              ],
            })
              .then((users) => {
                const promises = [];

                for (let i = 0; i < users.length; i++) {
                  if (users[i]._id.toString() !== userId) {
                    // favorites array'inden postId veya repostedId'ye eşit olanları filtrele
                    users[i].favorites = users[i].favorites.filter(
                      (favoriteId) => {
                        return (
                          favoriteId.toString() !== postId &&
                          favoriteId.toString() !==
                            post.repostedFromThisOriginalPost[0]._id.toString()
                        );
                      }
                    );

                    // posts array'inden postId veya repostedId'ye eşit olanları filtrele
                    users[i].posts = users[i].posts.filter((postItem) => {
                      return (
                        postItem._id.toString() !== postId &&
                        postItem._id.toString() !==
                          post.repostedFromThisOriginalPost[0]._id.toString()
                      );
                    });

                    // Kullanıcının favori ve post listelerini güncelle ve save metoduyla kaydet
                    promises.push(
                      users[i]
                        .save()
                        .then(() => {
                          console.log(
                            `Favorites and posts updated for user ${users[i]._id}`
                          );
                        })
                        .catch((error) => {
                          console.log(
                            `Error updating favorites and posts for user ${users[i]._id}: ${error}`
                          );
                        })
                    );
                  }
                }

                // Tüm kullanıcıların favori ve post listelerini güncelledikten sonra Promise.all ile bekleyelim
                return Promise.all(promises);
              })
              .then(() => {
                console.log(
                  "Favorites and posts deleted from all users except the active user."
                );
              })
              .catch((error) => {
                console.log(
                  `Error finding users with the specified favorites and posts: ${error}`
                );
              });

            // this postId should filtered from all the users favorites and posts array ! So then we can delete the post itself after delete from every user's favorites array
            // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination

            Post.findByIdAndDelete(post._id)
              .then(() => {
                Post.findByIdAndDelete(
                  post.repostedFromThisOriginalPost[0]._id.toString()
                )
                  .then((deletedOriginalPost) => {
                    // start to check
                    if (deletedOriginalPost.isComment) {
                      console.log("Post id =>", postId);
                      Comment.findOneAndDelete({
                        postId: deletedOriginalPost._id.toString(),
                      })
                        .then((deletedComment) => {
                          if (deletedComment) {
                            Post.findById(
                              deletedComment.commentedForThisPost._id.toString()
                            )
                              .then((commentedForThisPost) => {
                                const filteredCommentsArray =
                                  commentedForThisPost.comments.filter(
                                    (eachComment) => {
                                      return (
                                        eachComment._id.toString() !==
                                        deletedComment._id.toString()
                                      );
                                    }
                                  );
                                console.log(
                                  "Deleted comment id =>",
                                  deletedComment._id.toString()
                                );
                                commentedForThisPost.comments =
                                  filteredCommentsArray;
                                commentedForThisPost.save();
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          } else {
                            console.log("Comment not found");
                          }
                        })
                        .catch((error) => {
                          console.log("Error =>", error);
                        });
                    }
                    // finish to check
                    // STARTING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION

                    Favorite.deleteMany({
                      $or: [
                        { postId: postId },
                        {
                          postId:
                            post.repostedFromThisOriginalPost[0]._id.toString(),
                        },
                      ],
                    })
                      .then((response) => {
                        console.log(response);
                        // burada findOne hatalı olabilir
                        res.status(200);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    // FINISHING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION

                    console.log("POSTS ARE DELETED FROM POST COLLECTION !");

                    console.log(
                      "Orjinal post id =>",
                      post.repostedFromThisOriginalPost[0]._id.toString()
                    );
                    console.log("Reference post id =>", post._id.toString());
                    console.log("Users post array =>", user.posts);
                    const filteredPostArr = user.posts.filter(
                      (eachPost) =>
                        eachPost._id.toString() !== postId &&
                        eachPost._id.toString() !==
                          post.repostedFromThisOriginalPost[0]._id.toString()
                    );
                    const filteredFavoriteArr = user.favorites.filter(
                      (eachFavorite) =>
                        eachFavorite._id.toString() !==
                        post.repostedFromThisOriginalPost[0]._id.toString()
                    );

                    if (filteredFavoriteArr) {
                      user.favorites = filteredFavoriteArr;
                    }
                    user.posts = filteredPostArr;
                    user.save();
                    console.log("Users post array =>", user.posts);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch(() => {
                res.status(404).json("Post not found!");
              });
          } else if (!post.isReposted) {
            if (post.reposted.length !== 0) {
              if (post.isComment) {
                console.log("Post id =>", postId);
                Comment.findOneAndDelete({ postId: postId })
                  .then((deletedComment) => {
                    if (deletedComment) {
                      Post.findById(
                        deletedComment.commentedForThisPost._id.toString()
                      )
                        .then((commentedForThisPost) => {
                          const filteredCommentsArray =
                            commentedForThisPost.comments.filter(
                              (eachComment) => {
                                return (
                                  eachComment._id.toString() !==
                                  deletedComment._id.toString()
                                );
                              }
                            );
                          console.log(
                            "Deleted comment id =>",
                            deletedComment._id.toString()
                          );
                          commentedForThisPost.comments = filteredCommentsArray;
                          commentedForThisPost.save();
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    } else {
                      console.log("Comment not found");
                    }
                  })
                  .catch((error) => {
                    console.log("Error =>", error);
                  });
              }

              Post.findByIdAndDelete(post._id)
                .then((response) => {
                  console.log("Here is working 1");

                  console.log("Response line 294 =>", response);
                  Post.find({
                    repostedFromThisOriginalPost: {
                      $elemMatch: {
                        $eq: post._id,
                      },
                    },
                  })
                    .then((referencePost) => {
                      console.log("Here is working 2", referencePost);

                      // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array
                      // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination
                      User.find({
                        $or: [
                          {
                            favorites: {
                              $in: [postId, referencePost[0]._id.toString()],
                            },
                          },
                          {
                            "posts._id": {
                              $in: [postId, referencePost[0]._id.toString()],
                            },
                          },
                        ],
                      })
                        .then((users) => {
                          const promises = [];

                          for (let i = 0; i < users.length; i++) {
                            if (users[i]._id.toString() !== userId) {
                              // favorites array'inden postId veya repostedId'ye eşit olanları filtrele
                              users[i].favorites = users[i].favorites.filter(
                                (favoriteId) => {
                                  return (
                                    favoriteId.toString() !== postId &&
                                    favoriteId.toString() !==
                                      referencePost[0]._id.toString()
                                  );
                                }
                              );

                              // posts array'inden postId veya repostedId'ye eşit olanları filtrele
                              users[i].posts = users[i].posts.filter(
                                (postItem) => {
                                  return (
                                    postItem._id.toString() !== postId &&
                                    postItem._id.toString() !==
                                      referencePost[0]._id.toString()
                                  );
                                }
                              );

                              // Kullanıcının favori ve post listelerini güncelle ve save metoduyla kaydet
                              promises.push(
                                users[i]
                                  .save()
                                  .then(() => {
                                    console.log(
                                      `Favorites and posts updated for user ${users[i]._id}`
                                    );
                                  })
                                  .catch((error) => {
                                    console.log(
                                      `Error updating favorites and posts for user ${users[i]._id}: ${error}`
                                    );
                                  })
                              );
                            }
                          }
                          console.log("Here is working 3");

                          // Tüm kullanıcıların favori ve post listelerini güncelledikten sonra Promise.all ile bekleyelim
                          return Promise.all(promises);
                        })
                        .then(() => {
                          console.log(
                            "Favorites and posts deleted from all users except the active user."
                          );
                        })
                        .catch((error) => {
                          console.log(
                            `Error finding users with the specified favorites and posts: ${error}`
                          );
                        });

                      // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array
                      // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination

                      // STARTING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION
                      Favorite.deleteMany({
                        $or: [
                          { postId: postId },
                          { postId: referencePost[0]._id.toString() },
                        ],
                      })
                        .then(() => {
                          console.log("Here is working 4");
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                      // FINISHING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION
                      const filteredPostArr = user.posts.filter(
                        (eachPost) =>
                          eachPost._id.toString() !== postId &&
                          eachPost._id.toString() !==
                            referencePost[0]._id.toString()
                      );
                      const filteredFavoriteArr = user.favorites.filter(
                        (eachFavorite) =>
                          eachFavorite._id.toString() !==
                            referencePost[0]._id.toString() &&
                          eachFavorite._id.toString() !== postId
                      );
                      user.posts = filteredPostArr;
                      if (filteredFavoriteArr) {
                        user.favorites = filteredFavoriteArr;
                      }
                      user.save();
                      console.log("Here is working 5");

                      Post.findByIdAndDelete(referencePost[0]._id)
                        .then(() => {
                          console.log(
                            "POSTS ARE DELETED FROM POST COLLECTION !"
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log("Error =>", error);
                  res.status(404).json("Post not found!");
                });
            } else {
              if (post.isComment) {
                console.log("Post id =>", postId);
                Comment.findOneAndDelete({ postId: postId })
                  .then((deletedComment) => {
                    if (deletedComment) {
                      Post.findById(
                        deletedComment.commentedForThisPost._id.toString()
                      )
                        .then((commentedForThisPost) => {
                          const filteredCommentsArray =
                            commentedForThisPost.comments.filter(
                              (eachComment) => {
                                return (
                                  eachComment._id.toString() !==
                                  deletedComment._id.toString()
                                );
                              }
                            );
                          console.log(
                            "Deleted comment id =>",
                            deletedComment._id.toString()
                          );
                          commentedForThisPost.comments = filteredCommentsArray;
                          commentedForThisPost.save();
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    } else {
                      console.log("Comment not found");
                    }
                  })
                  .catch((error) => {
                    console.log("Error =>", error);
                  });
              }
              // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array
              // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination
              User.find({
                $or: [
                  {
                    favorites: {
                      $in: [postId, post._id.toString()],
                    },
                  },
                  {
                    "posts._id": {
                      $in: [postId, post._id.toString()],
                    },
                  },
                ],
              })
                .then((users) => {
                  const promises = [];

                  for (let i = 0; i < users.length; i++) {
                    if (users[i]._id.toString() !== userId) {
                      // favorites array'inden postId veya repostedId'ye eşit olanları filtrele
                      users[i].favorites = users[i].favorites.filter(
                        (favoriteId) => {
                          return (
                            favoriteId.toString() !== postId &&
                            favoriteId.toString() !== post._id.toString()
                          );
                        }
                      );

                      // posts array'inden postId veya repostedId'ye eşit olanları filtrele
                      users[i].posts = users[i].posts.filter((postItem) => {
                        return (
                          postItem._id.toString() !== postId &&
                          postItem._id.toString() !== post._id.toString()
                        );
                      });

                      // Kullanıcının favori ve post listelerini güncelle ve save metoduyla kaydet
                      promises.push(
                        users[i]
                          .save()
                          .then(() => {
                            console.log(
                              `Favorites and posts updated for user ${users[i]._id}`
                            );
                          })
                          .catch((error) => {
                            console.log(
                              `Error updating favorites and posts for user ${users[i]._id}: ${error}`
                            );
                          })
                      );
                    }
                  }
                  console.log("Here is working 3");

                  // Tüm kullanıcıların favori ve post listelerini güncelledikten sonra Promise.all ile bekleyelim
                  return Promise.all(promises);
                })
                .then(() => {
                  console.log(
                    "Favorites and posts deleted from all users except the active user."
                  );
                })
                .catch((error) => {
                  console.log(
                    `Error finding users with the specified favorites and posts: ${error}`
                  );
                });

              // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array
              // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination

              Post.findByIdAndDelete(post._id)
                .then(() => {
                  // STARTING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION
                  Favorite.deleteOne({
                    postId: post._id,
                  })
                    .then((response) => {
                      console.log(response);
                      // burada findOne hatalı olabilir
                      res.status(200);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  // FINISHING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION

                  const filteredPostArr = user.posts.filter(
                    (eachPost) => eachPost._id.toString() !== postId
                  );
                  const filteredFavoriteArr = user.favorites.filter(
                    (eachFavorite) => eachFavorite._id.toString() !== postId
                  );
                  user.posts = filteredPostArr;
                  if (filteredFavoriteArr) {
                    user.favorites = filteredFavoriteArr;
                  }
                  user.save();
                })
                .catch(() => {});
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // FINISHING WITH POST DELETE PROCESS
      console.log("This line is working 3 ");

      return user.save().then(() => {
        console.log("This line is working 4 ");

        res.status(200).json({
          message:
            "Post deleted from post model,user posts array (and favorites ?)",
        });
      });
    })
    .catch(() => {
      res.status(404).json("User Not Found");
    });
};

module.exports = {
  handlePost,
  handleShowPosts,
  handleDeletePost,
};
