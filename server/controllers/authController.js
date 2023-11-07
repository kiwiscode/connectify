const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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

  sendVerificationEmail = ({ email }, res, token) => {
    // when working on locally
    const baseURL = "http://localhost:3000";
    // when working on deployment version
    // const baseURL = "?"

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
        res.json({
          status: "PENDING",
          message: "Verification email sent",
        });
      })
      .catch(() => {
        res.json({
          status: "FAILED",
          message: "Verification email failed!",
        });
      })
      .catch(() => {
        res.json({
          status: "FAILED",
          message: "Couldn't save verification email data!",
        });
      });
  };
}

const handleSignup = (req, res, next) => {
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

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      fullname = capitalize(fullname);
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
      sendVerificationEmail(user, res, token);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(501).json({
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else if (error.code === 11000) {
        res.status(501).json({
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
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
    // .populate("posts")
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
