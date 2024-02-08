const User = require("../models/User.model");

const handleFollow = (req, res) => {
  const { activeUserId, theFollowedUserID } = req.body;
  console.log("Follow Route is working !", activeUserId, theFollowedUserID);

  User.findById(activeUserId)
    .then((activeUser) => {
      User.findById(theFollowedUserID)
        .then((followedUser) => {
          const followingIds = activeUser.following.map((eachFollowing) => {
            return eachFollowing._id.toString();
          });

          const followerIds = followedUser.followers.map((eachFollower) => {
            return eachFollower._id.toString();
          });

          console.log("Following ids from active user =>", followingIds);
          console.log("Follower ids from active user =>", followerIds);

          if (
            !followingIds.includes(theFollowedUserID) &&
            !followerIds.includes(activeUserId)
          ) {
            activeUser.following.unshift(theFollowedUserID);
            followedUser.followers.unshift(activeUserId);

            activeUser
              .save()
              .then(
                followedUser
                  .save()
                  .then(() => {
                    res.status(202).json({
                      message:
                        "Active user and the followed user saved in their following and followers array!",
                    });
                  })
                  .catch(() => {
                    res.status(500).json({
                      errorMessage:
                        "Error occured while saving the followed user !",
                    });
                  })
              )
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  errorMessage: "Error occured while saving active user !",
                });
              });
          } else {
            res.status(500).json({
              errorMessage:
                "Error occured while saving users because they are inside each other following/followers list !",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { handleFollow };
