const express = require("express");
const router = express();
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const bcrypt = require("bcrypt");

router.post("/add_gender_to_user", authenticateToken, async (req, res) => {
  try {
    const { genderOption } = req.body;
    const { userId } = req.user;

    console.log("Gender option =>", genderOption);

    if (!genderOption) {
      return res.status(400).json({ message: "Gender option is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { gender: genderOption },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Gender updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json("Server error!");
  }
});
router.post("/add_country_to_user", authenticateToken, async (req, res) => {
  try {
    const { countryOption } = req.body;
    const { userId } = req.user;

    console.log("Country option =>", countryOption);
    console.log("User id =>", userId);

    if (!countryOption) {
      return res.status(400).json({ message: "Country option is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { country: countryOption },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Country updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json("Server error!");
  }
});
router.post(
  "/add_phone_number_to_user",
  authenticateToken,
  async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const { userId } = req.user;

      console.log("Phone number =>", phoneNumber);
      console.log("User id =>", userId);

      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { phone_number: phoneNumber },
        { new: true, runValidators: true }
      );

      if (!phoneNumber) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Phone number updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json("Server error!");
    }
  }
);
router.post("/user_update_email", authenticateToken, async (req, res) => {
  try {
    const { newEmail } = req.body;
    const { userId } = req.user;

    console.log("New email =>", newEmail);
    console.log("User id =>", userId);

    if (!newEmail) {
      return res.status(400).json({ message: "New email option is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Email updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json("Server error!");
  }
});

function generateRandomCode() {
  const codeLength = 6;
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // 0 ile 9 arasında rastgele bir rakam oluşturur
    code += randomDigit;
  }

  return code;
}

let randomCode;
let countryCodeFromUser;
randomCode = generateRandomCode();

router.post("/phone_verification_code", authenticateToken, async (req, res) => {
  try {
    const { toNumber, countryCode } = req.body;
    const { userId } = req.user;
    countryCodeFromUser = countryCode;
    console.log("Country code =>", countryCode);
    console.log("Number =>", toNumber);
    console.log("User id =>", userId);
    console.log("To number =>", toNumber + countryCode);

    console.log("Random code =>", randomCode);
    const message = await client.messages.create({
      body: `Your C confirmation code is ${
        randomCode === undefined ? generateRandomCode() : randomCode
      }`,
      from: process.env.TWILIO_ACCOUNT_NUMBER,
      to: `+${countryCode + toNumber}`,
    });
    console.log(message.sid);
    res.status(201).json({
      code: randomCode,
      message: "Verification code to phone sent",
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json("Internal server error !");
  }
});

router.post("/verify_code", authenticateToken, async (req, res) => {
  try {
    const { verificationCodeInput, phoneNumberInput } = req.body;
    const { userId } = req.user;
    console.log("Verification code input =>", verificationCodeInput);
    console.log("Country code =>", countryCodeFromUser);
    console.log(
      "Is correct verification code =>",
      verificationCodeInput === randomCode ? "Correct code" : "Invalid code!"
    );
    console.log("Phone number input =>", phoneNumberInput);
    if (verificationCodeInput === randomCode) {
      resultPhoneNumberGlobal = {
        phone_number: phoneNumberInput,
        withoutPlusSign: `${countryCodeFromUser + phoneNumberInput}`,
        withPlusSign: `+${countryCodeFromUser + phoneNumberInput}`,
      };

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { phoneNumber: resultPhoneNumberGlobal },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      } else {
        countryCodeFromUser = undefined;
        randomCode = undefined;
      }

      res.json({
        success: true,
        status: 201,
        message: "Phone added successfully!",
      });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json("Internal server error !");
  }
});

router.post("/delete_phone_number", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phoneNumber: [] },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      status: 201,
      message: "Phone deleted successfully!",
    });
  } catch {
    res.status(500).json("Internal server error");
  }
});

router.post("/user_archive_request", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { archive_request: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      status: 201,
      message: "User archive requested successfully!",
    });
  } catch {
    res.status(500).json("Internal server error");
  }
});

