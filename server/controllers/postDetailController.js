const User = require("../models/User.model");
const Post = require("../models/Post.model");

const getPostDetail = (req, res) => {
  const { postId } = req.params;

  console.log(postId);

  Post.findById(postId)
    .populate("likes")
    .populate("reposted")
    .populate("userId")
    .populate("comments")
    .populate("commentedForThisPost")
    .populate("commentedForThisUsersPost")
    .populate({
      path: "commentedForThisPost",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "commentedForThisPost",
      populate: {
        path: "likes",
        model: "User",
      },
    })
    .populate({
      path: "commentedForThisPost",
      populate: {
        path: "reposted",
        model: "User",
      },
    })
    .populate({
      path: "commentedForThisPost",
      populate: {
        path: "comments",
        model: "Comment",
      },
    })
    .then((post) => {
      console.log("Detailed post =>", post.isReposted, post.content);
      res.status(202).json({ detailedPost: post });
    })
    .catch(() => {
      res.status(404).json({
        errorMessage:
          "Something went wrong while trying to fetch detailed post",
      });
    });
};

module.exports = { getPostDetail };
