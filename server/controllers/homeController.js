const User = require("../models/User.model");
const Post = require("../models/Post.model");

const handlePost = (req, res) => {
  const { content } = req.body;
  const { userId } = req.user;
  console.log(content);
  User.findById(userId)
    .populate("posts")
    .populate("favorites")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log(user);
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

module.exports = {
  handlePost,
  handleShowPosts,
};
