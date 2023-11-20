const User = require("../models/User.model");
const Post = require("../models/Post.model");

const handleRepost = (req, res) => {
  const { postId } = req.body;
  const { userId } = req.body;
  console.log(postId);
  console.log(userId);
  User.findById(userId)
    .then((user) => {
      Post.findById(postId)
        .populate("reposted")
        .then((post) => {
          const reposterUserIds = post.reposted.map((element) => {
            return element._id.toString();
          });

          const userPostsIds = user.posts.map((element) => {
            return element._id.toString();
          });

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
            return Post.create({
              userId: post.userId,
              authorFullName: post.authorFullName,
              authorUserName: post.authorUserName,
              content: post.content,
              media: post.media,
              comments: post.comments,
              isReposted: true,
              reposted: post.reposted,
              repostedFromThisOriginalPost: postId,
              likes: post.likes,
            })
              .then((createdPost) => {
                console.log("CREATED POST AFTER REPOST =>", createdPost._id);

                user.posts.unshift(createdPost._id);
                user.save();
                res
                  .status(200)
                  .json({ message: "Repost Created Successfully!" });
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
                res
                  .status(200)
                  .json({ message: "Repost Created Successfully!" });
              })
              .catch((error) => {
                console.log(error);
              });
          }
          // start to check
          else if (
            post.isReposted === false &&
            !reposterUserIds.includes(userId)
          ) {
            // INFO
            post.reposted.unshift(userId);
            post.save();

            Post.find({ repostedFromThisOriginalPost: postId })
              .then((post) => {
                console.log("I am here lets go => ", post[0]._id);
                // INFO
                post[0].reposted.unshift(userId);
                post[0].save();
                user.posts.unshift(post[0]._id);
                user.save();

                res
                  .status(200)
                  .json({ message: "Repost Created Successfully!" });
              })
              .catch(() => {
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

  console.log("POST ID AND USER ID =>", postId, userId);

  Post.findById(postId)
    .then((post) => {
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
            console.log("THIS LINE IS WORKING 1 =>", repostedPost[0]._id);

            User.findById(userId)
              .then((user) => {
                const filteredUserPostsArray = user.posts.filter((element) => {
                  return element.toString() !== repostedPost[0]._id.toString();
                });
                user.posts = filteredUserPostsArray;
                user.save();
              })
              .catch(() => {
                res.status(404).json({ errorMessage: "User not found!" });
              });

            const referencePostReposterIds = repostedPost[0].reposted.map(
              (element) => {
                return element.toString();
              }
            );

            console.log("THIS LINE IS WORKING 2 =>", referencePostReposterIds);

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
              console.log("THIS LINE IS WORKING 3 =>", filteredRepostedPost);
              res.status(200).json({
                message: "Repost deleted from your profile successfully",
              });
            } else if (
              referencePostReposterIds.includes(userId) &&
              referencePostReposterIds.length === 1
            ) {
              Post.findByIdAndDelete(repostedPost[0]._id.toString())
                .then((result) => {
                  console.log("THIS LINE IS WORKING 4 => ", result);
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
          console.log(
            "LINE IS WORKING 1 ",
            post.repostedFromThisOriginalPost[0].toString()
          );

          Post.find({ _id: post.repostedFromThisOriginalPost[0].toString() })
            .then((originalPost) => {
              console.log(
                "WE FOUND ORIGINAL POST FROM REFERENCE POST =>",
                originalPost
              );
              originalPost[0].reposted = filteredPostArray;
              originalPost[0].save();
            })
            .catch(() => {
              res.json("Original post not found!");
            });

          console.log("POST THAT WE ARE DEALING => ", post);
          Post.findByIdAndDelete(post._id)
            .then(() => {
              User.findById(userId)
                .then((user) => {
                  const filteredUserPostsArray = user.posts.filter(
                    (element) => {
                      return element.toString() !== postId;
                    }
                  );

                  user.posts = filteredUserPostsArray;

                  user.save();

                  res.status(200).json({
                    message:
                      "Repost deleted from your profile and posts collection successfully",
                  });
                })
                .catch(() => {
                  res.json("USER NOT FOUND!");
                });
            })
            .catch(() => {
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
              user.posts = filteredUserPostsArray;
              post.save();
              user.save();
              console.log("LINE 3", post.reposted);
              console.log("LINE 4", user.posts);

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
                .catch(() => {
                  console.log("Error occured while fetching the original post");
                });

              res.status(200).json({
                message: "Repost deleted from your profile successfully",
              });
            })
            .catch(() => {
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
