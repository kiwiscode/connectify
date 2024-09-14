const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Activity = require("../models/Activity.model");

const handleRepost = (req, res) => {
  const { postId } = req.body;
  const { userId } = req.body;

  User.findById(userId)
    .then((user) => {
      Post.findById(postId)
        .populate("reposted")
        .then((post) => {
          Activity.create({
            activityHasBeenInitiatedWith: post.userId.toString(),
            thePersonWhoCarriedOutTheActivity: user._id.toString(),
            activityType: "repost",
            relatedPost: post._id.toString(),
            relatedPostOption2: post.isReposted
              ? post.repostedFromThisOriginalPost[0]._id.toString()
              : post.isComment
              ? post.commentedForThisPost._id.toString()
              : post._id.toString(),
          });
          // notification ekleme start to check
          // user kendisine notification gönderemez !
          if (post.userId.toString() !== userId) {
            User.findById(post.userId.toString())
              .then((notifiedUser) => {
                const newNotification = {
                  post: post._id,
                  notificationReceiver: post.userId,
                  notificationSender: userId,
                  isRepost: {
                    value: true,
                    profileImageUrl: user.imageUrl,
                    senderId: userId,
                    userUserName: user.username,
                    repostedPostContent: post.content,
                  },
                };

                notifiedUser.notifications.unshift(newNotification);
                notifiedUser.save();
              })
              .catch(() => {});
          } else {
          }
          // notification ekleme finish to check

          // eğer repost edilen post comment ise onu comment collectionunda bul ve ayrıca repostlarına userı ekle start to check

          if (post.isComment) {
            Comment.find({ postId: post._id.toString() })
              .then((commentFromDataBase) => {
                commentFromDataBase[0].reposted.push(userId);
                commentFromDataBase[0].save();
              })
              .catch((error) => {
                console.log("Error =>", error);
              });
          }
          // eğer repost edilen post comment ise onu comment collectionunda bul ve ayrıca repostlarına userı ekle finish to check
          const reposterUserIds = post.reposted.map((element) => {
            return element._id.toString();
          });

          const userPostsIds = user.posts.map((element) => {
            return element._id.toString();
          });

          console.log("POST OWNER WHO WILL NOTIFY=>", post.userId.toString());
          console.log("REPOSTER USER =>", user._id.toString());
          const userRepostIds = user.reposts.map((element) => {
            return element._id.toString();
          });
          if (
            !post.reposted.length &&
            !post.isReposted &&
            !post.repostedFromThisOriginalPost.length &&
            !reposterUserIds.includes(userId)
          ) {
            post.reposted.unshift(userId);
            post.save();

            // else {
            //   console.log(
            //     "NOTIFICATION RECEIVER NOT INFORMED ABOUT HIS POST GOT REPOST BECAUSE HE IS THE PERSON WHO REPOSTED HIS POST !"
            //   );
            // }

            return Post.create({
              userId: post.userId,
              authorFullName: post.authorFullName,
              authorUserName: post.authorUserName,
              content: post.content,
              bookmarks: post.bookmarks,
              image: {
                public_id: post.image.public_id,
                url: post.image.url,
              },
              comments: post.comments,
              isReposted: true,
              reposted: post.reposted,
              repostedFromThisOriginalPost: postId,
              likes: post.likes,
              isComment: post.isComment ? true : false,
              commentedForThisPost: post.isComment
                ? post.commentedForThisPost
                : null,
              commentedForThisUsersPost: post.isComment
                ? post.commentedForThisUsersPost
                : null,
            })

              .then((createdPost) => {
                return Post.populate(createdPost, [
                  { path: "userId", model: "User" },
                  { path: "reposted", model: "Post" },
                  { path: "repostedFromThisOriginalPost", model: "Post" },
                ]);
              })
              .then((populatedPost) => {
                // Popüle edilmiş post işlemleri
                // populatedPost.reposted.unshift(userId);
                user.posts.unshift(populatedPost._id);
                user.save();
                res.status(200).json({ newPost: populatedPost });
              })

              .catch((error) => {
                res.status(500).json({
                  errorMessage:
                    "Error occured while trying to fetch created post after repost process.",
                });
              });
          } else if (post.isReposted === true) {
            post.reposted.unshift(userId);
            post.save();
            user.posts.unshift(postId);

            user.save();
            Post.findById(post.repostedFromThisOriginalPost[0].toString())
              .then((post) => {
                post.reposted.unshift(userId);
                post.save();
                res.status(200).json({ newPost: post });
              })
              .catch((error) => {
                console.log(error);
              });
          }
          // start to check
          else if (
            post.isReposted === false &&
            !reposterUserIds.includes(userId) &&
            reposterUserIds.length
          ) {
            // INFO
            post.reposted.unshift(userId);
            post.save();

            console.log(
              "This line is working ! This post reposted from other users but not from active user"
            );

            Post.find({ repostedFromThisOriginalPost: postId })
              .populate("reposted")
              .populate("userId")
              .populate("repostedFromThisOriginalPost")
              .then((post) => {
                // INFO

                console.log(
                  "Here is the new post current reposted state =>",
                  post[0].reposted[0]
                );
                console.log(
                  "Here is the id that we are pushing in reposted array =>",
                  userId
                );

                post[0].reposted.unshift(user);
                post[0].save();
                console.log(
                  "Here is the updated post current reposted state =>",
                  post[0].reposted[0]
                );

                user.posts.unshift(post[0]._id);
                user.save();

                res.status(200).json({ newPost: post[0] });
              })
              .catch((error) => {
                console.log(error);
                console.log("ERROR");
              });
          }
          // finish to check
          else if (reposterUserIds.includes(userId)) {
            res
              .status(500)
              .json({ errorMessage: "You already reposted this post!" });
          } else {
            res
              .status(404)
              .json({ errorMessage: "Error already reposted this post!" });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(501).json({
            errorMessage: "Error occured while trying to repost post!",
          });
        });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

const handleDeleteReposts = (req, res) => {
  const { postId } = req.body;
  const { userId } = req.body;

  Post.findById(postId)
    .then((post) => {
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
      Activity.findOneAndDelete({
        $and: [
          { activityType: "repost" },
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
      })
        .then((result) => {
          if (result) {
            console.log("Activity deleted successfully:", result);
          } else {
            console.log("Document not found!");
          }
        })
        .catch((error) => {
          console.error("Error occurred while deleting document:", error);
        });
      // activityi sil ! finish to check
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
                        notification.notificationSender.toString() === userId &&
                        notification.isRepost.value
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
                        notification.notificationSender.toString() === userId &&
                        notification.isRepost.value
                      );
                    }
                  );

                  const notificationIndex =
                    notifiedUser.notifications.indexOf(notification);

                  notifiedUser.notifications.splice(notificationIndex, 1);
                  notifiedUser.save();
                })
                .catch(() => {
                  console.log(
                    "Original post id inside catch =>",
                    originalPostId
                  );
                });

              // belki doesRepostedLength olabilir check et finish to check
            } else {
            }
          })
          .catch(() => {});
      }
      // notified olması mümkün olan kullanıcıdan notificationı silme veya bırakma işlemi finish to check

      if (post.isComment) {
        Comment.find({ postId: post._id })
          .then((commentFromDataBase) => {
            // splice the user id from comment start to check

            const newRepostedArray = commentFromDataBase[0]?.reposted.filter(
              (eachLiker) => {
                return eachLiker._id.toString() !== userId;
              }
            );

            if (commentFromDataBase[0]) {
              commentFromDataBase[0].reposted = newRepostedArray;
              commentFromDataBase[0].save();
            }

            // splice the user id from comment finish to check
          })
          .catch((error) => {
            console.log("Error =>", error);
          });
      }

      if (!post.isReposted) {
        const filteredPostArray = post.reposted.filter((element) => {
          return element.toString() !== userId;
        });
        post.reposted = filteredPostArray;
        post.save();
        Post.find({ repostedFromThisOriginalPost: postId })
          .then((findedPost) => {
            return findedPost;
          })
          .then((repostedPost) => {
            User.findById(userId)
              .then((user) => {
                const filteredUserPostsArray = user.posts.filter((element) => {
                  return element.toString() !== repostedPost[0]._id.toString();
                });

                // NOTE start to check delete repost notification

                // NOTE finish to check delete repost notification
                user.posts = filteredUserPostsArray;
                user.save();
                console.log("This line is working 1 =>");
              })
              .catch((error) => {
                console.log(error);

                res.status(404).json({ errorMessage: "User not found!" });
              });

            const referencePostReposterIds = repostedPost[0].reposted.map(
              (element) => {
                return element.toString();
              }
            );
            console.log("This line is working 1.1 =>");

            if (
              referencePostReposterIds.includes(userId) &&
              referencePostReposterIds.length > 1
            ) {
              const filteredRepostedPost = repostedPost[0].reposted.filter(
                (element) => {
                  return element.toString() !== userId;
                }
              );
              repostedPost[0].reposted = filteredRepostedPost;
              repostedPost[0].save();
              console.log("This line is working 1.2 =>");

              res.status(200).json({
                message: "Repost deleted from your profile successfully",
              });
            } else if (
              referencePostReposterIds.includes(userId) &&
              referencePostReposterIds.length === 1
            ) {
              Post.findByIdAndDelete(repostedPost[0]._id.toString())
                .then(() => {
                  console.log("This line is working 1.3 =>");
                  res.status(200).json({
                    message:
                      "Repost deleted from your profile and posts collection successfully",
                  });
                })
                .catch((error) => {
                  console.log(
                    "ERROR OCCURED WHILE DELETING THE POST => ",
                    error
                  );
                });
            }
          })

          .catch(() => {
            res.status(404).json({
              errorMessage:
                "Reposted from this original post id is not working!",
            });
          });
      } else if (post.isReposted) {
        const filteredPostArray = post.reposted.filter((element) => {
          return element.toString() !== userId;
        });
        if (
          post.reposted[0].toString() === userId &&
          post.reposted.length === 1
        ) {
          Post.find({ _id: post.repostedFromThisOriginalPost[0].toString() })
            .then((originalPost) => {
              originalPost[0].reposted = filteredPostArray;
              originalPost[0].save();
            })
            .catch((error) => {
              console.log(error);
              res.json("Original post not found!");
            });

          Post.findByIdAndDelete(post._id)
            .then(() => {
              User.findById(userId)
                .then((user) => {
                  const filteredUserPostsArray = user.posts.filter(
                    (element) => {
                      return element.toString() !== postId;
                    }
                  );

                  // NOTE start to check delete if repost notification readed

                  // NOTE finish to check delete if repost notification readed
                  user.posts = filteredUserPostsArray;
                  user.save();
                  res.status(200).json({
                    message:
                      "Reposted post and original post deleted from your profile and posts collection successfully",
                  });
                })
                .catch((error) => {
                  console.log(error);

                  res.json("USER NOT FOUND!");
                });
            })
            .catch((error) => {
              console.log(error);
              res.json("ERROR OCCURED WHILE DELETING THE POST FROM COLLECTION");
            });
        } else if (post.reposted.length > 1) {
          console.log("LINE IS WORKING 2 ", post.reposted);

          User.findById(userId)
            .then((user) => {
              const filteredUserPostsArray = user.posts.filter((element) => {
                return element.toString() !== postId;
              });
              post.reposted = filteredPostArray;

              post.save();
              // NOTE start to check delete if repost notification readed

              // NOTE finish to check delete if repost notification readed
              user.posts = filteredUserPostsArray;
              user.save();
              console.log("This line is working 3 =>");

              // let's find original array
              Post.find({
                _id: post.repostedFromThisOriginalPost[0].toString(),
              })
                .then((originalPost) => {
                  console.log("Original Post =>", originalPost);
                  const filteredOriginalPostArray =
                    originalPost[0].reposted.filter((element) => {
                      return element.toString() !== userId;
                    });

                  originalPost[0].reposted = filteredOriginalPostArray;
                  originalPost[0].save();
                })
                .catch((error) => {
                  console.log(
                    "Error occured while fetching the original post",
                    error
                  );
                });

              res.status(200).json({
                message: "Repost deleted from your profile successfully",
              });
            })
            .catch((error) => {
              console.log(error);
              res.json("USER NOT FOUND!");
            });
        }
      }
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "Post not found 1!" });
    });
};

module.exports = {
  handleRepost,
  handleDeleteReposts,
};
