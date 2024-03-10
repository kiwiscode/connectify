const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
require("dotenv").config();

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

/* =================== Handeling Infinite run: Start ===================  */
passport.serializeUser((user, done) => {
  console.log("1");
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    console.log("2");
    done(null, user);
  });
});

const crypto = require("crypto");

// For Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("User =>", profile);
      // profile has all google login data
      /* ========= DATABASE CHECK PRE EXIST AND INSERT QUERY: START =========  */
      function generateRandomPassword(length) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const passwordArray = new Uint8Array(length);

        crypto.randomFillSync(passwordArray);

        return passwordArray
          .map((value) => characters[value % characters.length])
          .join("");
      }

      const secureRandomPassword = generateRandomPassword(12);

      User.findOne({ signedUpWithGoogleUserId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            console.log("User is already exist !");
          } else {
            console.log(
              "This user was not exist and now created with google profile !"
            );
            return User.create({
              signedUpWithGoogle: true,
              signedUpWithGoogleUserId: profile._json.sub,
              fullname: profile._json.name,
              username:
                profile._json.name.split(/\s+/).join("") +
                generate5DifferentNumbers().join(""),
              email: profile._json.email,
              password: secureRandomPassword,
              verified: profile._json.email_verified,
              active: true,
              imageUrl: profile._json.picture,
            }).then((user) => {
              console.log("Created user =>", user);
            });
          }
        })
        .catch(() => {
          res.status(501).json({ errorMessage: "Internal server error !" });
        });

      /* ========= DATABASE CHECK PRE EXIST AND INSERT QUERY: END =========  */
    }
  )
);
