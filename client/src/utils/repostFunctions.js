import axios from "axios";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// refactoring the delete repost function start to check
export default function deleteRepost(
  localStoragePosts,
  postId,
  user,
  getToken,
  setState,
  refreshPosts
) {
  console.log(localStoragePosts, postId, user, getToken, setState);
  const pagePosts = localStoragePosts;

  const findPost = pagePosts
    ? pagePosts.find((eachPost) => {
        return eachPost._id === postId;
      })
    : null;

  const findPostIndex = pagePosts ? pagePosts.indexOf(findPost) : null;
  if (findPost) {
    if (findPost.isReposted) {
      const findOriginalPostId = findPost.repostedFromThisOriginalPost[0]._id;
      const findOriginalPost = pagePosts.find((eachPost) => {
        return eachPost._id === findOriginalPostId;
      });

      const findReposter = findOriginalPost.reposted.find((eachReposter) => {
        return eachReposter._id === user._id;
      });

      const reposterIndex = findOriginalPost.reposted.indexOf(findReposter);

      if (findPost.reposted.length === 1) {
        // start to check basit settimeout animation
        const updateProfilePosts = () => {
          findOriginalPost.reposted.splice(reposterIndex, 1);
          pagePosts.splice(findPostIndex, 1);
          localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
          setState(pagePosts);
          refreshPosts();
        };

        setTimeout(updateProfilePosts, 500);
        // finish to check basit settimeout animation

        // findOriginalPost.reposted.splice(reposterIndex, 1);
        // pagePosts.splice(findPostIndex, 1);
        // localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
        // setState(pagePosts);
      } else {
        // start to check basit settimeout animation
        const updateProfilePosts = () => {
          pagePosts[findPostIndex].reposted.splice(reposterIndex, 1);
          findOriginalPost.reposted.splice(reposterIndex, 1);
          localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
          setState(pagePosts);
          refreshPosts();
        };

        setTimeout(updateProfilePosts, 500);
        // finish to check basit settimeout animation

        // pagePosts[findPostIndex].reposted.splice(reposterIndex, 1);
        // findOriginalPost.reposted.splice(reposterIndex, 1);
        // localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
        // setState(pagePosts);
      }
    } else if (!findPost.isReposted) {
      const referencePost = pagePosts.map((eachPost) => {
        return eachPost.repostedFromThisOriginalPost[0] ? eachPost : null;
      });
      console.log("Reference post boss =>", referencePost);
      const filledObjectFiltered = referencePost.filter((filledItem) => {
        return filledItem
          ? filledItem.repostedFromThisOriginalPost[0]._id === findPost._id
          : null;
      });

      console.log("Filtered object =>", filledObjectFiltered);
      const filledObject = filledObjectFiltered[0];
      if (findPost.reposted.length === 1) {
        // start to check basit settimeout animation
        const updateProfilePosts = () => {
          const indexOfReferencePost = pagePosts.indexOf(filledObject);
          pagePosts.splice(indexOfReferencePost, 1);
          findPost.reposted = [];
          localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
          setState(pagePosts);
          refreshPosts();
        };

        setTimeout(updateProfilePosts, 500);
        // finish to check basit settimeout animation
        // const indexOfReferencePost = pagePosts.indexOf(filledObject);
        // pagePosts.splice(indexOfReferencePost, 1);
        // findPost.reposted = [];
        // localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
        // setState(pagePosts);
      } else {
        console.log(
          "This line is working because post reposted.length is bigger than 1"
        );
        const indexOfReferencePost = pagePosts.indexOf(filledObject);

        console.log("Finded post =>", pagePosts[indexOfReferencePost]);
        console.log("Finded post index =>", pagePosts.indexOf(findPost));
        console.log(
          "Reference post =>",
          filledObject,
          "Reference post index =>",
          pagePosts.indexOf(filledObject)
        );
        const findedUserToSpliceFromReposts = pagePosts[
          indexOfReferencePost
        ].reposted.find((eachReposter) => {
          return eachReposter._id === user._id;
        });

        console.log("Finded reposter user =>", findedUserToSpliceFromReposts);

        const findIndexOfThisUser = pagePosts[
          indexOfReferencePost
        ].reposted.indexOf(findedUserToSpliceFromReposts);

        console.log("Finded reposter user index =>", findIndexOfThisUser);

        const originalPostReposterFind = pagePosts[findPostIndex].reposted.find(
          (eachReposter) => {
            return eachReposter._id === user._id;
          }
        );

        console.log("Original post reposter =>", originalPostReposterFind);
        const originalPostReposterFindIndex = pagePosts[
          findPostIndex
        ].reposted.indexOf(originalPostReposterFind);
        console.log(
          "Original post reposter index =>",
          originalPostReposterFindIndex
        );

        // start to check basit settimeout animation
        const updateProfilePosts = () => {
          pagePosts[findPostIndex].reposted.splice(
            originalPostReposterFindIndex,
            1
          );
          pagePosts[indexOfReferencePost].reposted.splice(
            findIndexOfThisUser,
            1
          );
          localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
          setState(pagePosts);
          refreshPosts();
        };

        setTimeout(updateProfilePosts, 500);
        // finish to check basit settimeout animation
      }
    }
  } else {
    console.log("There is an error occured while trying to delete repost !");
  }

  //   start to check let's do this for mainpage posts first

  axios
    .post(
      `${API_URL}/repost/delete`,
      { postId: postId, userId: user._id },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )
    .then(() => {
      console.log("You deleted repost!");
    })
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });

  //   finish to check let's do this for mainpage posts first
}

// refactoring the delete repost function finish to check
