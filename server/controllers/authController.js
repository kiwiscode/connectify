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
let sendVerificationCodeToEmail;
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

  sendVerificationCodeToEmail = (email, verificationCode) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: `${verificationCode} is your Connectify verification code`,
        html: `
        <div style="background-color: #f6f8fa
        ;  text-align: center;">
        <div style="width: 40%; height: 100%; background-color: white; margin: 0 auto; text-align: left; color: #333; padding: 20px;">
            <h1>Confirm your email address</h1>
            <p>There’s one quick step you need to complete before creating your Connectify account. Let’s make sure this is the right email address for you — please confirm this is the right address to use for your new account.</p>
            <p>Please enter this verification code to get started on Connectify:</p>
            <strong style="font-size: 18px; padding: 10px; background-color: #ddd; border-radius: 5px; display: inline-block;">${verificationCode}</strong>
            <p>Verification codes expire after two hours.</p>
            <p>Thanks,</p>
            <p>Connectify</p>
        </div>
    </div>
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

const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generate5DifferentNumbers = () => {
  const shuffledNums = shuffleArray([...nums]);
  return shuffledNums.slice(0, 5);
};

const handleSignup = async (req, res, next) => {
  let { signedUserInfo } = req.body;

  console.log(signedUserInfo);

  let fullname = signedUserInfo.fullname;
  const email = signedUserInfo.email;
  const password = signedUserInfo.password;
  const birthMonth = signedUserInfo.selectedMonth;
  const birthDay = signedUserInfo.selectedDay;
  const birthYear = signedUserInfo.selectedYear;

  console.log(fullname, email, password, birthMonth, birthDay, birthYear);

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password) || password.length < 8) {
    res.status(402).json({
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  const allUsers = await User.find();

  const allUserNames = allUsers.map((eachUser) => {
    return eachUser.username.toLowerCase();
  });

  const username = fullname.split(/\s+/).join("");

  if (allUserNames.includes(username.toLowerCase())) {
    res.status(409).json({
      errorMessage: "This user name is already exist ! Use another one !",
    });
  } else {
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
            username: username + generate5DifferentNumbers().join(""),
            email,
            password: hashedPassword,
            verified: true,
            imageUrl: "../assets/resume-pic.png",
            birthDate: {
              month: birthMonth,
              day: birthDay,
              year: birthYear,
            },
            signedUpWithVariantOne: {
              isSignedUpWithVariantOne: true,
              isUsernameCustomized: false,
              isUsernameCustomizationModalShown: false,
              isProfileImageCustomizationModalShown: false,
            },
          });
        })
        .then((user) => {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          res.status(201).json({ token: token });
          console.log("THIS LINE IS WORKING 5");
          console.log("Token =>", token);
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      return res.status(error.response.status).json(error.response.data);
    }
  }
};

const handleLogin = (req, res, next) => {
  const { authentication, password } = req.body;

  console.log("Signed user =>", authentication);

  const email = authentication.email;

  User.findOne({ email })
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
          console.log(
            "Is same password auth controller section ?",
            isSamePassword
          );
          if (!isSamePassword) {
            res.status(401).json({ errorMessage: "Wrong password!" });
          } else if (user.isDeactivated) {
            console.log("Deactivated user is here !");
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

            if (
              user.signedUpWithVariantOne.isSignedUpWithVariantOne &&
              !user.signedUpWithVariantOne
                .isProfileImageCustomizationModalShown &&
              !user.signedUpWithVariantOne.isUsernameCustomizationModalShown
            ) {
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
                  signedUpWithGoogle,
                  signedUpWithVariantOne,
                  bio,
                } = user;

                const token = jwt.sign(
                  { userId: _id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "7d",
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
                    signedUpWithGoogle,
                    signedUpWithVariantOne,
                    bio,
                  },
                  message:
                    "Show 2 modal, first => profile image customization modal, second => username customization modal",
                });
              });
            } else {
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
                  signedUpWithGoogle,
                  signedUpWithVariantOne,
                  bio,
                } = user;

                const token = jwt.sign(
                  { userId: _id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "7d",
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
                    signedUpWithGoogle,
                    signedUpWithVariantOne,
                    bio,
                  },
                });
              });
            }
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
                    expiresIn: "7d",
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

const handleEmailCheck = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email.        ",
      });
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|proton|zoho|mail|aol|yandex)\.(com|org|net|gov|edu|mil|co|info|de|co.uk|ca|me|tr|com.tr)$/;

    const checkEmailValidation = () => {
      if (email.match(emailRegex)) {
        return true;
      } else {
        return false;
      }
    };
    const existingUser = await User.findOne({ email });

    if (checkEmailValidation() === true) {
      if (existingUser) {
        return res
          .status(200)
          .json({ success: true, message: "Email has already been taken." });
      } else {
        return res
          .status(201)
          .json({ success: false, message: "Email is available" });
      }
    } else {
      return res
        .status(304)
        .json({ success: false, message: "Please enter a valid email." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const handleEmailVerificationCode = (req, res) => {
  const { receiverEmail } = req.body;

  let randomCode = [];

  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const generateRandomCode = () => {
    const randomIndex = Math.floor(Math.random() * characters.length + 1);

    return randomIndex;
  };

  for (let i = 0; i < 6; i++) {
    console.log("Random index =>", generateRandomCode());

    console.log(
      "Random code value individual =>",
      characters[generateRandomCode()]
    );

    randomCode.push(characters[generateRandomCode()]);
  }

  console.log("Random code =>", randomCode.join(""));

  console.log("Email received =>", receiverEmail);
  sendVerificationCodeToEmail(receiverEmail, randomCode.join(""))
    .then((result) => {
      console.log("RESULT AFTER EMAIL VERIFICATION SEND =>", result);

      res.status(201).json({
        code: randomCode.join(""),
        message: "Verification code to email sent",
      });
    })
    .catch((error) => {
      console.log("ERROR SENDING VERIFICATION EMAIL =>", error);
      res.status(500).json({
        errorMessage: "Error sending verification email.",
      });
    });
};

// start to check modal status changing for pick a profile picture and what should we call you modal
const handleChangeModalStatusVariantOne = (req, res) => {
  console.log(req.body);
  const { userId } = req.body;

  console.log("User id =>", userId);
  User.findById(userId)
    .then((user) => {
      user.signedUpWithVariantOne.isProfileImageCustomizationModalShown = true;

      user
        .save()
        .then(() => {
          res.status(201).json({ user: user });
        })
        .catch(() => {
          res.status(501).json({
            errorMessage: "Error occured while trying to change status !",
          });
        });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found !" });
    });
};
const handleChangeModalStatusVariantOneModal2 = (req, res) => {
  console.log(req.body);
  const { userId } = req.body;

  console.log("User id =>", userId);
  User.findById(userId)
    .then((user) => {
      user.signedUpWithVariantOne.isUsernameCustomizationModalShown = true;
      user.signedUpWithGoogle.isUsernameCustomizationModalShown = true;
      user
        .save()
        .then(() => {
          res.status(201).json({ user: user });
        })
        .catch(() => {
          res.status(501).json({
            errorMessage: "Error occured while trying to change status !",
          });
        });
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found !" });
    });
};

// finish to check modal status changing for pick a profile picture and what should we call you modal

const handleUsernameCheck = async (req, res) => {
  try {
    const { username } = req.body;
    const checkUserName = username.toLowerCase();
    console.log("test");
    const allUsers = await User.find();

    const allUserNames = allUsers.map((eachUser) =>
      eachUser.username.toLowerCase()
    );

    let countSpaces = 0;
    for (let i = 0; i < username.length; i++) {
      if (username[i] === " ") {
        countSpaces++;
      }
    }

    console.log("Username =>", username);

    if (allUserNames.includes(checkUserName)) {
      res.status(409).json({
        errorMessage: "That username has been taken. Please choose another.",
      });
    } else {
      console.log("Username not exist! You can choose this one!");

      if (username.length <= 15 && username.length >= 4 && countSpaces < 1) {
        res.status(200).json({
          successMessage:
            "Username is available. User username ready to update.",
        });
      } else if (username.length < 4) {
        res.status(501).json({
          errorMessage: "Username must be at least 4 characters long.",
        });
      } else if (username.length > 15) {
        res.status(501).json({
          errorMessage: "Username cannot exceed 15 characters.",
        });
      } else {
        res.status(501).json({
          errorMessage:
            "Your username cannot contain spaces. Please choose a username without spaces.",
        });
      }
    }

    console.log("Username from front end =>", username);
  } catch (error) {
    console.error("Error during username check:", error);
    res
      .status(500)
      .json({ errorMessage: "An error occurred during username check." });
  }
};
const handleUsernameChange = async (req, res) => {
  try {
    const { username, userId } = req.body;

    console.log("Username =>", username);
    console.log("User id =>", userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = username;
    if (user.signedUpWithGoogle.isSignedUpWithGoogle) {
      user.signedUpWithGoogle.isUsernameCustomizationModalShown = true;
      user.signedUpWithGoogle.isUsernameCustomized = true;
    } else {
      user.signedUpWithVariantOne.isUsernameCustomized = true;
      user.signedUpWithVariantOne.isUsernameCustomizationModalShown = true;
    }
    await user.save();

    res.status(200).json({
      user: user,
      success: true,
      message: "Username updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
  handleDeactivatedUserLoginBack,
  handleEmailCheck,
  handleEmailVerificationCode,
  handleUsernameCheck,
  handleUsernameChange,
  handleChangeModalStatusVariantOne,
  handleChangeModalStatusVariantOneModal2,
};
