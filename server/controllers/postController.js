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

      // start to check

      if (image || modalImage) {
        cloudinary.uploader
          .upload(image || modalImage, {
            folder: process.env.CLOUDINARY_FOLDER_NAME,
            allowed_formats: [
              "jpg",
              "mp4",
              "ogv",
              "png",
              "pdf",
              "webm",
              "webp",
            ],
            quality: "auto:good",
            width: 1200,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
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
      console.error("error:", error);
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

          if (post.isReposted) {
            console.log("if block is working 1");
            deleteConditions.push(
              post._id.toString(),
              post.repostedFromThisOriginalPost[0]?._id.toString()
            );
          } else if (post.reposted.length) {
            console.log("else if block is working 2");
            Post.find({ repostedFromThisOriginalPost: post._id })
              .then((referencePost) => {
                Post.deleteMany({
                  _id: {
                    $in: [
                      post._id.toString(),
                      referencePost[0]?._id.toString(),
                    ],
                  },
                })
                  .then((result) => {
                    console.log("Delete conditions here =>", [
                      post._id.toString(),
                      referencePost[0]?._id.toString(),
                    ]);

                    deleteConditions.push(
                      post._id.toString(),
                      referencePost[0]?._id.toString()
                    );

                    console.log("Posts deleted successfully result =>", result);
                  })
                  .catch((error) => {
                    console.error("Error deleting posts:", error);
                  });
              })
              .catch((error) => {
                console.log("error:", error);
              });
          } else {
            console.log("else block is working 3");
            deleteConditions.push(post._id.toString());
          }

          console.log("Delete Conditions ids:", bookmarkIds);

          // If the post is a comment
          if (post.isComment) {
            // Use findOne to find the specific comment
            Comment.findOne({
              postId: post.isReposted
                ? post.repostedFromThisOriginalPost[0]?._id
                : post._id,
            })
              .then((foundComment) => {
                if (foundComment) {
                  const commentId = foundComment._id;

                  const commentedForThisUsersPost =
                    post.commentedForThisUsersPost._id.toString();

                  User.findByIdAndUpdate(
                    commentedForThisUsersPost, // Kullanıcının ID'si
                    {
                      $pull: {
                        notifications: {
                          "isComment.value": true, // isComment.value'nin true olduğu durum
                          "isComment.commentPostId": post.isReposted
                            ? post.repostedFromThisOriginalPost[0]?._id
                            : post._id, // isComment.postId'ye eşit olan notification
                        },
                      },
                    },
                    { new: true } // Güncellenmiş dökümana erişmek için
                  )
                    .then((updatedUser) => {
                      console.log("Updated user:", updatedUser);
                    })
                    .catch((error) => {
                      console.error("Error updating user:", error);
                    });

                  // Remove this comment from the comments array in other posts
                  Post.updateMany(
                    { comments: commentId }, // Find all posts that have this commentId in their comments array
                    {
                      $pull: {
                        comments: commentId,
                      },
                    } // Remove the commentId from the comments array
                  )
                    .then(() => {
                      console.log(
                        `Comment ${commentId} was removed from the comments array in all posts.`
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "An error occurred while removing the comment from posts:",
                        error
                      );
                    });
                } else {
                  console.error("Comment not found.");
                }
              })
              .catch((error) => {
                console.error(
                  "An error occurred while searching for the comment:",
                  error
                );
              });
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
            console.log("now here is working update all the users");
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
            _id: { $in: deleteConditions },
          })
            .then((result) => {
              console.log("Delete conditions =>", deleteConditions);
              console.log("Posts deleted successfully result =>", result);
            })
            .catch((error) => {
              console.error("Error deleting posts:", error);
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

          setTimeout(() => {
            Comment.deleteMany({
              postId: deleteConditions,
            })
              .then((result) => {
                console.log(
                  "Delete conditions after comment deletion =>",
                  deleteConditions
                );
                console.log("Comments deleted successfully result =>", result);
              })
              .catch((error) => {
                console.error("Error deleting favorites:", error);
              });
          }, 1250);

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

const handlePinPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    const user = await User.findById(userId).populate("posts");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const postIndex = user.posts.findIndex(
      (post) => post._id.toString() === postId
    );

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Postu bul ve repost durumu olup olmadığını kontrol et
    const post = await Post.findById(postId);
    let originalPostId = postId;

    // find reference post
    const referencePost = await Post.findOne({
      _id: post?.repostedFromThisOriginalPost[0]?._id,
    });
    console.log("reference post:", referencePost);

    // Eğer reposted ise orijinal post id'sini kullan
    if (
      post.isReposted &&
      post.repostedFromThisOriginalPost &&
      post.repostedFromThisOriginalPost.length > 0
    ) {
      originalPostId = post.repostedFromThisOriginalPost[0]._id.toString(); // Orijinal post ID'sini al
    }

    // PinnedPosts'in ilk elemanını kontrol et, varsa al
    const pinnedPostId =
      user.pinnedPosts.length > 0 ? user.pinnedPosts[0]._id.toString() : null;

    // Eğer aynı post tekrar pinlenmek isteniyorsa, pinlemeyi kaldır
    if (
      pinnedPostId &&
      pinnedPostId === originalPostId &&
      !post.reposted.length
    ) {
      console.log("buradayız 1!!!");

      // Pinned postu kaldır
      user.pinnedPosts.splice(0, 1);

      // Post'un pinned durumunu güncelle
      await Post.updateOne({ _id: originalPostId }, { pinned: false });

      await user.save();
      return res.status(200).json({
        message: "Post unpinned successfully",
        pinnedPosts: user.pinnedPosts,
      });
    } else if (
      pinnedPostId &&
      pinnedPostId === originalPostId &&
      post.reposted.length &&
      referencePost?._id.toString() !== pinnedPostId
    ) {
      console.log("buradayız 2 !!!");

      // Pinned postu kaldır
      user.pinnedPosts.splice(0, 1);

      // Post'un pinned durumunu güncelle
      await Post.updateOne({ _id: pinnedPostId }, { pinned: false });

      await user.save();
      return res.status(200).json({
        message: "Post unpinned successfully",
        pinnedPosts: user.pinnedPosts,
      });
    } else if (
      pinnedPostId &&
      pinnedPostId === originalPostId &&
      post.reposted.length &&
      referencePost._id.toString() === pinnedPostId
    ) {
      console.log("buradayız 3 !!!");
      return res.status(200).json({
        message: "Post pinned successfully",
        pinnedPosts: user.pinnedPosts,
      });
    }

    // Eski pinned postu kaldır (eğer farklı bir post varsa)
    if (user.pinnedPosts.length > 0) {
      user.pinnedPosts.splice(0, 1); // Eski pinned postu kaldır
    }

    // Yeni postu pinnedPosts dizisine ekle
    user.pinnedPosts.unshift(originalPostId);

    // Yeni postu pinned durumuna getir
    await Post.updateOne({ _id: originalPostId }, { pinned: true });

    // Kullanıcıyı kaydet
    await user.save();

    return res.status(200).json({
      message: "Post pinned successfully",
      pinnedPosts: user.pinnedPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handlePost,
  handleShowPosts,
  handleDeletePost,
  handlePinPost,
};
