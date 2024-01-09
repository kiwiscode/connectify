import axios from "axios";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// export default function deleteRepost(postId, user, getToken, setState) {
//   const mainPagePosts = JSON.parse(localStorage.getItem("mainPagePosts"));
//   const profilePosts = JSON.parse(localStorage.getItem("profilePosts"));
//   const spesificUserProfilePosts = JSON.parse(
//     localStorage.getItem("profileInfoPosts")
//   );

//   const findPost = mainPagePosts
//     ? mainPagePosts.find((eachPost) => {
//         return eachPost._id === postId;
//       })
//     : null;

//   const findPostIndex = mainPagePosts ? mainPagePosts.indexOf(findPost) : null;
//   if (findPost) {
//     if (findPost.isReposted) {
//       const findOriginalPostId = findPost.repostedFromThisOriginalPost[0]._id;
//       const findOriginalPostInsideMainPagePosts = mainPagePosts.find(
//         (eachPost) => {
//           return eachPost._id === findOriginalPostId;
//         }
//       );

//       const findReposter = findOriginalPostInsideMainPagePosts.reposted.find(
//         (eachReposter) => {
//           return eachReposter._id === user._id;
//         }
//       );

//       const reposterIndex =
//         findOriginalPostInsideMainPagePosts.reposted.indexOf(findReposter);

//       if (findPost.reposted.length === 1) {
//         findOriginalPostInsideMainPagePosts.reposted.splice(reposterIndex, 1);
//         mainPagePosts.splice(findPostIndex, 1);
//         localStorage.setItem("mainPagePosts", JSON.stringify(mainPagePosts));
//         setState(mainPagePosts);
//       } else {
//         mainPagePosts[findPostIndex].reposted.splice(reposterIndex, 1);
//         findOriginalPostInsideMainPagePosts.reposted.splice(reposterIndex, 1);
//         localStorage.setItem("mainPagePosts", JSON.stringify(mainPagePosts));
//         setState(mainPagePosts);
//       }
//     } else if (!findPost.isReposted) {
//       const referencePost = mainPagePosts.map((eachPost) => {
//         return eachPost.repostedFromThisOriginalPost[0] ? eachPost : null;
//       });

//       const filledObjectFiltered = referencePost.filter((filledItem) => {
//         return filledItem;
//       });
//       const filledObject = filledObjectFiltered[0];
//       if (findPost.reposted.length === 1) {
//         const indexOfReferencePost = mainPagePosts.indexOf(filledObject);
//         mainPagePosts.splice(indexOfReferencePost, 1);
//         findPost.reposted = [];
//         localStorage.setItem("mainPagePosts", JSON.stringify(mainPagePosts));
//         setState(mainPagePosts);
//       } else {
//         const indexOfReferencePost = mainPagePosts.indexOf(filledObject);
//         const findedUserToSpliceFromReposts = mainPagePosts[
//           indexOfReferencePost
//         ].reposted.find((eachReposter) => {
//           return eachReposter._id === user._id;
//         });

//         const findIndexOfThisUser = mainPagePosts[
//           indexOfReferencePost
//         ].reposted.indexOf(findedUserToSpliceFromReposts);

//         const originalPostReposterFind = mainPagePosts[
//           findPostIndex
//         ].reposted.find((eachReposter) => {
//           return eachReposter._id === user._id;
//         });
//         const originalPostReposterFindIndex = mainPagePosts[
//           findPostIndex
//         ].reposted.indexOf(originalPostReposterFind);

//         mainPagePosts[findPostIndex].reposted.splice(
//           originalPostReposterFindIndex,
//           1
//         );
//         mainPagePosts[indexOfReferencePost].reposted.splice(
//           findIndexOfThisUser,
//           1
//         );
//         localStorage.setItem("mainPagePosts", JSON.stringify(mainPagePosts));

//         setState(mainPagePosts);
//       }
//     }
//   } else {
//     console.log("There is an error occured while trying to delete repost !");
//   }

//   //   start to check let's do this for mainpage posts first

//   axios
//     .post(
//       `${API_URL}/repost/delete`,
//       { postId: postId, userId: user._id },
//       {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       }
//     )
//     .then(() => {
//       console.log("You deleted repost!");
//     })
//     .then(() => {})
//     .catch((error) => {
//       console.log(error);
//     });

//   //   finish to check let's do this for mainpage posts first
// }

// refactoring the delete repost function start to check
export default function deleteRepost(
  localStoragePosts,
  postId,
  user,
  getToken,
  setState
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
        findOriginalPost.reposted.splice(reposterIndex, 1);
        pagePosts.splice(findPostIndex, 1);
        localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
        setState(pagePosts);
      } else {
        pagePosts[findPostIndex].reposted.splice(reposterIndex, 1);
        findOriginalPost.reposted.splice(reposterIndex, 1);
        localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
        setState(pagePosts);
      }
    } else if (!findPost.isReposted) {
      const referencePost = pagePosts.map((eachPost) => {
        return eachPost.repostedFromThisOriginalPost[0] ? eachPost : null;
      });

      const filledObjectFiltered = referencePost.filter((filledItem) => {
        return filledItem;
      });
      const filledObject = filledObjectFiltered[0];
      if (findPost.reposted.length === 1) {
        const indexOfReferencePost = pagePosts.indexOf(filledObject);
        pagePosts.splice(indexOfReferencePost, 1);
        findPost.reposted = [];
        localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));
        setState(pagePosts);
      } else {
        const indexOfReferencePost = pagePosts.indexOf(filledObject);
        const findedUserToSpliceFromReposts = pagePosts[
          indexOfReferencePost
        ].reposted.find((eachReposter) => {
          return eachReposter._id === user._id;
        });

        const findIndexOfThisUser = pagePosts[
          indexOfReferencePost
        ].reposted.indexOf(findedUserToSpliceFromReposts);

        const originalPostReposterFind = pagePosts[findPostIndex].reposted.find(
          (eachReposter) => {
            return eachReposter._id === user._id;
          }
        );
        const originalPostReposterFindIndex = pagePosts[
          findPostIndex
        ].reposted.indexOf(originalPostReposterFind);

        pagePosts[findPostIndex].reposted.splice(
          originalPostReposterFindIndex,
          1
        );
        pagePosts[indexOfReferencePost].reposted.splice(findIndexOfThisUser, 1);
        localStorage.setItem("mainPagePosts", JSON.stringify(pagePosts));

        setState(pagePosts);
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