router.post(
  "/enable_automated_account",
  authenticateToken,
  async (req, res) => {
    try {
      const { multi_factor_authentication_input } = req.body;
      const { userId } = req.user;

      console.log("Input =>", multi_factor_authentication_input);
      console.log("Active user =>", userId);

      const user = await User.findOne({
        $or: [
          { email: multi_factor_authentication_input },
          { username: multi_factor_authentication_input },
          {
            phoneNumber: {
              $elemMatch: {
                phone_number: multi_factor_authentication_input,
              },
            },
          },
          {
            phoneNumber: {
              $elemMatch: {
                withoutPlusSign: multi_factor_authentication_input,
              },
            },
          },
          {
            phoneNumber: {
              $elemMatch: {
                withPlusSign: multi_factor_authentication_input,
              },
            },
          },
        ],
      });

      if (user._id.toString() === userId) {
        res.status(403).json({
          message:
            "Managing accounts must be different than the automated account. Use a different account.",
        });
        return;
      }

      console.log("Finded user for managing (AKA(Merging)) :", user);

      if (user) {
        res.status(200).json({
          message: "User found and authorized for managing account.",
        });
      }
    } catch {
      res.status(404).json("User not found!");
    }
  }
);

router.post(
  "/add_automated_account_to_user",
  authenticateToken,
  async (req, res) => {
    try {
      const { automatedAccountAuthentication, password } = req.body;
      const { userId } = req.user;

      console.log("Automated account =>", automatedAccountAuthentication);
      console.log("User id =>", userId);

      if (!automatedAccountAuthentication) {
        return res
          .status(400)
          .json({ message: "Automated account information is required" });
      }

      const automatedAccount = await User.findOne({
        $or: [
          { email: automatedAccountAuthentication },
          { username: automatedAccountAuthentication },
          {
            phoneNumber: {
              $elemMatch: {
                phone_number: automatedAccountAuthentication,
              },
            },
          },
          {
            phoneNumber: {
              $elemMatch: {
                withoutPlusSign: automatedAccountAuthentication,
              },
            },
          },
          {
            phoneNumber: {
              $elemMatch: {
                withPlusSign: automatedAccountAuthentication,
              },
            },
          },
        ],
      });

      if (!automatedAccount) {
        return res.status(404).json({ message: "Automated account not found" });
      }
      const isAutomatedAccountPasswordMatch = await bcrypt.compare(
        password,
        automatedAccount.password
      );
      if (!isAutomatedAccountPasswordMatch) {
        return res.status(401).json({ errorMessage: "Wrong password!" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          automated_account: automatedAccount._id,
          automated_account_connected_message_show: true,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Automated account added successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json("Server error!");
    }
  }
);

router.post(
  "/change_show_managing_account_connected_message_status",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.user;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { automated_account_connected_message_show: null },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message:
          "Automated account connected message status has changed successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error =>", error);
      res.status(500).json("Server error!");
    }
  }
);

router.post(
  "/remove_automated_account_from_user",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.user;

      console.log("User id =>", userId);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { automated_account: null },
        { new: true, runValidators: true }
      );

      console.log("Updated user =>", updatedUser);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Automated account removed successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error =>", error);
      res.status(500).json("Server error!");
    }
  }
);

router.post(
  "/add_which_languages_do_you_speak_to_user",
  authenticateToken,
  async (req, res) => {
    try {
      const { languages } = req.body;
      const { userId } = req.user;

      console.log("Languages option =>", languages);

      if (!languages) {
        return res
          .status(400)
          .json({ message: "Languages option is required" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { which_languages_do_you_speak: languages },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Which languages do you speak field updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json("Server error!");
    }
  }
);

router.post("/toggle_profile_privacy", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json("User not found!");
    }
    const userPrivate = user.isPrivate;

    console.log("User private =>", userPrivate);

    if (userPrivate) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isPrivate: false },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "Privacy updated successfully", user: updatedUser });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isPrivate: true },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "Privacy updated successfully", user: updatedUser });
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.post("/toggle_protect_videos", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json("User not found!");
    }
    const userVidesProtected = user.isVideosProtected;

    console.log("User videos protected =>", userVidesProtected);

    if (userVidesProtected) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isVideosProtected: false },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: "Video privacy updated successfully",
        user: updatedUser,
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isVideosProtected: true },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: "Video privacy updated successfully",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.post(
  "/toggle_photo_tagging_permission",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.user;
      const { permission_option } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json("User not found!");
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { photoTaggingPermission: permission_option },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: "Photo tagging permission updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }
);
module.exports = router;
