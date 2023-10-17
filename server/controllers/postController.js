const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");

const handlePost = (req, res) => {
  const { content } = req.body;
  const { userId } = req.user;

  User.findById(userId)
    .populate("posts")
    .populate("favorites")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return Post.create({
        userId: userId,
        content: content,

        authorFullName: user.fullname,
        authorUserName: user.username,
      })
        .then((post) => {
          user.posts.push(post);

          return user.save().then(() => {
            res.status(200).json({ message: "Post added successfully." });
          });
        })
        .catch((error) => {
          res.status(500).json({ errorMessage: "Error creating post", error });
        });
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: "Error finding user", error });
    });
};

const handleShowPosts = (req, res) => {
  Post.find()
    .populate("userId")
    .then((postsFromDataBase) => {
      res.json(postsFromDataBase);
    })
    .catch((err) => {
      res.status(500).send("An error occured while fetching posts", err);
    });
};

const handleDeletePost = (req, res) => {
  console.log("Hello World");
  const postId = req.params.id;
  const { userId } = req.body;
  console.log(postId, userId);
  User.findById(userId)
    .populate("posts")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      // console.log("USER POSTS ID:", user.posts);

      const filteredPostArr = user.posts.filter(
        (post) => post._id.toString() !== postId
      );
      user.posts = filteredPostArr;

      console.log("IS ARRAY FILTERED ? LET'S SEE:", filteredPostArr);

      return user.save().then(() => {
        console.log("3");
        res.status(200).json({
          message:
            "Post deleted from post model,user posts array (and favorites ?)",
        });
      });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User Not Found" });
    });
};

module.exports = {
  handlePost,
  handleShowPosts,
  handleDeletePost,
};
