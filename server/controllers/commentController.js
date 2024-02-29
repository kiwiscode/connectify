const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const cloudinary = require("../utils/cloudinary");

let globalImageId;
let globalImageUrl;
const addComment = (req, res) => {
  const { userId, postId, commentPost, modalImage } = req.body;

  User.findById(userId)
    .then((user) => {
      Post.findById(postId)
        .then((post) => {
          if (post) {
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
                        console.log(
                          "You are adding a comment to another comment post inside your post 1"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment) {
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();

                            console.log(
                              "You are added a comment to another comment post inside your post 2"
                            );
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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
                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        console.log(
                          "You are adding a comment to another comment post inside your post 1 second condition"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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
                                console.log("ERROR =>", error);
                              });
                            // new thingy finish to check
                          })
                          .catch((error) => {
                            console.log("Error =>", error);
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
                            console.log(error);
                          });
                      }

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
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
                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        console.log(
                          "You are adding a comment to another comment post inside your post 2 second condition"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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
                            console.log("-----this line is working !");

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
                                console.log("ERROR =>", error);
                              });
                            // new thingy finish to check
                          })
                          .catch((error) => {
                            console.log("Error =>", error);
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
                            console.log(error);
                          });
                      }

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        console.log(
                          "You are adding a comment to another comment post inside someones post 1 third condition"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
                          });
                      }

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

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        console.log(
                          "You are adding a comment to another comment post inside someones post 2 third condition"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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
                    console.log(error);
                  });
              }
            }

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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        console.log(
                          "You are adding a comment to another comment post inside someones post 1 fourth condition"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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
                                console.log("ERROR =>", error);
                              });
                            // new thingy finish to check
                          })
                          .catch((error) => {
                            console.log("Error =>", error);
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
                            console.log(error);
                          });
                      }

                      return user.save().then(() => {
                        res.status(200).json({ createdPost: newCreatedPost });
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

                      // peki ya commente comment yapıldığında ne olacak ????
                      if (post.isComment && !post.isReposted) {
                        console.log(
                          "You are adding a comment to another comment post inside someones post 2 fourth condition"
                        );
                        Comment.find({ postId: postId })
                          .then((findedComment) => {
                            findedComment[0].comments.unshift(
                              newCreatedComment._id.toString()
                            );

                            findedComment[0].save();
                          })
                          .catch((error) => {
                            console.log("ERROR =>", error);
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
                              findedComment[0].comments.unshift(
                                newCreatedComment._id.toString()
                              );

                              findedComment[0].save();
                            })
                            .catch((error) => {
                              console.log("ERROR =>", error);
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
                    console.log(error);
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
                        console.log("Bu line çalışıyor !");

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
                        console.log("Bu line çalışıyor 2 !");

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
                        console.log("Bu kısım çalışıyor !");
                        //  start to check
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
