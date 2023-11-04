const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Repost = require("../models/Repost.model");
const { ObjectId } = require("mongoose").Types;

// NOTE If the reposted array that you pushed inside your posts array not equal to currentuserid than label as a <svg>Repeat</svg> You Reposted.
// NOTE but don't touch the reposts array inside user.reposts array for in any case for the future
const handleRepost = (req, res) => {
  const { postId } = req.body;
  const { userId } = req.user;
  console.log("THE POST THAT WE WANT IT TO REPOST =>", postId);

  console.log("CURRENT USER WHO WANTS TO REPOST SOME POST => ", userId);

  User.findById(userId)
    .then((user) => {
      if (!user.reposts.includes(postId)) {
        Repost.create({
          userId: userId,
          postId: postId,
        });
        console.log(
          "NEW REPOST MODEL CREATED IN DATABASE WITH REPOST ID , CURRENT USER ID , POST ID"
        );
        user.posts.unshift(postId);
        user.reposts.push(postId);
        user.save();
        console.log("THE REPOSTED POST ADDED TO CURRENT USER.REPOSTS ARRAY");
        Post.findById(postId)
          .then((post) => {
            post.reposted.push(userId);

            post.save();
            console.log(
              "THE POST CURRENT USER REPOSTED FINDED IN THE => POSTS COLLECTION AND USER ID ADDED TO POST.REPOSTED ARRAY"
            );
            res.json(user.posts);
          })
          .catch(() => {
            res.status(500).json({
              errorMessage:
                "Error occured while pushing the post.reposted array",
            });
          });
      } else {
        console.log("THIS POST IS EXIST IN YOUR REPOSTS ARRAY");
      }
    })
    .catch(() => {
      res.status(500).json({
        errorMessage:
          "Error occured while pushing the post to user.reposts array",
      });
    });
};

const handleGetReposts = (req, res) => {
  const { userId } = req.user;
  console.log(userId);
  User.findById(userId)
    .populate("reposts")
    .then((user) => {
      console.log(user);
      res.json(user.reposts);
    })
    .catch((error) => {
      console.log("Error occured while fetching reposts array=>", error);
    });
};

const handleDeleteReposts = (req, res) => {
  const { postId } = req.body;
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      console.log(
        "THIS IS THE POST THAT WE ARE GOING TO DEAL WITH FOR DELETE REPOST PROCESS =>",
        postId
      );

      const firstIndex = user.reposts.indexOf(postId);
      const postIds = user.posts.map((element) => {
        return element.toString();
      });
      const lastIndex = postIds.lastIndexOf(postId);
      console.log(firstIndex, lastIndex);
      if (firstIndex >= 0 && lastIndex >= 0) {
        user.reposts.splice(firstIndex, 1);
        console.log("REPOST POST SPLICED FROM USER.REPOSTS ARRAY!");
        user.posts.splice(lastIndex, 1);
        console.log("REPOST POST SPLICED FROM USER.POSTS ARRAY");
        // save user lastly after all the repost process !
        user.save();
      }

      Repost.find({ userId: userId })
        .then((post) => {
          Repost.findByIdAndDelete(post)
            .then(() => {
              console.log(
                "Repost Post deleted from posts collection successfully!"
              );
            })
            .catch(() => {
              res.status(500).json({
                errorMessage:
                  "Error occured while trying to delete repost from post collection",
              });
            });
        })
        .catch(() => {
          res.status(404).json({ errorMessage: "Post not found!" });
        });

      Post.find({ _id: postId })
        .then((post) => {
          console.log("HERE IS THE POST => ", post);
          const filteredPostRepostedArray = post[0].reposted.filter(
            (element) => element.toString() !== userId
          );
          console.log(userId);
          console.log(post[0].reposted[0].toString());

          post[0].reposted = filteredPostRepostedArray;
          post[0].save();
          console.log(
            "THE LAST STATE OF FILTERED POST ARRAY =>",
            filteredPostRepostedArray
          );
        })
        .catch((error) => {
          console.log("This error active 1");
          console.log(error);
          res.status(404).json({ errorMessage: "Post not found!" });
        });
    })
    .catch(() => {
      console.log("This error active 2");
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

module.exports = {
  handleRepost,
  handleGetReposts,
  handleDeleteReposts,
};
