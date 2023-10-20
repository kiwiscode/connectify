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
    .catch(() => {
      res
        .status(500)
        .json({ errorMessage: "An error occured while fetching posts" });
    });
};

const handleDeletePost = (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  console.log(postId, userId);

  // this postId should filtered from all the users favorites array ! So then we can delete the post itself after delete from every user's favorites array

  User.find({ favorites: postId })
    .then((users) => {
      console.log(
        "FOUND USERS ACCORDING THEIR FAVORITES ARRAY IF INCLUDES THIS POSTID:",
        users
      );

      for (let i = 0; i < users.length; i++) {
        console.log("HERE ARE THE FIND USERS FAVORITES:", users[i].favorites);
        console.log(users[i].favorites.toString().includes(postId));
        if (users[i].favorites.toString().includes(postId)) {
          users[i].favorites = users[i].favorites.filter((favoriteId) => {
            return favoriteId.toString() !== postId;
          });
        }
        console.log("LET'S SEE!");

        return Promise.all(
          users.map((user) =>
            user
              .save()
              .then(() => {
                console.log(
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

  User.findById(userId)
    .populate("posts")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      const filteredPostArr = user.posts.filter(
        (post) => post._id.toString() !== postId
      );
      user.posts = filteredPostArr;

      const successMessage = "successfully".toUpperCase();
      console.log(
        `SPESIFIC POST DELETED ${successMessage} FROM USER.POSTS ARRAY `
      );

      // STARTING WITH POST DELETING PROCESS
      Post.findById(postId)
        .then((post) => {
          console.log("LET'S DELETE THIS POST FROM POST COLLECTION:", post);

          Post.findByIdAndDelete(post._id)
            .then(() => {
              const filteredFavoritesArr = user.favorites.filter(
                (favorite) => favorite._id.toString() !== postId
              );

              console.log("HERE IS THE FILTERED ARRAY :", filteredFavoritesArr);

              // user.favorites = filteredFavoritesArr;
              // user.save();
              console.log(
                "POST DELETED FROM POST COLLECTION AND USER FAVORITES POSTS ARRAY"
              );
            })
            .catch(() => {
              res.status(404).json("Post not found!");
            });
        })
        .catch(() => {
          res.status(404).json("Post not found!");
        });
      // FINISHING WITH POST DELETE PROCESS

      // STARTING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION

      Favorite.findOne({ postId: postId })
        .then((response) => {
          console.log("Now we are inside favorite id process");
          console.log("FAVORITE FOUND:", response);

          Favorite.findByIdAndDelete(response._id).then(() => {
            res.status(200);
          });
          return;
        })
        .catch(() => {
          res.status(404).json("Favorite not found!");
        });

      // FINISHING WITH FAVORITE DELETING PROCESS IF THE POST ALREADY IN FAVORITE COLLECTION
      return user.save().then(() => {
        console.log(
          "LAST STEP SUCCESS ALL THE PROMISES AND CALCULATIONS ARE WORKING ON THE ABOVE SECTIONS"
        );
        res.status(200).json({
          message:
            "Post deleted from post model,user posts array (and favorites ?)",
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
