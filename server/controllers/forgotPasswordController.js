const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let sendConfirmationCodeToEmail;
emailProcess();

let sendEmailAfterChanginPassword;
emailProcessAfterChanginPassword();
const handleGetForgotPasswordProcessUser = (req, res) => {
  const { findConnectifyAccount } = req.body;

  console.log(
    "This user trying to find his/her password =>",
    findConnectifyAccount
  );

  User.find({
    $or: [
      { username: findConnectifyAccount },
      { email: findConnectifyAccount },
    ],
  })
    .then((userFromDB) => {
      console.log(
        "User from data base who is trying to find their password because they forgot password ! =>",
        userFromDB
      );

      if (userFromDB.length) {
        res.status(201).json({ user: userFromDB[0] });
      } else {
        res.status(404).json({
          errorMessage: "Sorry, we could not find your account.        ",
        });
      }
    })
    .catch((error) => {
      res.status(501).json({ errorMessage: "Internal server error!" });
    });
};

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

  sendConfirmationCodeToEmail = (user, verificationCode) => {
    // when working on local version
    const accountSettingsLink = "http://localhost:5173/";

    // when working on deployment version
    // ??

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: "Password reset request",

        html: `
        <div style="background-color: #f6f8fa
        ;  text-align: center;">
        <div style="width: 40%; height: 100%; background-color: white; margin: 0 auto; text-align: left; color: #333; padding: 20px;">
            <h1>Reset your password?</h1>
            <p>If you requested a password reset for @${user.username}, use the confirmation code below to complete the process. If you didn't make this request, ignore this email.</p>
            <strong style="font-size: 18px; padding: 10px; background-color: #ddd; border-radius: 5px; display: inline-block;">${verificationCode}</strong>
            <h3>Getting a lot of password reset emails?</h3>
            <p>You can change your <a href="${accountSettingsLink}" style="color: rgb(29, 155, 240); text-decoration: none; cursor: pointer; ">account settings</a> to require personal information to reset your password.</p>
        </div>
    </div>
          `,
      };

      transporter
        .sendMail(mailOptions)
        .then(() => {
          resolve({
            userInformation: user,
            verificationCode,
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

const generateRandomCode = () => {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const handleSendForgotPasswordProcessCodeToEmail = (req, res) => {
  const { forgotPasswordInProcessUser } = req.body;

  console.log(
    "Processed user username =>",
    forgotPasswordInProcessUser.username
  );
  console.log("Processed user email =>", forgotPasswordInProcessUser.email);

  console.log("Processed user id =>", forgotPasswordInProcessUser._id);

  User.findById(forgotPasswordInProcessUser._id)
    .then((user) => {
      console.log("User found =>", user.username);
      const verificationCode = generateRandomCode();
      console.log(verificationCode);
      sendConfirmationCodeToEmail(user, verificationCode)
        .then((result) => {
          console.log("Result after email send =>", result);

          res.status(201).json({ result: result });
        })
        .catch((error) => {
          console.log(
            "Error occured before sending verification code email =>",
            error
          );
        });
    })
    .catch((error) => {
      console.log("Error occured User not found!  =>", error);
    });
};

async function handleChangePasswordForgotPasswordTab(req, res) {
  const { forgotPasswordInProcessUser, newPassword } = req.body;

  console.log(forgotPasswordInProcessUser);
  console.log(newPassword);

  try {
    const user = await User.findById(forgotPasswordInProcessUser._id);
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(newPassword) || newPassword.length < 6) {
      res.status(402).json({
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
  }
}

function emailProcessAfterChanginPassword() {
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

  sendEmailAfterChanginPassword = (user) => {
    const accountSettingsLink = "http://localhost:5173/";

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: "Your Connectify password has been changed",
        html: `
        <div style="background-color: #e1e8ec
        ;  text-align: center;">
        <div style="width: 40%; height: 100%; background-color: white; margin: 0 auto; text-align: left; color: #333; padding: 20px;">
        <p style="color: #66757f">Hi ${user.username},</p>
        <p>	
        You recently changed the password associated with your account @${user.username}. Based on this change, please be aware that additional changes to your account may be restricted temporarily.</p> 
        <h5>If you did not make this change and believe your Connectify account has been compromised, please <a href="${accountSettingsLink}" style="color: rgb(29, 155, 240); text-decoration: none; cursor: pointer; ">contact Connectify support</a>.</h5>
        </div>
    </div>
   
            `,
      };

      transporter
        .sendMail(mailOptions)
        .then(() => {
          resolve({
            userInformation: user,
            status: "PENDING",
            message: "Information email sent",
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          reject({
            status: "FAILED",
            message: "Information email failed!",
          });
        });
    });
  };
}

const saltRounds = 10;

const changePasswordInForgotPasswordProcess = (req, res) => {
  const { user, newPassword } = req.body;

  console.log("User after forgot password process tries to log in =>", user);

  console.log("New password =>", newPassword);

  User.findOne({ email: user.email })
    .then((findedUser) => {
      console.log("Finded user =>", findedUser);

      bcrypt
        .genSalt(saltRounds)
        .then((salt) => {
          return bcrypt.hash(newPassword, salt);
        })
        .then((hash) => {
          console.log("Hash =>", hash);

          findedUser.password = hash;
          findedUser
            .save()
            .then(() => {
              res.status(201).json({
                message:
                  "User password hashed and saved successfully to the database !",
              });
            })
            .catch(() => {
              res.status(501).json({
                message: "Internal server error while saving hash password",
              });
            });
        })
        .catch((err) => console.error(err.message));
    })
    .catch(() => {
      res.status(404).json({ errorMessage: "User not found !" });
    });
};

const handleLoginAfterForgotPasswordProcess = (req, res) => {
  const { user, newPassword } = req.body;
  console.log(
    "User after forgot password process tries to log in =>",
    user.password
  );

  console.log("New password =>", newPassword);

  if (user.username === "" || user.password === "") {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory.Please provide username,email,and password",
    });
    return;
  }

  User.findById(user._id)
    // today changed 13 nov
    .populate("posts")
    // today changed 13 nov
    .populate("followers")
    .populate("following")
    .populate("favorites")
    .populate("messages")
    .then((userFromDB) => {
      bcrypt
        .compare(newPassword, userFromDB.password)
        .then((isSamePassword) => {
          console.log(
            "Is same password forgot password section ?",
            isSamePassword
          );
          if (!isSamePassword) {
            res.status(401).json({ errorMessage: "Wrong password!" });
          } else if (userFromDB.isDeactivated) {
            res.status(400).json({
              errorMessage: "Deactivated user !",
              user: user,
            });
          } else if (!userFromDB.verified) {
            res.status(402).json({
              errorMessage: "Email hasn't been verified yet.Check your inbox.",
            });
          } else {
            setTimeout(() => {
              sendEmailAfterChanginPassword(user);
            }, 500);
            userFromDB.active = true;
            userFromDB.save().then((user) => {
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

module.exports = {
  handleGetForgotPasswordProcessUser,
  handleSendForgotPasswordProcessCodeToEmail,
  handleChangePasswordForgotPasswordTab,
  handleLoginAfterForgotPasswordProcess,
  changePasswordInForgotPasswordProcess,
};
