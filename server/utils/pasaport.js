const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const capitalize = require("../utils/capitalize");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!existingUser) {
          console.log(
            "google profile during log in when user not exist :",
            profile
          );

          const fullname = profile.displayName;
          let username =
            fullname.split(/\s+/).join("") +
            generate5DifferentNumbers().join("");
          const email = profile._json.email;
          const password = profile.id;
          const googleId = profile.id;
          const imageUrl = profile._json.picture;
          const verified = profile._json.email_verified;

          const salt = await bcrypt.genSalt(saltRounds);

          const hashedPassword = await bcrypt.hash(password, salt);
          const hashedGoogleId = await bcrypt.hash(googleId, salt);

          if (username) {
            username = capitalize(username);
          }

          const newUser = await User.create({
            fullname,
            username,
            email,
            password: hashedPassword,
            googleId: hashedGoogleId,
            imageUrl,
            verified,
            ipAddress: "placeHolder",
            signedUpWithGoogle: {
              isSignedUpWithGoogle: true,
              isUsernameCustomizationModalShown: false,
              isUsernameCustomized: false,
            },
          });

          console.log("user created");

          // Google ID'yi callback'e dahil ederek geri dön
          return callback(null, newUser, { googleId: profile.id });
        } else {
          console.log("google profile during log in when user exist:", profile);

          if (!existingUser.googleId) {
            const googleId = profile.id;

            const salt = await bcrypt.genSalt(saltRounds);
            const hashedGoogleId = await bcrypt.hash(googleId, salt);

            existingUser.active = true;
            existingUser.googleId = hashedGoogleId;
          }

          await existingUser.save();

          // Mevcut kullanıcının Google ID'sini de gönder
          return callback(null, existingUser, { googleId: profile.id });
        }
      } catch (err) {
        callback(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const existingUser = await User.findById(id);
    console.log("deserialize user:", existingUser);
    done(null, existingUser);
  } catch (err) {
    done(err, null);
  }
});
module.exports = passport;
