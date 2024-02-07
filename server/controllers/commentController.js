const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const cloudinary = require("../utils/cloudinary");

let globalImageId;
let globalImageUrl;
const addComment = (req, res) => {
  const { userId, postId, commentPost, modalImage } = req.body;

  console.log("User id to ready comment some posts =>", userId);
  console.log("Post id to ready get some comments from some user =>", postId);
  console.log("Comment content =>", commentPost);
  console.log("Comment with image =>", modalImage.slice(0, 3));
  User.findById(userId)
    .then((user) => {
      Post.findById(postId)
        .then((post) => {
          // eğer kendi postuna comment yapıyorsan ve hiç repost yoksa start to check
          if (
            post.userId._id.toString() === userId &&
            !post.isReposted &&
            !post.reposted.length
          ) {
            console.log(
              "Bu post userın kendi postu ve isReposted değil ve post.reposted.length yok"
            );

            if (modalImage !== "") {
              cloudinary.uploader
                .upload(modalImage, {
                  folder: "connectify",
                  allowed_formats: [
                    "mp4",
                    "ogv",
                    "jpg",
                    "png",
                    "pdf",
                    "webm",
                    "webp",
                  ],
                  height: 1000,
                  crop: "limit",
                })
                .then((result) => {
                  globalImageId = result.public_id;
                  globalImageUrl = result.secure_url;
                  return Post.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: result.public_id,
                      url: result.secure_url,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                  });
                })
                .then((newCreatedPost) => {
                  console.log("New created post =>", newCreatedPost);
                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: globalImageId,
                      url: globalImageUrl,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();
                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("This line is working 1 !");

              return Post.create({
                userId: userId,
                authorFullName: user.fullname,
                authorUserName: user.username,
                content: commentPost,

                isComment: true,
                commentedForThisPost: postId,
                commentedForThisUsersPost: post.userId._id.toString(),
              })
                .then((newCreatedPost) => {
                  console.log("This line is working 2 !");

                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();
                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          // eğer kendi postuna comment yapıyorsan ve hiç repost yoksa finish to check
          // eğer kendi postuna comment yapıyorsan ve post reposted.length var ise start to check
          if (post.userId._id.toString() === userId && post.reposted.length) {
            console.log(
              "Bu post userın kendi postu ve isReposted değil veya isReposted ve post.reposted.length var"
            );
            if (modalImage !== "") {
              cloudinary.uploader
                .upload(modalImage, {
                  folder: "connectify",
                  allowed_formats: [
                    "mp4",
                    "ogv",
                    "jpg",
                    "png",
                    "pdf",
                    "webm",
                    "webp",
                  ],
                  height: 1000,
                  crop: "limit",
                })
                .then((result) => {
                  globalImageId = result.public_id;
                  globalImageUrl = result.secure_url;
                  return Post.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: result.public_id,
                      url: result.secure_url,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                  });
                })
                .then((newCreatedPost) => {
                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: globalImageId,
                      url: globalImageUrl,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();

                    if (post.isReposted) {
                      Post.findById(
                        post.repostedFromThisOriginalPost[0]._id.toString()
                      )
                        .then((originalPost) => {
                          originalPost.comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          originalPost.save();
                        })
                        .catch((error) => {
                          console.log("Error =>", error);
                        });
                    } else {
                      Post.find({ repostedFromThisOriginalPost: postId })
                        .then((referencePost) => {
                          console.log("Reference post =>", referencePost);
                          referencePost[0].comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          referencePost[0].save();
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }

                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("This line is working 1 !");

              return Post.create({
                userId: userId,
                authorFullName: user.fullname,
                authorUserName: user.username,
                content: commentPost,

                isComment: true,
                commentedForThisPost: postId,
                commentedForThisUsersPost: post.userId._id.toString(),
              })
                .then((newCreatedPost) => {
                  console.log("This line is working 2 !");

                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();

                    if (post.isReposted) {
                      Post.findById(
                        post.repostedFromThisOriginalPost[0]._id.toString()
                      )
                        .then((originalPost) => {
                          originalPost.comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          originalPost.save();
                        })
                        .catch((error) => {
                          console.log("Error =>", error);
                        });
                    } else {
                      Post.find({ repostedFromThisOriginalPost: postId })
                        .then((referencePost) => {
                          console.log("Reference post =>", referencePost);
                          referencePost[0].comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          referencePost[0].save();
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }

                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          // eğer kendi postuna comment yapıyorsan ve post reposted.length var ise finish to check

          // eğer başkasının postuna comment yapıyorsan ve bu post isReposted değilse ve hiç repost edilmemişse start to check
          else if (
            post.userId._id.toString() !== userId &&
            !post.isReposted &&
            !post.reposted.length
          ) {
            console.log(
              "Bu post başka bir usera ait isReposted değil ve post.reposted.length yok"
            );
            if (modalImage !== "") {
              cloudinary.uploader
                .upload(modalImage, {
                  folder: "connectify",
                  allowed_formats: [
                    "mp4",
                    "ogv",
                    "jpg",
                    "png",
                    "pdf",
                    "webm",
                    "webp",
                  ],
                  height: 1000,
                  crop: "limit",
                })
                .then((result) => {
                  globalImageId = result.public_id;
                  globalImageUrl = result.secure_url;
                  return Post.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: result.public_id,
                      url: result.secure_url,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                  });
                })
                .then((newCreatedPost) => {
                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: globalImageId,
                      url: globalImageUrl,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();

                    // if (post.isReposted) {
                    //   Post.findById(
                    //     post.repostedFromThisOriginalPost[0]._id.toString()
                    //   )
                    //     .then((originalPost) => {
                    //       originalPost.comments.unshift(
                    //         newCreatedComment._id.toString()
                    //       );
                    //       originalPost.save();
                    //     })
                    //     .catch((error) => {
                    //       console.log("Error =>", error);
                    //     });
                    // } else {
                    //   Post.find({ repostedFromThisOriginalPost: postId })
                    //     .then((referencePost) => {
                    //       console.log("Reference post =>", referencePost);
                    //       referencePost[0].comments.unshift(
                    //         newCreatedComment._id.toString()
                    //       );
                    //       referencePost[0].save();
                    //     })
                    //     .catch((error) => {
                    //       console.log(error);
                    //     });
                    // }

                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("This line is working 1 !");

              return Post.create({
                userId: userId,
                authorFullName: user.fullname,
                authorUserName: user.username,
                content: commentPost,

                isComment: true,
                commentedForThisPost: postId,
                commentedForThisUsersPost: post.userId._id.toString(),
              })
                .then((newCreatedPost) => {
                  console.log("This line is working 2 !");

                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();
                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          // eğer başkasının postuna comment yapıyorsan ve bu post isReposted değilse ve hiç repost edilmemişse finish to check

          // eğer başkasının postuna comment yapıyorsan ve bu post isReposted ise ve post.reposted.length var ise start to check
          else if (
            post.userId._id.toString() !== userId &&
            post.reposted.length
          ) {
            console.log(
              "Bu post başka bir usera ait isReposted veya isReposted değil ve post.reposted.length var"
            );
            if (modalImage !== "") {
              cloudinary.uploader
                .upload(modalImage, {
                  folder: "connectify",
                  allowed_formats: [
                    "mp4",
                    "ogv",
                    "jpg",
                    "png",
                    "pdf",
                    "webm",
                    "webp",
                  ],
                  height: 1000,
                  crop: "limit",
                })
                .then((result) => {
                  globalImageId = result.public_id;
                  globalImageUrl = result.secure_url;
                  return Post.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: result.public_id,
                      url: result.secure_url,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                  });
                })
                .then((newCreatedPost) => {
                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    image: {
                      public_id: globalImageId,
                      url: globalImageUrl,
                    },
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);
                    post.comments.unshift(newCreatedComment._id.toString());
                    post.save();
                    newCreatedPost.save();

                    if (post.isReposted) {
                      Post.findById(
                        post.repostedFromThisOriginalPost[0]._id.toString()
                      )
                        .then((originalPost) => {
                          originalPost.comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          originalPost.save();
                        })
                        .catch((error) => {
                          console.log("Error =>", error);
                        });
                    } else {
                      Post.find({ repostedFromThisOriginalPost: postId })
                        .then((referencePost) => {
                          console.log("Reference post =>", referencePost);
                          referencePost[0].comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          referencePost[0].save();
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }

                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("This line is working 1 !");

              return Post.create({
                userId: userId,
                authorFullName: user.fullname,
                authorUserName: user.username,
                content: commentPost,

                isComment: true,
                commentedForThisPost: postId,
                commentedForThisUsersPost: post.userId._id.toString(),
              })
                .then((newCreatedPost) => {
                  console.log("This line is working 2 !");

                  Comment.create({
                    userId: userId,
                    authorFullName: user.fullname,
                    authorUserName: user.username,
                    content: commentPost,
                    isComment: true,
                    commentedForThisPost: postId,
                    commentedForThisUsersPost: post.userId._id.toString(),
                    postId: newCreatedPost._id.toString(),
                  }).then((newCreatedComment) => {
                    user.posts.unshift(newCreatedPost);

                    // eğer post reposted ise hem orijinal posta hem current posta commenti ekle start to check
                    if (post.isReposted) {
                      Post.find({
                        _id: post.repostedFromThisOriginalPost[0],
                      }).then((originalPost) => {
                        console.log("Original post =>", originalPost);

                        originalPost[0].comments.unshift(
                          newCreatedComment._id.toString()
                        );
                        post.comments.unshift(newCreatedComment._id.toString());

                        post.save();
                        originalPost[0].save();
                      });
                    }

                    // eğer post reposted ise hem orijinal posta hem current posta commenti ekle finish to check

                    // eğer post reposted değil ise de hem orijinal posta hem current posta commenti ekle start to check
                    else {
                      Post.find({
                        repostedFromThisOriginalPost: post._id,
                      }).then((referencePost) => {
                        console.log("Reference post =>", referencePost);

                        referencePost[0].comments.unshift(
                          newCreatedComment._id.toString()
                        );
                        post.comments.unshift(newCreatedComment._id.toString());

                        post.save();
                        referencePost[0].save();
                      });
                    }
                    // eğer post reposted değil ise de hem orijinal posta hem current posta commenti ekle finish to check

                    newCreatedPost.save();
                    console.log("THIS LINE IS WORKING 2 ", newCreatedPost);
                    return user.save().then(() => {
                      res
                        .status(200)
                        .json({ message: "Comment added successfully." });
                    });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          // eğer başkasının postuna comment yapıyorsan ve bu post isReposted ise ve post.reposted.length var ise finish to check
        })

        .catch(() => {
          res.status(404).json({ errorMessage: "Post not found !" });
        });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found !" });
    });
};

const deleteComment = () => {};

const showComments = () => {};

module.exports = {
  addComment,
  deleteComment,
  showComments,
};
