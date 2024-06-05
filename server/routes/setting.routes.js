const express = require("express");
const router = express();
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

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

    const message = await client.messages.create({
      body: `Your C confirmation code is ${randomCode}`,
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
    if (verificationCodeInput === randomCode) {
      resultPhoneNumberGlobal = {
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

module.exports = router;
