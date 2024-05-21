const express = require("express");
const router = express();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const Bookmark = require("../models/Bookmark.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

router.post("/bookmarks/add", authenticateToken, async (req, res) => {
  // eğer post.isComment ise Comment collectionunda post.commentedForThisPost alanna denk gelen commenti bulup bookmarksın içerisinede bu yeni oluşturulan bookmarkı ekle !
  try {
    const { userId } = req.user;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let bookmarkId;

    if (post.isReposted) {
      bookmarkId = post.repostedFromThisOriginalPost[0]._id.toString();
    } else {
      bookmarkId = postId;
    }

    Bookmark.create({
      bookmarkedPost: bookmarkId,
      bookmarker: userId,
      bookmarkedFromThisUser: post.userId._id.toString(),
    })
      .then((bookmark) => {
        // eğer bookmark eklenen post comment ise comment collectionundaki referencinada bookmarksı ekle
        if (post.isComment) {
          Comment.find({
            postId: post.isReposted
              ? post.repostedFromThisOriginalPost[0]._id.toString()
              : postId,
          })
            .then((commentToAddBookmark) => {
              console.log(
                "Response found for this comment =>",
                commentToAddBookmark
              );
              commentToAddBookmark[0].bookmarks.unshift(
                bookmark._id.toString()
              );
              commentToAddBookmark[0].save();
            })
            .catch(() => {
              res.status(404).json("Comment not found!");
            });
        }
        // eğer bookmark eklenen post comment ise comment collectionundaki referencinada bookmarksı ekle

        console.log("Bookmark created:", bookmark);
        if (!post.isReposted && !post.reposted.length) {
          console.log("Burası çalışıyor 0!");
          post.bookmarks.unshift(bookmark._id.toString());
        } else if (post.isReposted) {
          console.log("Burası çalışıyor 1!");
          post.bookmarks.unshift(bookmark._id.toString());
          // original post => find
          const originalPostId = post.repostedFromThisOriginalPost[0]._id;
          Post.findOne({ _id: originalPostId })
            .then((originalPost) => {
              if (originalPost) {
                console.log("Original post before update:", originalPost);
                originalPost.bookmarks.unshift(bookmark._id.toString());
                originalPost.save();
                console.log("Original post after update:", originalPost);
              }
            })
            .catch(() => {
              res.status(404).json("Original post not found!");
            });
        } else if (!post.isReposted && post.reposted.length) {
          console.log("Burası çalışıyor 2!");
          post.bookmarks.unshift(bookmark._id.toString());
          // reference post => find
          Post.findOne({ repostedFromThisOriginalPost: postId })
            .then((referencePost) => {
              if (referencePost) {
                console.log("referencePost post before update:", referencePost);
                referencePost.bookmarks.unshift(bookmark._id.toString());
                referencePost.save();
                console.log("referencePost post after update:", referencePost);
              }
            })
            .catch(() => {
              res.status(404).json("Original post not found!");
            });
        }
        user.bookmarks.unshift(bookmark._id.toString());
        return Promise.all([post.save(), user.save()]);
      })
      .then(() => {
        res.status(201).json({ message: "Bookmark created successfully" });
      })
      .catch((error) => {
        console.error("Error creating bookmark:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error("Error =>", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/bookmarks/:bookmarkId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { bookmarkId } = req.params;

    const post = await Post.findById(bookmarkId);

    console.log("Post =>", post);
    console.log("Bookmark id =>", bookmarkId);

    const bookmark = await Bookmark.findOneAndDelete({
      bookmarkedPost: post.isReposted
        ? post.repostedFromThisOriginalPost[0]._id
        : bookmarkId,
      bookmarker: userId,
    });

    console.log("Bookmark found !!", bookmark);

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    if (post.isComment) {
      console.log(
        "Post is comment ! delete this bookmark also from the comment inside comment collection"
      );
      Comment.find({
        postId: post.isReposted
          ? post.repostedFromThisOriginalPost[0]._id.toString()
          : post._id.toString(),
      })
        .then((commentFoundToCleanBookmarksArray) => {
          const filteredArray =
            commentFoundToCleanBookmarksArray[0].bookmarks.filter(
              (eachBookmark) => {
                return eachBookmark._id.toString() !== bookmark._id.toString();
              }
            );
          commentFoundToCleanBookmarksArray[0].bookmarks = filteredArray;
          commentFoundToCleanBookmarksArray[0].save();
        })
        .catch(() => {
          res.status(404).json("Comment not found!");
        });
    }

    // const post = await Post.findById(bookmark.bookmarkedPost);
    const user = await User.findById(userId);

    if (post) {
      if (!post.isReposted && !post.reposted.length) {
        console.log("Burası çalışıyor 0");
        post.bookmarks = post.bookmarks.filter((eachBookmark) => {
          return eachBookmark.toString() !== bookmark._id.toString();
        });
        post.save();
      } else if (post.isReposted) {
        console.log("Burası çalışıyor 1");
        post.bookmarks = post.bookmarks.filter((eachBookmark) => {
          return eachBookmark.toString() !== bookmark._id.toString();
        });
        const originalPostId = post.repostedFromThisOriginalPost[0]._id;
        Post.findOne({ _id: originalPostId })
          .then((originalPost) => {
            if (originalPost) {
              originalPost.bookmarks = originalPost.bookmarks.filter(
                (eachBookmark) => {
                  return eachBookmark.toString() !== bookmark._id.toString();
                }
              );
              originalPost.save();
            }
          })
          .catch(() => {
            res.status(404).json("Original post not found!");
          });
        post.save();
      } else if (!post.isReposted && post.reposted.length) {
        console.log("Burası çalışıyor 2");
        post.bookmarks = post.bookmarks.filter((eachBookmark) => {
          return eachBookmark.toString() !== bookmark._id.toString();
        });
        post.save();
        // reference post => find
        Post.findOne({ repostedFromThisOriginalPost: post._id })
          .then((referencePost) => {
            if (referencePost) {
              referencePost.bookmarks = referencePost.bookmarks.filter(
                (eachBookmark) => {
                  return eachBookmark.toString() !== bookmark._id.toString();
                }
              );
              referencePost.save();
            }
          })
          .catch(() => {
            res.status(404).json("Original post not found!");
          });
      }
    }

    if (user) {
      console.log("User exists with bookmarks!", user.bookmarks);
      user.bookmarks = user.bookmarks.filter((eachBookmark) => {
        return eachBookmark.toString() !== bookmark._id.toString();
      });
      await user.save();
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error =>", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/bookmarks", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    Bookmark.find({ bookmarker: userId })
      .populate([
        { path: "bookmarkedFromThisUser" },
        {
          path: "bookmarkedPost",
          populate: [
            { path: "userId", model: "User" },
            { path: "likes", model: "User" },
            { path: "reposted", model: "User" },
            { path: "bookmarks", model: "Bookmark" },
          ],
        },
        { path: "bookmarker" },
      ])
      .sort({ createdAt: -1 })
      .then((bookmarksForThisUserFromDB) => {
        res.status(200).json({ bookmarksForThisUserFromDB });
      })
      .catch(() => {
        res.status(404).json("Bookmarks not found!");
      });
  } catch (error) {
    console.error("Error =>", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-all-bookmarks", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const bookmarksToDelete = await Bookmark.find({ bookmarker: userId });

    const deletedBookmarkIds = bookmarksToDelete.map((eachBookmarkId) => {
      return eachBookmarkId._id.toString();
    });

    console.log("Bookmarks to delete =>", bookmarksToDelete);
    console.log("Each bookmark id =>", deletedBookmarkIds);

    const deletedBookmarks = await Bookmark.deleteMany({ bookmarker: userId });

    user.bookmarks = [];
    await user.save();
    await Post.updateMany(
      { bookmarks: { $in: deletedBookmarkIds } },
      { $pull: { bookmarks: { $in: deletedBookmarkIds } } }
    );

    res.status(200).json({
      message: "All bookmarks deleted successfully",
      deletedCount: deletedBookmarks.deletedCount,
    });
  } catch (error) {
    console.error("Error =>", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
