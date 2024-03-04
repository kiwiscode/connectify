const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const axios = require("axios");
const saltRounds = 10;

const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const capitalize = require("../utils/capitalize");
const Post = require("../models/Post.model");
require("dotenv").config();
let sendVerificationEmail;
emailProcess();

function emailProcess() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error(error);
    } else {
      console.log(success);
    }
  });

  sendVerificationEmail = ({ email }, token) => {
    return new Promise((resolve, reject) => {
      const baseURL = "http://localhost:3000";

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `
          <p>Verify your email adress to complete the signup and login into your account.</p>
          <p>This link expires in <b>6 hours.</b></p>
          <p>Press : <a href="${baseURL}/auth/verify?token=${token}"> here </a>to proceed.</p>
        `,
      };

      transporter
        .sendMail(mailOptions)
        .then(() => {
          resolve({
            status: "PENDING",
            message: "Verification email sent",
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          reject({
            status: "FAILED",
            message: "Verification email failed!",
          });
        });
    });
  };
}

const handleSignup = async (req, res, next) => {
  let { fullname, username, email, password } = req.body;

  if (username === "" || fullname === "" || email === "" || password === "") {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory.Please provide your username,email and password",
    });
    return;
  }

  if (username.length > 15) {
    res.status(403).json({
      errorMessage: "Your username must be shorter than 15 characters",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password) || password.length < 6) {
    res.status(402).json({
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(405).json({
      errorMessage: "Please provide a valid email address.",
    });
    return;
  }

  User.find()
    .then((allUsersFromDB) => {
      console.log("All users =>", allUsersFromDB);

      const allUserNames = allUsersFromDB.map((eachUser) => {
        return eachUser.username;
      });

      const allEmails = allUsersFromDB.map((eachUser) => {
        return eachUser.email;
      });

      if (allUserNames.includes(username)) {
        res.status(409).json({
          errorMessage: "That username has been taken. Please choose another",
        });
        return;
      }

      if (allEmails.includes(email)) {
        res.status(409).json({
          errorMessage: "Email has already been taken",
        });
        return;
      }

      console.log("All user names =>", allUserNames);
      console.log("All user emails =>", allEmails);
    })
    .catch((error) => {
      console.log("Error occured while fetching all users from data base");
    });

  // start to check trying to install chat engine (real time chatting engine)

  try {
    console.log("THIS LINE IS WORKING 1");

    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        console.log("THIS LINE IS WORKING 2");

        fullname = capitalize(fullname);
        console.log("THIS LINE IS WORKING 3");
        return User.create({
          fullname,
          username,
          email,
          password: hashedPassword,
          verified: false,
          imageUrl: "../assets/resume-pic.png",
        });
      })
      .then((user) => {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        console.log("THIS LINE IS WORKING 5");
        sendVerificationEmail(user, token)
          .then((result) => {
            console.log("THIS LINE IS WORKING 6");
            console.log("RESULT AFTER EMAIL VERIFICATION SEND =>", result);
            res.status(201).json({ message: "Verification email sent" });
          })
          .catch((error) => {
            console.log("ERROR SENDING VERIFICATION EMAIL =>", error);
            res.status(500).json({
              errorMessage: "Error sending verification email.",
            });
          });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    return res.status(error.response.status).json(error.response.data);
  }
  // finish to check trying to install chat engine (real time chatting engine)
};

const handleEmailverify = (req, res) => {
  const token = req.query.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.redirect("/auth/verify?error=true&message=Invalid token");
    } else {
      const userId = decoded.userId;
      User.findByIdAndUpdate(userId, { verified: true })
        .then(() => {
          res.json({ message: "Email verified ! Now you can log in..." });
        })
        .catch(() => {
          res.json({ message: "Something went wrong !" });
        });
    }
  });
};

const handleLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory.Please provide username,email,and password",
    });
    return;
  }

  if (password.length < 6) {
    return res.status(402).json({
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  User.findOne({ username })
    // today changed 13 nov
    .populate("posts")
    // today changed 13 nov
    .populate("followers")
    .populate("following")
    .populate("favorites")
    .populate("messages")
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          console.log("Is same password ?", isSamePassword);
          if (!isSamePassword) {
            res.status(401).json({ errorMessage: "Wrong password!" });
          } else if (user.isDeactivated) {
            res.status(400).json({
              errorMessage: "Deactivated user !",
              user: user,
            });
          } else if (!user.verified) {
            res.status(402).json({
              errorMessage: "Email hasn't been verified yet.Check your inbox.",
            });
          } else {
            user.active = true;
            user.save().then((user) => {
              const {
                _id,
                username,
                email,
                fullname,
                verified,
                active,
                posts,
                followers,
                following,
                messages,
                createdAt,
                updatedAt,
                favorites,
                imageUrl,
                notifications,
              } = user;

              const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
              });

              console.log("Logged in user username =>", username);
              res.json({
                token,
                user: {
                  _id,
                  username,
                  email,
                  fullname,
                  verified,
                  active,
                  posts,
                  followers,
                  following,
                  messages,
                  createdAt,
                  updatedAt,
                  favorites,
                  imageUrl,
                  notifications,
                },
              });
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            errorMessage: "Invalid server error!",
          });
        });
    })
    .catch(() => {
      // user not found error handling
      res.status(400).json({
        errorMessage: "Sorry, we could not find your account.",
      });
    });
};

const handleDeactivatedUserLoginBack = (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory.Please provide username,email,and password",
    });
    return;
  }

  if (password.length < 6) {
    return res.status(402).json({
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  User.findOne({ username })
    // today changed 13 nov
    .populate("posts")
    // today changed 13 nov

    .populate("followers")
    .populate("following")
    .populate("favorites")
    .populate("messages")
    .then((userRequestingReactivation) => {
      console.log(
        "User ready to come back :) =>",
        userRequestingReactivation.username
      );

      bcrypt
        .compare(password, userRequestingReactivation.password)
        .then((isSamePassword) => {
          if (
            !isSamePassword ||
            userRequestingReactivation.username !== username
          ) {
            res.status(401).json({
              errorMessage: "Wrong credentials.",
            });
            return;
          }
          userRequestingReactivation.isDeactivated = false;
          userRequestingReactivation.deactivatedDate = null;
          userRequestingReactivation.active = true;

          Post.updateMany(
            { userId: userRequestingReactivation._id.toString() },
            { $set: { deactivatedOwner: false } }
          )
            .then((result) => {
              console.log(`${result} posts have been successfully updated.`);
            })
            .catch((error) => {
              console.error("Error updating posts:", error.message);
            });

          User.find()
            .then((users) => {
              users.forEach((user) => {
                user.messages.forEach((message) => {
                  message.members.forEach((eachMember) => {
                    if (
                      eachMember._id.toString() ===
                      userRequestingReactivation._id.toString()
                    ) {
                      console.log("Room =>", message);

                      console.log("This line is working  1 !!!");

                      if (
                        user._id.toString() !==
                        userRequestingReactivation._id.toString()
                      ) {
                        console.log("This line is working 2 !!!");
                        message.deactivatedMember = false;
                        user.save();
                      }
                    }
                  });
                });
              });
              userRequestingReactivation.save().then((reactivatedUser) => {
                const {
                  _id,
                  username,
                  email,
                  fullname,
                  verified,
                  active,
                  posts,
                  followers,
                  following,
                  messages,
                  createdAt,
                  updatedAt,
                  favorites,
                  imageUrl,
                  notifications,
                  chatEngineInfos,
                } = reactivatedUser;

                const token = jwt.sign(
                  { userId: _id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "24h",
                  }
                );

                console.log("Logged in user username =>", username);
                res.json({
                  token,
                  user: {
                    _id,
                    username,
                    email,
                    fullname,
                    verified,
                    active,
                    posts,
                    followers,
                    following,
                    messages,
                    createdAt,
                    updatedAt,
                    favorites,
                    imageUrl,
                    notifications,
                    chatEngineInfos,
                  },
                });
              });
            })
            .catch((error) => {
              console.error("Error:", error.message);
            });
        });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found!" });
    });
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const generateRandomCode = () => {
  const min = 100000; // En küçük 6 haneli sayı
  const max = 999999; // En büyük 6 haneli sayı
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const verificationCode = generateRandomCode();
console.log(verificationCode);

const sendSms = async (body) => {
  let msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: "+4915781219181",
    body,
  };

  try {
    const message = await client.messages.create(msgOptions);
    console.log("Message =>", message);
  } catch (error) {
    console.log("Error =>", error);
  }
};

sendSms(`Your verification code is: ${verificationCode}`);

module.exports = {
  handleSignup,
  handleLogin,
  handleEmailverify,
  handleDeactivatedUserLoginBack,
};
