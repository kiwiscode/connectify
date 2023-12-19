const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const axios = require("axios");
const saltRounds = 10;

const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const capitalize = require("../utils/capitalize");
const Post = require("../models/Post.model");
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

  // start to check trying to install chat engine (real time chatting engine)

  try {
    console.log("THIS LINE IS WORKING 1");

    const response = await axios.put(
      `https://api.chatengine.io/users/
        `,
      { username: username, secret: username, first_name: username },
      { headers: { "private-key": "09e71473-3844-4f5a-b4d1-765cf7745ea8" } }
    );

    console.log("RESPONSE FOR CONNECTING CHAT ENGINE =>", response.status);
    console.log("RESPONSE FOR CONNECTING CHAT ENGINE 2 =>", response.data);
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
          chatEngineInfos: response.data,
        });
      })
      .then((user) => {
        console.log("THIS LINE IS WORKING 4");
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        console.log("THIS LINE IS WORKING 5");
        sendVerificationEmail(user, token)
          .then((result) => {
            console.log("THIS LINE IS WORKING 6");
            console.log("RESULT AFTER EMAIL VERIFICATION SEND =>", result);
            res.status(response.status).json(response.data);
          })
          .catch((error) => {
            console.log("ERROR SENDING VERIFICATION EMAIL =>", error);
            res.status(500).json({
              errorMessage: "Error sending verification email.",
            });
          });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          console.log("ERROR LINE IS WORKING 1");
          res.status(501).json({
            errorMessage:
              "Username and email need to be unique. Provide a valid username or email.",
          });
        } else if (error.code === 11000) {
          console.log("ERROR LINE IS WORKING 2");

          res.status(501).json({
            errorMessage:
              "Username and email need to be unique. Provide a valid username or email.",
          });
        } else {
          console.log("ERROR LINE IS WORKING 3");

          next(error);
        }
      });
  } catch (error) {
    console.log("ERROR LINE IS WORKING 4");

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
      if (!user.verified) {
        res.status(400).json({
          errorMessage: "Email hasn't been verified yet.Check your inbox.",
        });
        return;
      }

      if (!user) {
        res.status(401).json({
          errorMessage: "Wrong credentials",
        });
      }

      Post.find()
        .then((post) => {
          console.log("USER POSTS:", post);
        })
        .catch(() => {});

      // const filteredUserFavorites =

      // if(user.favorites._id)

      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword || user.username !== username) {
            res.status(401).json({
              errorMessage: "Wrong credentials.",
            });
            return;
          }

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
              chatEngineInfos,
            } = user;

            const token = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });

            console.log(username);
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
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { handleSignup, handleLogin, handleEmailverify };
