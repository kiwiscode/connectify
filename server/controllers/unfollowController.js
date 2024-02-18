const User = require("../models/User.model");

const handleUnfollow = (req, res) => {
  const { activeUserId, theUnfollowedUserID } = req.body;
  console.log("Unfollow Route is working !");
  console.log("User in action =>", activeUserId);
  console.log("Unfollowed user =>", theUnfollowedUserID);
  User.findById(activeUserId)
    .then((activeUser) => {
      User.findById(theUnfollowedUserID)
        .then((followedUser) => {
          const followingIds = activeUser.following.map((eachFollowing) => {
            return eachFollowing._id.toString();
          });

          const followerIds = followedUser.followers.map((eachFollower) => {
            return eachFollower._id.toString();
          });

          console.log("Following ids from active user =>", followingIds);
          console.log("Follower ids from active user =>", followerIds);

          const filterFollowing = activeUser.following.filter(
            (eachFollowing) => {
              return eachFollowing._id.toString() !== theUnfollowedUserID;
            }
          );

          const filterFollowers = followedUser.followers.filter(
            (eachFollower) => {
              return eachFollower._id.toString() !== activeUserId;
            }
          );

          if (
            followingIds.includes(theUnfollowedUserID) &&
            followerIds.includes(activeUserId)
          ) {
            activeUser.following = filterFollowing;
            followedUser.followers = filterFollowers;

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
                "Error occured while saving users because they are not inside each other following/followers list !",
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

module.exports = { handleUnfollow };
