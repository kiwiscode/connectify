const express = require("express");
const router = express();
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const bcrypt = require("bcrypt");
const Subscription = require("../models/Subscription.model");

router.post("/add_gender_to_user", authenticateToken, async (req, res) => {
  try {
    const { genderOption } = req.body;
    const { userId } = req.user;

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

let countryCodeFromUser;
let randomCode;
randomCode = generateRandomCode();

router.post("/phone_verification_code", authenticateToken, async (req, res) => {
  try {
    const { toNumber, countryCode } = req.body;
    const { userId } = req.user;
    countryCodeFromUser = countryCode;

    randomCode = randomCode === undefined ? generateRandomCode() : randomCode;

    const message = await client.messages.create({
      body: `Your Connectify confirmation code is ${randomCode}`,
      from: process.env.TWILIO_ACCOUNT_NUMBER,
      to: `+${countryCode + toNumber}`,
    });
    res.status(201).json({
      code: randomCode,
      message: "Verification code to phone sent",
    });
  } catch (error) {
    res.status(500).json("Internal server error !");
  }
});

router.post("/verify_code", authenticateToken, async (req, res) => {
  try {
    const { verificationCodeInput, phoneNumberInput } = req.body;
    const { userId } = req.user;

    function removeLeadingZero(phoneNumber) {
      if (phoneNumber.startsWith("0")) {
        return phoneNumber.slice(1);
      }
      return phoneNumber;
    }

    const cleanedPhoneNumber = removeLeadingZero(phoneNumberInput);

    if (verificationCodeInput === randomCode) {
      resultPhoneNumberGlobal = {
        phone_number: cleanedPhoneNumber,
        withoutPlusSign: `${countryCodeFromUser + cleanedPhoneNumber}`,
        withPlusSign: `+${countryCodeFromUser + cleanedPhoneNumber}`,
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

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { automated_account: null },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Automated account removed successfully",
        user: updatedUser,
      });
    } catch (error) {
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
    console.error("Error: ", error);
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
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/subscription", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const subscription = await Subscription.find({
      owner: userId,
      isActive: true,
    });
    const activeCancelledSubscription = await Subscription.find({
      owner: userId,
      isActive: false,
      remainingTimeSubscription: { $ne: null },
    });

    const responseData = {
      activeSubscription: subscription,
      activeCancelledSubscription: activeCancelledSubscription,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/remaining_time_subscriptions",
  authenticateToken,
  async (req, res) => {
    try {
      const remainingTimeSubscriptions = await Subscription.find({
        isActive: false,
        remainingTimeSubscription: { $ne: null },
      });

      const responseData = {
        remainingTimeSubscriptions: remainingTimeSubscriptions,
      };

      res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/cancel_subscription", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const activeSubscription = await Subscription.findOne({
      owner: userId,
      isActive: true,
    });

    const billingCycle = activeSubscription.subscriptionDetails.billingCycle;

    const nextBillingDateForAnnualSub = (inputDate) => {
      let newDate = new Date(inputDate);
      newDate.setFullYear(newDate.getFullYear() + 1);

      let options = { day: "numeric", month: "long", year: "numeric" };
      let formattedDate = newDate.toLocaleDateString("en-GB", options);

      return formattedDate;
    };

    const nextBillingDateForMonthlySub = (inputDate) => {
      let newDate = new Date(inputDate);
      newDate.setMonth(newDate.getMonth() + 1);

      let options = { day: "numeric", month: "long", year: "numeric" };
      let formattedDate = newDate.toLocaleDateString("en-GB", options);

      return formattedDate;
    };

    const subscription = await Subscription.findOneAndUpdate(
      { owner: userId, isActive: true },
      {
        $set: {
          isActive: false,
          cancelledDate: new Date(),
          remainingTimeSubscription:
            billingCycle === "Monthly Plan"
              ? nextBillingDateForMonthlySub(activeSubscription.createdAt)
              : nextBillingDateForAnnualSub(activeSubscription.createdAt),
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        hasSubscription: false,
        successSubscriptionModalShown: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (subscription) {
      res.status(200).json({
        message: "Subscription cancelled successfully.",
        subscription: subscription,
      });
    } else {
      res.status(404).json({
        message: "No active subscription found for the user.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling subscription.",
      error: error.message,
    });
  }
});

module.exports = router;
