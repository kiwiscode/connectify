const User = require("../models/User.model");
const Post = require("../models/Post.model");
const jwt = require("jsonwebtoken");

const handleShowFollowingPosts = (req, res) => {
  console.log("Route is working !");

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;

  console.log("User id =>", userId);

  User.findById(userId)
    .then((user) => {
      console.log("active user username =>", user.username);
      // start to check user following these users
      User.find({ followers: userId })
        .then((response) => {
          // finish to check user following these users

          // we need to get all the posts from post collection with the id of response id , response it self is an array in this case and it can have more than 1 length , because user can follow more than 1 person... start to check

          // Extract userIds from the response array
          const userIds = response.map((user) => user._id.toString());

          // Find posts with userIds in the Post collection
          Post.find({ userId: { $in: userIds } })
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
            .then((posts) => {
              console.log("Posts =>", posts);

              res.status(202).json({ followingPosts: posts });
            })
            .catch((error) => {
              console.log("Error =>", error);
            });

          // we need to get all the posts from post collection with the id of response id , response it self is an array in this case and it can have more than 1 length , because user can follow more than 1 person... finish to check
        })
        .catch((error) => {
          console.log("Error =>", error);
        });
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: "A server-side error occurred. Please try again later.",
      });
    });
};

module.exports = {
  handleShowFollowingPosts,
};
