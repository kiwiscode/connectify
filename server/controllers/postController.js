const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");
const Comment = require("../models/Comment.model");
const cloudinary = require("../utils/cloudinary");
const { deleteComment } = require("./commentController");
const Activity = require("../models/Activity.model");
const Bookmark = require("../models/Bookmark.model");
const { default: mongoose } = require("mongoose");

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

      console.log("Image:", image);
      console.log("Modal image:", modalImage);
      // start to check

      if (image || modalImage) {
        cloudinary.uploader
          .upload(image || modalImage, {
            folder: "connectify",
            allowed_formats: [
              "jpg",
              "mp4",
              "ogv",
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
    .catch(() => {
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
          const deleteConditions = [];
          const bookmarkIds = [];

          if (post.isReposted || post.reposted.length) {
            deleteConditions.push(
              post._id.toString(),
              post.repostedFromThisOriginalPost[0]?._id.toString()
            );
          } else {
            deleteConditions.push(post._id.toString());
          }

          Bookmark.find({ bookmarkedPost: { $in: deleteConditions } })
            .then((bookmarks) => {
              bookmarkIds.push(
                ...bookmarks.map((eachBookmark) => {
                  return eachBookmark._id.toString();
                })
              );
              console.log("Bookmark ids:", bookmarkIds);
            })
            .catch((error) => {
              console.error("Error finding users with bookmarks:", error);
            });

          setTimeout(() => {
            User.updateMany(
              {
                $or: [
                  { "notifications.post": { $in: deleteConditions } },
                  { bookmarks: { $in: bookmarkIds } },
                  { favorites: { $in: deleteConditions } },
                  { posts: { $in: deleteConditions } },
                ],
              },
              {
                $pull: {
                  notifications: { post: { $in: deleteConditions } },
                  bookmarks: { $in: bookmarkIds },
                  favorites: { $in: deleteConditions },
                  posts: { $in: deleteConditions },
                },
              }
            )
              .then((result) => {
                console.log("Delete conditions =>", deleteConditions);
                console.log(
                  "Favorites and posts cleaned successfully. Result =>",
                  result
                );
              })
              .catch((error) => {
                console.error(
                  "Error deleting favorites, posts, and bookmarks from users:",
                  error
                );
              });
          }, 1250);

          Post.deleteMany({
            _id: deleteConditions,
          })
            .then((result) => {
              console.log("Delete conditions =>", deleteConditions);
              console.log("Posts deleted successfully result =>", result);
            })
            .catch((error) => {
              console.error("Error deleting favorites:", error);
            });

          Favorite.deleteMany({
            postId: deleteConditions,
          })
            .then((result) => {
              console.log("Delete conditions =>", deleteConditions);
              console.log("Favorites deleted successfully result =>", result);
            })
            .catch((error) => {
              console.error("Error deleting favorites:", error);
            });

          Comment.deleteMany({
            postId: deleteConditions,
          })
            .then((result) => {
              console.log("Delete conditions =>", deleteConditions);
              console.log("Comments deleted successfully result =>", result);
            })
            .catch((error) => {
              console.error("Error deleting favorites:", error);
            });

          setTimeout(() => {
            Bookmark.deleteMany({
              bookmarkedPost: deleteConditions,
            })
              .then((result) => {
                console.log("Delete conditions =>", deleteConditions);
                console.log(
                  "Bookmarks deleted successfully. Result =>",
                  result
                );
              })
              .catch((error) => {
                console.error("Error deleting bookmarks:", error);
              });
          }, 1250);

          Activity.deleteMany({
            $or: [
              { relatedPost: { $in: deleteConditions } },
              { relatedPostOption2: { $in: deleteConditions } },
            ],
          })
            .then((result) => {
              console.log("Delete conditions =>", deleteConditions);
              console.log("Comments deleted successfully result =>", result);
            })
            .catch((error) => {
              console.error("Error deleting favorites:", error);
            });
        })
        .catch((error) => {
          console.log("Erro:", error);
        });
      return user.save().then(() => {
        res.status(200).json({
          message: "Post deleted",
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
