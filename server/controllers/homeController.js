const User = require("../models/User.model");
const Post = require("../models/Post.model");
const { response } = require("../routes/home.routes");
const capitalize = require("../utils/capitalize");

const handleMainPage = (req, res, next) => {
  res.send("Hello main page");
};

const handlePost = (req, res, next) => {
  const { text } = req.body;
  const { userId } = req.user;

  // Kullanıcıyı bul
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return Post.create({
        userId: userId,
        content: text,
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

module.exports = {
  handleMainPage,
  handlePost,
};
