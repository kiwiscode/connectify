const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");
const Comment = require("../models/Comment.model");
const cloudinary = require("../utils/cloudinary");
const { deleteComment } = require("./commentController");
const Activity = require("../models/Activity.model");
const Bookmark = require("../models/Bookmark.model");
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
            return user.save().then(() => {
              res.status(200).json({ createdPost: post });
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
            return user.save().then(() => {
              res.status(200).json({ createdPost: post });
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
    .populate("bookmarks")
    .populate("userId")
    .populate("reposted")
    .populate("repostedFromThisOriginalPost")
    .populate("commentedForThisPost")
    .populate("commentedForThisUsersPost")
    .then((postsFromDataBase) => {
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
        .populate("userId")
        .then((post) => {
          // bookmarks var ise bookmarks collectiondan ve userların bookmarkslarından da sil start to check
          Bookmark.find({
            bookmarkedPost:
              !post.isReposted && !post.reposted.length
                ? postId
                : post.isReposted
                ? post.repostedFromThisOriginalPost[0]._id.toString()
                : !post.isReposted && post.reposted.length
                ? post._id
                : null,
          })
            .then((bookmarks) => {
              if (bookmarks.length > 0) {
                const bookmarkIds = bookmarks.map((bookmark) => bookmark._id);

                Bookmark.deleteMany({ _id: { $in: bookmarkIds } })
                  .then(() => {
                    console.log("Deleted from the bookmarks collection.");

                    User.updateMany(
                      { bookmarks: { $in: bookmarkIds } },
                      { $pull: { bookmarks: { $in: bookmarkIds } } }
                    )
                      .then((result) => {
                        console.log(
                          "Removed from users' bookmarks arrays:",
                          result
                        );
                      })
                      .catch((error) => {
                        console.error(
                          "An error occurred while updating users' bookmarks arrays:",
                          error
                        );
                      });
                  })
                  .catch((error) => {
                    console.error(
                      "An error occurred while finding bookmarks:",
                      error
                    );
                  });
              } else {
                console.log("Bookmark to delete not found.");
              }
            })
            .catch((error) => {
              console.error(
                "An error occurred while finding bookmarks:",
                error
              );
            });

          // bookmarks var ise bookmarks collectiondan ve userların bookmarkslarından da sil finish to check
          // activityi sil ! start to check
          if (post.isComment && post.isReposted) {
            console.log("Hangi condition çalıştırıcaksın ??");
          } else if (post.isComment) {
            console.log("First or second condition works");
          } else if (post.isReposted) {
            console.log("Third or fourth condition works");
          } else {
            console.log("Fifth or sixth condition works");
          }
          const deleteActivityByType = async (activityType) => {
            return await Activity.findOneAndDelete({
              $and: [
                { activityType },
                {
                  $or: [
                    {
                      relatedPost: post.isComment
                        ? post.commentedForThisPost?._id.toString()
                        : null,
                    },
                    {
                      relatedPostOption2: post.isComment
                        ? post.commentedForThisPost?._id.toString()
                        : null,
                    },
                    {
                      relatedPost: post.isReposted
                        ? post.repostedFromThisOriginalPost[0]?._id.toString()
                        : null,
                    },
                    {
                      relatedPostOption2: post.isReposted
                        ? post.repostedFromThisOriginalPost[0]?._id.toString()
                        : null,
                    },
                    {
                      relatedPost: post._id.toString(),
                    },
                    {
                      relatedPostOption2: post._id.toString(),
                    },
                  ],
                },
              ],
            });
          };
          deleteActivityByType("favorite")
            .then((result) => {
              if (result) {
                console.log("Favorite activity deleted successfully:", result);
              } else {
                console.log("No favorite activity found!");
              }
              return deleteActivityByType("repost");
            })
            .then((result) => {
              if (result) {
                console.log("Repost activity deleted successfully:", result);
              } else {
                console.log("No repost activity found!");
              }
              return deleteActivityByType("comment");
            })
            .then((result) => {
              if (result) {
                console.log("Comment activity deleted successfully:", result);
              } else {
                console.log("No comment activity found!");
              }
            })
            .catch((error) => {
              console.error("Error occurred while deleting activities:", error);
            });
          // activityi sil ! finish to check

          console.log(
            "Owner post id =>",
            post?.userId?.toString(),
            post?.userId?.username
          );
          if (userId !== post.userId.toString()) {
            console.log("Buradayız 1!!!");

            // notified olması mümkün olan kullanıcıdan notificationı silme veya bırakma işlemi start to check
            const isComment = post.isComment;
            const isReposted = post.isReposted;
            const doesRepostedLength = post.reposted.length;

            if (isComment) {
              console.log("Buradayız 2!!!");

              const commentedForThisPost =
                post.commentedForThisPost._id.toString();
              User.findById(post.commentedForThisUsersPost.toString())
                .then((notifiedUser) => {
                  if (isReposted) {
                    Post.findById(
                      post.repostedFromThisOriginalPost[0].toString()
                    )
                      .then((originalPost) => {
                        console.log("Şimdi de buradayız !!!", originalPost);
                        const notification = notifiedUser.notifications.find(
                          (notification) => {
                            return (
                              (notification.post.toString() ===
                                commentedForThisPost ||
                                notification.post.toString() ===
                                  originalPost.commentedForThisPost._id.toString()) &&
                              notification.notificationSender.toString() ===
                                userId &&
                              notification.isComment.value
                            );
                          }
                        );

                        const notificationIndex =
                          notifiedUser.notifications.indexOf(notification);

                        console.log("Notification =>", notification);
                        console.log("Notification index =>", notificationIndex);
                        notifiedUser.notifications.splice(notificationIndex, 1);
                        notifiedUser.save();
                      })
                      .catch(() => {});
                  } else if (
                    (doesRepostedLength || !doesRepostedLength) &&
                    !isReposted
                  ) {
                    console.log("Buradayız 3!!!");

                    // belki doesRepostedLength olabilir check et start to check
                    Post.find({ repostedFromThisOriginalPost: postId })
                      .then((referencePost) => {
                        const notification = notifiedUser.notifications.find(
                          (notification) => {
                            return (
                              (notification.post.toString() ===
                                commentedForThisPost ||
                                notification.post.toString() ===
                                  referencePost[0].commentedForThisPost._id.toString()) &&
                              notification.notificationSender.toString() ===
                                userId &&
                              notification.isComment.value
                            );
                          }
                        );

                        const notificationIndex =
                          notifiedUser.notifications.indexOf(notification);

                        notifiedUser.notifications.splice(notificationIndex, 1);

                        notifiedUser
                          .updateOne({
                            notifications: notifiedUser.notifications,
                          })
                          .then(() => {
                            console.log("Notifications updated successfully.");
                          })
                          .catch((error) => {
                            console.error(
                              "Error updating notifications:",
                              error
                            );
                          });
                      })
                      .catch(() => {
                        const notification = notifiedUser.notifications.find(
                          (notification) => {
                            return (
                              notification.post.toString() ===
                                commentedForThisPost &&
                              notification.notificationSender.toString() ===
                                userId &&
                              notification.isComment.value
                            );
                          }
                        );

                        const notificationIndex =
                          notifiedUser.notifications.indexOf(notification);

                        notifiedUser.notifications.splice(notificationIndex, 1);

                        notifiedUser
                          .updateOne({
                            notifications: notifiedUser.notifications,
                          })
                          .then(() => {
                            console.log(
                              "Notifications updated successfully 2."
                            );
                          })
                          .catch((error) => {
                            console.error(
                              "Error updating notifications:",
                              error
                            );
                          });
                      });

                    // belki doesRepostedLength olabilir check et finish to check
                  } else {
                  }
                })
                .catch(() => {});
            }
          }
          // notified olması mümkün olan kullanıcıdan notificationı silme veya bırakma işlemi finish to check

          if (post.isReposted) {
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
                res.status(200);
              })
              .catch((error) => {
                res.status(501);
              });

            Post.findByIdAndDelete(post._id)
              .then(() => {
                Post.findByIdAndDelete(
                  post.repostedFromThisOriginalPost[0]._id.toString()
                )
                  .then((deletedOriginalPost) => {
                    // start to check
                    if (deletedOriginalPost.isComment) {
                      Comment.findOneAndDelete({
                        postId: deletedOriginalPost._id.toString(),
                      })
                        .then((deletedComment) => {
                          // filter main comment comments array from this comment
                          Comment.find({ comments: deletedComment._id })
                            .then((parentComment) => {
                              const newCommentsArrayForParentComment =
                                parentComment[0]
                                  ? parentComment[0].comments.filter(
                                      (eachComment) => {
                                        return (
                                          eachComment._id.toString() !==
                                          deletedComment._id.toString()
                                        );
                                      }
                                    )
                                  : null;
                              parentComment[0]
                                ? (parentComment[0].comments =
                                    newCommentsArrayForParentComment)
                                : null;
                              parentComment[0] ? parentComment[0].save() : null;
                            })
                            .catch((error) => {
                              console.log("Error =>", error);
                            });

                          if (deletedComment) {
                            Post.findById(
                              deletedComment.commentedForThisPost._id.toString()
                            )
                              .then((commentedForThisPost) => {
                                if (
                                  commentedForThisPost?.reposted.length === 0
                                ) {
                                  const filteredCommentsArray =
                                    commentedForThisPost?.comments.filter(
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
                                  if (commentedForThisPost) {
                                    commentedForThisPost.comments =
                                      filteredCommentsArray;

                                    commentedForThisPost.save();
                                  }
                                } else {
                                  if (commentedForThisPost.isReposted) {
                                    console.log(
                                      "We are here right now xXxXxXx -----"
                                    );
                                    // look for original post to filter comments array also start to check
                                    Post.find({
                                      _id: commentedForThisPost.repostedFromThisOriginalPost[0].toString(),
                                    })
                                      .then((originalPost) => {
                                        console.log(
                                          "original post =>",
                                          originalPost
                                        );
                                        const filteredCommentsArray =
                                          originalPost[0].comments.filter(
                                            (eachComment) => {
                                              return (
                                                eachComment._id.toString() !==
                                                deletedComment._id.toString()
                                              );
                                            }
                                          );
                                        originalPost[0].comments =
                                          filteredCommentsArray;
                                        originalPost[0].save();
                                      })
                                      .catch((error) => {
                                        console.log("Error =>", error);
                                      });
                                    // look for original post to filter comments array also finish to check
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
                                  } else {
                                    console.log(
                                      "We are here right now yYyYyYy -----"
                                    );
                                    // look for reference post to filter comments array also start to check
                                    Post.find({
                                      repostedFromThisOriginalPost:
                                        commentedForThisPost._id.toString(),
                                    })
                                      .then((referencePost) => {
                                        const filteredCommentsArray =
                                          referencePost[0].comments.filter(
                                            (eachComment) => {
                                              return (
                                                eachComment._id.toString() !==
                                                deletedComment._id.toString()
                                              );
                                            }
                                          );
                                        referencePost[0].comments =
                                          filteredCommentsArray;
                                        referencePost[0].save();
                                      })
                                      .catch((error) => {
                                        console.log("Error =>", error);
                                      });
                                    // look for reference post to filter comments array also finish to check
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
                                  }
                                }
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
                      .then(() => {
                        // burada findOne hatalı olabilir
                        res.status(200);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    // FINISHING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION

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
                    // filter main comment comments array from this comment
                    Comment.find({ comments: deletedComment._id })
                      .then((parentComment) => {
                        const newCommentsArrayForParentComment =
                          parentComment[0]
                            ? parentComment[0].comments.filter(
                                (eachComment) => {
                                  return (
                                    eachComment._id.toString() !==
                                    deletedComment._id.toString()
                                  );
                                }
                              )
                            : null;
                        parentComment[0]
                          ? (parentComment[0].comments =
                              newCommentsArrayForParentComment)
                          : null;
                        parentComment[0] ? parentComment[0].save() : null;
                      })
                      .catch((error) => {
                        console.log("Error =>", error);
                      });

                    if (deletedComment) {
                      Post.findById(
                        deletedComment.commentedForThisPost._id.toString()
                      )
                        .then((commentedForThisPost) => {
                          if (commentedForThisPost.reposted.length === 0) {
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
                          } else {
                            if (commentedForThisPost.isReposted) {
                              console.log("We are here right now 1 -----");
                              // look for original post to filter comments array also start to check
                              Post.find({
                                _id: commentedForThisPost.repostedFromThisOriginalPost[0].toString(),
                              })
                                .then((originalPost) => {
                                  console.log("original post =>", originalPost);
                                  const filteredCommentsArray =
                                    originalPost[0].comments.filter(
                                      (eachComment) => {
                                        return (
                                          eachComment._id.toString() !==
                                          deletedComment._id.toString()
                                        );
                                      }
                                    );
                                  originalPost[0].comments =
                                    filteredCommentsArray;
                                  originalPost[0].save();
                                })
                                .catch((error) => {
                                  console.log("Error =>", error);
                                });
                              // look for original post to filter comments array also finish to check

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
                            } else {
                              console.log("We are here right now 2 -----");

                              // look for reference post to filter comments array also start to check
                              Post.find({
                                repostedFromThisOriginalPost:
                                  commentedForThisPost._id.toString(),
                              })
                                .then((referencePost) => {
                                  const filteredCommentsArray =
                                    referencePost[0].comments.filter(
                                      (eachComment) => {
                                        return (
                                          eachComment._id.toString() !==
                                          deletedComment._id.toString()
                                        );
                                      }
                                    );
                                  referencePost[0].comments =
                                    filteredCommentsArray;
                                  referencePost[0].save();
                                })
                                .catch((error) => {
                                  console.log("Error =>", error);
                                });
                              // look for reference post to filter comments array also finish to check
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
                            }
                          }
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
                          res.status(200);
                        })
                        .catch((error) => {
                          res.status(501);
                        });

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
                Comment.findOneAndDelete({ postId: postId })
                  .then((deletedComment) => {
                    // filter main comment comments array from this comment
                    Comment.find({ comments: deletedComment._id })
                      .then((parentComment) => {
                        const newCommentsArrayForParentComment =
                          parentComment[0]
                            ? parentComment[0].comments.filter(
                                (eachComment) => {
                                  return (
                                    eachComment._id.toString() !==
                                    deletedComment._id.toString()
                                  );
                                }
                              )
                            : null;
                        parentComment[0]
                          ? (parentComment[0].comments =
                              newCommentsArrayForParentComment)
                          : null;
                        parentComment[0] ? parentComment[0].save() : null;
                      })
                      .catch((error) => {
                        console.log("Error =>", error);
                      });

                    if (deletedComment) {
                      Post.findById(
                        deletedComment.commentedForThisPost._id.toString()
                      )
                        .then((commentedForThisPost) => {
                          if (commentedForThisPost?.reposted.length === 0) {
                            const filteredCommentsArray =
                              commentedForThisPost.comments.filter(
                                (eachComment) => {
                                  return (
                                    eachComment._id.toString() !==
                                    deletedComment._id.toString()
                                  );
                                }
                              );

                            commentedForThisPost.comments =
                              filteredCommentsArray;
                            commentedForThisPost.save();
                          } else {
                            console.log(
                              "Commented for this post =>",
                              commentedForThisPost
                            );
                            if (commentedForThisPost?.isReposted) {
                              // look for original post to filter comments array also start to check
                              Post.find({
                                _id: commentedForThisPost.repostedFromThisOriginalPost[0].toString(),
                              })
                                .then((originalPost) => {
                                  const filteredCommentsArray =
                                    originalPost[0].comments.filter(
                                      (eachComment) => {
                                        return (
                                          eachComment._id.toString() !==
                                          deletedComment._id.toString()
                                        );
                                      }
                                    );
                                  originalPost[0].comments =
                                    filteredCommentsArray;
                                  originalPost[0].save();
                                })
                                .catch((error) => {
                                  console.log("Error =>", error);
                                });
                              // look for original post to filter comments array also finish to check

                              const filteredCommentsArray =
                                commentedForThisPost.comments.filter(
                                  (eachComment) => {
                                    return (
                                      eachComment._id.toString() !==
                                      deletedComment._id.toString()
                                    );
                                  }
                                );

                              commentedForThisPost.comments =
                                filteredCommentsArray;
                              commentedForThisPost.save();
                            } else {
                              // look for reference post to filter comments array also start to check
                              Post.find({
                                repostedFromThisOriginalPost:
                                  commentedForThisPost?._id.toString(),
                              })
                                .then((referencePost) => {
                                  const filteredCommentsArray =
                                    referencePost[0]?.comments.filter(
                                      (eachComment) => {
                                        return (
                                          eachComment._id.toString() !==
                                          deletedComment._id.toString()
                                        );
                                      }
                                    );
                                  if (referencePost[0]) {
                                    referencePost[0].comments =
                                      filteredCommentsArray;
                                    referencePost[0].save();
                                  }
                                })
                                .catch((error) => {
                                  console.log("Error =>", error);
                                });
                              // look for reference post to filter comments array also finish to check
                              const filteredCommentsArray =
                                commentedForThisPost?.comments.filter(
                                  (eachComment) => {
                                    return (
                                      eachComment._id.toString() !==
                                      deletedComment._id.toString()
                                    );
                                  }
                                );

                              if (commentedForThisPost) {
                                commentedForThisPost.comments =
                                  filteredCommentsArray;
                                commentedForThisPost.save();
                              }
                            }
                          }
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

                  // Tüm kullanıcıların favori ve post listelerini güncelledikten sonra Promise.all ile bekleyelim
                  return Promise.all(promises);
                })
                .then(() => {
                  console.log(
                    "Favorites and posts deleted from all users except the active user."
                  );
                  res.status(200);
                })
                .catch((error) => {
                  res.status(501);
                });

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

      return user.save().then(() => {
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
