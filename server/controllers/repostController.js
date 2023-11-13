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

          console.log(userPostsIds, userRepostIds);
          if (
            !post.reposted.length &&
            !post.isReposted &&
            !post.repostedFromThisOriginalPost.length
          ) {
            post.reposted.unshift(userId);
            Post.create({
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
            });
            post.save();
            // user.save();
            res.status(200).json({ message: "Repost Created Successfully!" });
          } else if (post.isReposted === true) {
            post.reposted.unshift(userId);
            post.save();
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
          } else if (
            post.isReposted === false &&
            !reposterUserIds.includes(userId)
          ) {
            post.reposted.unshift(userId);
            post.save();
            Post.find({ repostedFromThisOriginalPost: postId })
              .then((post) => {
                console.log("Iam here lets go");
                post[0].reposted.unshift(userId);
                post[0].save();
                console.log(post);
                res
                  .status(200)
                  .json({ message: "Repost Created Successfully!" });
              })
              .catch(() => {
                console.log("ERROR");
              });
          } else if (reposterUserIds.includes(userId)) {
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

module.exports = {
  handleRepost,
  //   handleGetReposts,
  //   handleDeleteReposts,
};
