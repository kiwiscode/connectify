const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Favorite = require("../models/Favorite.model");
const cloudinary = require("../utils/cloudinary");

const handlePost = (req, res) => {
  const { content, image } = req.body;
  const { userId } = req.user;

  User.findById(userId)
    .populate("posts")
    .populate("favorites")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("THIS LINE IS WORKING 1 ", user);

      // start to check

      if (image) {
        cloudinary.uploader
          .upload(image, {
            folder: "connectify",
            quality: "auto:best",
          })
          .then((result) => {
            // console.log("THIS LINE IS WORKING 2 ", image);

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
            console.log("THIS LINE IS WORKING 2 ", post);
            return user.save().then(() => {
              res.status(200).json({ message: "Post added successfully." });
            });
          })
          .catch((error) => {
            console.log(error);
          });
        // finish to check
      } else if (!image) {
        return Post.create({
          userId: userId,
          authorFullName: user.fullname,
          authorUserName: user.username,
          content,
        })
          .then((post) => {
            user.posts.unshift(post);
            console.log("THIS LINE IS WORKING 2 ", post);
            return user.save().then(() => {
              res.status(200).json({ message: "Post added successfully." });
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
    .populate("userId")
    .populate("reposted")
    .populate("repostedFromThisOriginalPost")
    .then((postsFromDataBase) => {
      console.log("ACTIVE USER => ", userId);
      console.log("HELLO WORLD!");
      res.json(postsFromDataBase);
    })
    .catch((error) => {
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

      const filteredPostArr = user.posts.filter(
        (post) => post._id.toString() !== postId
      );

      const filteredFavoriteArr = user.favorites.filter(
        (favorite) => favorite._id.toString() !== postId
      );

      user.posts = filteredPostArr;
      user.favorites = filteredFavoriteArr;
      // user.save();
      // STARTING WITH POST DELETING PROCESS
      Post.findById(postId)
        .then((post) => {
          Post.findByIdAndDelete(post._id)
            .then(() => {
              console.log("MESSAGE ", "POST DELETED FROM POST COLLECTION ");
            })
            .catch(() => {
              res.status(404).json("Post not found!");
            });
        })
        .catch((error) => {
          console.log(error);
        });
      // FINISHING WITH POST DELETE PROCESS

      // STARTING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION

      Favorite.deleteMany({ postId: postId })
        .then((response) => {
          console.log(response);
          // burada findOne hatalı olabilir
          res.status(200);
        })
        .catch((error) => {
          console.log(error);
        });

      // FINISHING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION
      return user.save().then(() => {
        res.status(200).json({
          message:
            "Post deleted from post model,user posts array (and favorites ?)",
        });
      });
    })
    .catch(() => {
      res.status(404).json("User Not Found");
    });

  // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array
  // check if the active(current user who is deleting the post) exclude him/her from promise.all user.save combination
  User.find({ favorites: postId })
    .then((users) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i]._id.toString() === userId) {
          continue;
        } else if (users[i].favorites.toString().includes(postId)) {
          users[i].favorites = users[i].favorites.filter((favoriteId) => {
            return favoriteId.toString() !== postId;
          });
        } else {
          console.log("HATA 404");
        }
        // IMPORTANT
        return Promise.all(
          users.map((user) =>
            user
              .save()
              .then(() => {
                console.log(
                  "MESSAGE : ",
                  "YOU DELETED THE POST FROM ALL THE USERS FAVORITES ARRAY IF EXIST"
                );
              })
              .catch(() => {
                console.log(
                  "SOMETHING WENT WRONG WHILE YOU TRYING TO DELETE SPESIFIC POST IF THEY ARE EXIST SOME USERS FAVORITES ARRAY"
                );
              })
          )
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  handlePost,
  handleShowPosts,
  handleDeletePost,
};
