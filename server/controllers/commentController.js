const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Activity = require("../models/Activity.model");
const cloudinary = require("../utils/cloudinary");

let globalImageId;
let globalImageUrl;

let createdCommentPostId;
const addComment = (req, res) => {
  const { userId, postId, commentPost, modalImage } = req.body;

  User.findById(userId)
    .then((user) => {
      Post.findById(postId)
        .then((post) => {
          Activity.create({
            activityHasBeenInitiatedWith: post.userId.toString(),
            thePersonWhoCarriedOutTheActivity: user._id.toString(),
            activityType: "comment",
            relatedPost: post._id.toString(),
            relatedPostOption2: post.isReposted
              ? post.repostedFromThisOriginalPost[0]._id.toString()
              : post.isComment
              ? post.commentedForThisPost._id.toString()
              : post._id.toString(),
          });
          // notification ekleme start to check
          // user kendisine notification gönderemez !
          setTimeout(() => {
            if (post?.userId?.toString() !== userId) {
              User.findById(post?.userId?.toString())
                .then((notifiedUser) => {
                  const newNotification = {
                    post: post._id,
                    notificationReceiver: post.userId,
                    notificationSender: userId,
                    isComment: {
                      value: true,
                      profileImageUrl: user.imageUrl,
                      senderId: userId,
                      userFullName: user.fullname,
                      userUserName: user.username,
                      comment: commentPost,
                      commentPostId: createdCommentPostId,
                    },
                  };

                  notifiedUser.notifications.unshift(newNotification);
                  notifiedUser.save();
                })
                .catch(() => {});
            } else {
            }
          }, 1000);
          // notification ekleme finish to check

          if (post) {
            // eğer kendi postuna comment yapıyorsan ve hiç repost yoksa start to check
            if (
              post.userId._id.toString() === userId &&
              !post.isReposted &&
              !post.reposted.length
            ) {
              if (modalImage !== "") {
                cloudinary.uploader
                  .upload(modalImage, {
                    folder: process.env.CLOUDINARY_FOLDER_NAME,
                    allowed_formats: [
                      "jpg",
                      "mp4",
                      "ogv",
                      "png",
                      "pdf",
                      "webm",
                      "webp",
                    ],
                    quality: "auto:good",
                    width: 1200,
                    crop: "fill",
                    gravity: "auto",
                    fetch_format: "jpg",
                    format: "jpg",
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
                    createdCommentPostId = newCreatedPost._id.toString();
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
                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      post.save();
                      newCreatedPost.save();
                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              } else {
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
                    createdCommentPostId = newCreatedPost._id.toString();

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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      post.save();
                      newCreatedPost.save();
                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              }
            }
            // eğer kendi postuna comment yapıyorsan ve hiç repost yoksa finish to check
            // eğer kendi postuna comment yapıyorsan ve post reposted.length var ise start to check
            if (post.userId._id.toString() === userId && post.reposted.length) {
              if (modalImage !== "") {
                cloudinary.uploader
                  .upload(modalImage, {
                    folder: process.env.CLOUDINARY_FOLDER_NAME,
                    allowed_formats: [
                      "jpg",
                      "mp4",
                      "ogv",
                      "png",
                      "pdf",
                      "webm",
                      "webp",
                    ],
                    quality: "auto:good",
                    width: 1200,
                    crop: "fill",
                    gravity: "auto",
                    fetch_format: "jpg",
                    format: "jpg",
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
                    createdCommentPostId = newCreatedPost._id.toString();

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
                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

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

                            // new thingy start to check
                            Comment.find({
                              postId: post.repostedFromThisOriginalPost[0]._id,
                            })
                              .then((findedComment) => {
                                findedComment[0].comments.unshift(
                                  newCreatedComment._id.toString()
                                );

                                findedComment[0].save();
                              })
                              .catch((error) => {
                                console.error("Error =>", error);
                              });
                            // new thingy finish to check
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      } else {
                        Post.find({ repostedFromThisOriginalPost: postId })
                          .then((referencePost) => {
                            referencePost[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );
                            referencePost[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              } else {
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
                    createdCommentPostId = newCreatedPost._id.toString();

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
                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

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

                            // new thingy start to check
                            Comment.find({
                              postId: post.repostedFromThisOriginalPost[0]._id,
                            })
                              .then((findedComment) => {
                                findedComment[0]?.comments.unshift(
                                  newCreatedComment._id.toString()
                                );

                                findedComment[0]?.save();
                              })
                              .catch((error) => {
                                console.error("Error =>", error);
                              });
                            // new thingy finish to check
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      } else {
                        Post.find({ repostedFromThisOriginalPost: postId })
                          .then((referencePost) => {
                            referencePost[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );
                            referencePost[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
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
              if (modalImage !== "") {
                cloudinary.uploader
                  .upload(modalImage, {
                    folder: process.env.CLOUDINARY_FOLDER_NAME,
                    allowed_formats: [
                      "jpg",
                      "mp4",
                      "ogv",
                      "png",
                      "pdf",
                      "webm",
                      "webp",
                    ],
                    quality: "auto:good",
                    width: 1200,
                    crop: "fill",
                    gravity: "auto",
                    fetch_format: "jpg",
                    format: "jpg",
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
                    createdCommentPostId = newCreatedPost._id.toString();

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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      post.save();
                      newCreatedPost.save();

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              } else {
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
                    createdCommentPostId = newCreatedPost._id.toString();

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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }
                      post.save();
                      newCreatedPost.save();
                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              }
            }

            // eğer başkasının postuna comment yapıyorsan ve bu post isReposted ise ve post.reposted.length var ise start to check
            else if (
              post.userId._id.toString() !== userId &&
              post.reposted.length
            ) {
              if (modalImage !== "") {
                cloudinary.uploader
                  .upload(modalImage, {
                    folder: process.env.CLOUDINARY_FOLDER_NAME,
                    allowed_formats: [
                      "jpg",
                      "mp4",
                      "ogv",
                      "png",
                      "pdf",
                      "webm",
                      "webp",
                    ],
                    quality: "auto:good",
                    width: 1200,
                    crop: "fill",
                    gravity: "auto",
                    fetch_format: "jpg",
                    format: "jpg",
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
                    createdCommentPostId = newCreatedPost._id.toString();

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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }
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

                            // new thingy start to check
                            Comment.find({
                              postId: post.repostedFromThisOriginalPost[0]._id,
                            })
                              .then((findedComment) => {
                                findedComment[0].comments.unshift(
                                  newCreatedComment._id.toString()
                                );

                                findedComment[0].save();
                              })
                              .catch((error) => {
                                console.error("Error =>", error);
                              });
                            // new thingy finish to check
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      } else {
                        Post.find({ repostedFromThisOriginalPost: postId })
                          .then((referencePost) => {
                            referencePost[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );
                            referencePost[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              } else {
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
                    createdCommentPostId = newCreatedPost._id.toString();

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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.error("Error =>", error);
                          });
                      }

                      // eğer post reposted ise hem orijinal posta hem current posta commenti ekle start to check
                      if (post.isReposted) {
                        Post.find({
                          _id: post.repostedFromThisOriginalPost[0],
                        }).then((originalPost) => {
                          originalPost[0].comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          post.comments.unshift(
                            newCreatedComment._id.toString()
                          );

                          post.save();
                          originalPost[0].save();

                          // new thingy start to check
                          Comment.find({
                            postId: post.repostedFromThisOriginalPost[0]._id,
                          })
                            .then((findedComment) => {
                              findedComment[0]?.comments.unshift(
                                newCreatedComment._id.toString()
                              );

                              if (findedComment[0]) {
                                findedComment[0].save();
                              }
                            })
                            .catch((error) => {
                              console.error("Error =>", error);
                            });
                          // new thingy finish to check
                        });
                      }

                      // eğer post reposted ise hem orijinal posta hem current posta commenti ekle finish to check

                      // eğer post reposted değil ise de hem orijinal posta hem current posta commenti ekle start to check
                      else {
                        Post.find({
                          repostedFromThisOriginalPost: post._id,
                        }).then((referencePost) => {
                          referencePost[0].comments.unshift(
                            newCreatedComment._id.toString()
                          );
                          post.comments.unshift(
                            newCreatedComment._id.toString()
                          );

                          post.save();
                          referencePost[0].save();
                        });
                      }
                      // eğer post reposted değil ise de hem orijinal posta hem current posta commenti ekle finish to check

                      newCreatedPost.save();
                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
                      });
                    });
                  })
                  .catch((error) => {
                    console.error("Error =>", error);
                  });
              }
            }
          }
          // eğer comment posta comment yapıyorsan ve bu post post.reposted.length  ise start to check
          else {
            Comment.findById(postId)
              .then((findedComment) => {
                Post.findById(findedComment.postId.toString())
                  .then((post) => {
                    if (post.reposted.length) {
                      // eğer comment içerisindeki commentlerden herhangi birine comment yapıyorsan ve bu commentin ayrıca reposted.lengthi varsa ve ayrıca image ekleyeceksen start to check
                      if (modalImage !== "") {
                        cloudinary.uploader
                          .upload(modalImage, {
                            folder: process.env.CLOUDINARY_FOLDER_NAME,
                            allowed_formats: [
                              "jpg",
                              "mp4",
                              "ogv",
                              "png",
                              "pdf",
                              "webm",
                              "webp",
                            ],
                            quality: "auto:good",
                            width: 1200,
                            crop: "fill",
                            gravity: "auto",
                            fetch_format: "jpg",
                            format: "jpg",
                          })
                          .then((result) => {
                            globalImageId = result.public_id;
                            globalImageUrl = result.secure_url;

                            Post.find({
                              repostedFromThisOriginalPost: post._id,
                            })
                              .then((findedReferencePost) => {
                                return Post.create({
                                  userId: userId,
                                  authorFullName: user.fullname,
                                  authorUserName: user.username,
                                  content: commentPost,
                                  isComment: true,
                                  image: {
                                    public_id: result.public_id,
                                    url: result.secure_url,
                                  },
                                  commentedForThisPost: post._id.toString(),
                                  commentedForThisUsersPost:
                                    post.userId._id.toString(),
                                })
                                  .then((newCreatedPost) => {
                                    createdCommentPostId =
                                      newCreatedPost._id.toString();

                                    return Comment.create({
                                      userId: userId,
                                      authorFullName: user.fullname,
                                      authorUserName: user.username,
                                      content: commentPost,
                                      isComment: true,
                                      image: {
                                        public_id: globalImageId,
                                        url: globalImageUrl,
                                      },
                                      commentedForThisPost: postId,
                                      commentedForThisUsersPost:
                                        post.userId._id.toString(),
                                      postId: newCreatedPost._id.toString(),
                                    }).then((newCreatedComment) => {
                                      user.posts.unshift(
                                        newCreatedPost._id.toString()
                                      );
                                      user.save();

                                      findedComment.comments.unshift(
                                        newCreatedComment._id.toString()
                                      );
                                      post.comments.unshift(
                                        newCreatedComment._id.toString()
                                      );
                                      findedReferencePost[0].comments.unshift(
                                        newCreatedComment._id.toString()
                                      );

                                      findedComment.save();
                                      post.save();
                                      findedReferencePost[0]
                                        .save()
                                        .then(() => {
                                          res.status(200).json({
                                            createdPost: newCreatedPost,
                                          });
                                        })
                                        .catch(() => {
                                          res.status(404).json({
                                            message:
                                              "Error occured while saving findedComment,post,findedReferencePost !",
                                          });
                                        });
                                    });
                                  })
                                  .catch(() => {
                                    res.status(404).json({
                                      message:
                                        "Error occured while fetching new created post !",
                                    });
                                  });
                              })
                              .catch(() => {
                                res.status(404).json({
                                  message: "Reference post not found !",
                                });
                              });
                          })
                          .catch(() => {});
                      }
                      // eğer comment içerisindeki commentlerden herhangi birine comment yapıyorsan ve bu commentin ayrıca reposted.lengthi varsa ve ayrıca image ekleyeceksen finish to check
                      else {
                        Post.find({
                          repostedFromThisOriginalPost: post._id,
                        })
                          .then((findedReferencePost) => {
                            return Post.create({
                              userId: userId,
                              authorFullName: user.fullname,
                              authorUserName: user.username,
                              content: commentPost,
                              isComment: true,
                              commentedForThisPost: post._id.toString(),
                              commentedForThisUsersPost:
                                post.userId._id.toString(),
                            })
                              .then((newCreatedPost) => {
                                createdCommentPostId =
                                  newCreatedPost._id.toString();

                                return Comment.create({
                                  userId: userId,
                                  authorFullName: user.fullname,
                                  authorUserName: user.username,
                                  content: commentPost,
                                  isComment: true,
                                  commentedForThisPost: postId,
                                  commentedForThisUsersPost:
                                    post.userId._id.toString(),
                                  postId: newCreatedPost._id.toString(),
                                }).then((newCreatedComment) => {
                                  user.posts.unshift(
                                    newCreatedPost._id.toString()
                                  );
                                  user.save();

                                  findedComment.comments.unshift(
                                    newCreatedComment._id.toString()
                                  );
                                  post.comments.unshift(
                                    newCreatedComment._id.toString()
                                  );
                                  findedReferencePost[0].comments.unshift(
                                    newCreatedComment._id.toString()
                                  );

                                  findedComment.save();
                                  post.save();
                                  findedReferencePost[0]
                                    .save()
                                    .then(() => {
                                      res
                                        .status(200)
                                        .json({ createdPost: newCreatedPost });
                                    })
                                    .catch(() => {
                                      res.status(404).json({
                                        message:
                                          "Error occured while saving findedComment,post,findedReferencePost !",
                                      });
                                    });
                                });
                              })
                              .catch(() => {
                                res.status(404).json({
                                  message:
                                    "Error occured while fetching new created post !",
                                });
                              });
                          })
                          .catch(() => {
                            res.status(404).json({
                              message: "Reference post not found !",
                            });
                          });
                      }
                    } else {
                      if (modalImage !== "") {
                        //  start to check
                        if (modalImage !== "") {
                          cloudinary.uploader
                            .upload(modalImage, {
                              folder: process.env.CLOUDINARY_FOLDER_NAME,
                              allowed_formats: [
                                "jpg",
                                "mp4",
                                "ogv",
                                "png",
                                "pdf",
                                "webm",
                                "webp",
                              ],
                              quality: "auto:good",
                              width: 1200,
                              crop: "fill",
                              gravity: "auto",
                              fetch_format: "jpg",
                              format: "jpg",
                            })
                            .then((result) => {
                              globalImageId = result.public_id;
                              globalImageUrl = result.secure_url;

                              return Post.create({
                                userId: userId,
                                authorFullName: user.fullname,
                                authorUserName: user.username,
                                content: commentPost,
                                isComment: true,
                                image: {
                                  public_id: result.public_id,
                                  url: result.secure_url,
                                },
                                commentedForThisPost: post._id.toString(),
                                commentedForThisUsersPost:
                                  post.userId._id.toString(),
                              })
                                .then((newCreatedPost) => {
                                  createdCommentPostId =
                                    newCreatedPost._id.toString();

                                  return Comment.create({
                                    userId: userId,
                                    authorFullName: user.fullname,
                                    authorUserName: user.username,
                                    content: commentPost,
                                    isComment: true,
                                    image: {
                                      public_id: globalImageId,
                                      url: globalImageUrl,
                                    },
                                    commentedForThisPost: postId,
                                    commentedForThisUsersPost:
                                      post.userId._id.toString(),
                                    postId: newCreatedPost._id.toString(),
                                  }).then((newCreatedComment) => {
                                    user.posts.unshift(
                                      newCreatedPost._id.toString()
                                    );
                                    user.save();

                                    findedComment.comments.unshift(
                                      newCreatedComment._id.toString()
                                    );
                                    post.comments.unshift(
                                      newCreatedComment._id.toString()
                                    );

                                    findedComment.save();
                                    post.save();
                                    res
                                      .status(200)
                                      .json({ createdPost: newCreatedPost });
                                  });
                                })
                                .catch(() => {
                                  res.status(404).json({
                                    message:
                                      "Error occured while fetching new created post !",
                                  });
                                });
                            });
                        }

                        // finish to check
                      } else {
                        return Post.create({
                          userId: userId,
                          authorFullName: user.fullname,
                          authorUserName: user.username,
                          content: commentPost,
                          isComment: true,
                          commentedForThisPost: post._id.toString(),
                          commentedForThisUsersPost: post.userId._id.toString(),
                        })
                          .then((newCreatedPost) => {
                            createdCommentPostId =
                              newCreatedPost._id.toString();

                            return Comment.create({
                              userId: userId,
                              authorFullName: user.fullname,
                              authorUserName: user.username,
                              content: commentPost,
                              isComment: true,
                              commentedForThisPost: postId,
                              commentedForThisUsersPost:
                                post.userId._id.toString(),
                              postId: newCreatedPost._id.toString(),
                            }).then((newCreatedComment) => {
                              user.posts.unshift(newCreatedPost._id.toString());
                              user.save();

                              findedComment.comments.unshift(
                                newCreatedComment._id.toString()
                              );
                              post.comments.unshift(
                                newCreatedComment._id.toString()
                              );

                              findedComment.save();
                              post.save();
                              res
                                .status(200)
                                .json({ createdPost: newCreatedPost });
                            });
                          })
                          .catch(() => {
                            res.status(404).json({
                              message:
                                "Error occured while fetching new created post !",
                            });
                          });
                      }
                    }
                  })
                  .catch(() => {
                    res.status(404).json({
                      errorMessage: "Post not found ! First error",
                    });
                  });
              })
              .catch(() => {
                res.status(404).json({ errorMessage: "Comment not found !" });
              });
          }
          // eğer comment posta comment yapıyorsan ve bu post post.reposted.length  ise finish to check
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
