const User = require("../models/User.model");

const handleThisUserPhoneVerified = async (req, res) => {
  const { isPhoneVerifiedThisUser } = req.body;

  console.log("Is phone verified check user =>", isPhoneVerifiedThisUser);
  try {
    console.log(
      "Is phone verified username =>",
      isPhoneVerifiedThisUser.username
    );

    const findedUser = await User.findById(isPhoneVerifiedThisUser._id);

    const isPhoneVerified = findedUser.isPhoneVerified;
    const isPhoneNumberExist = findedUser.phoneNumber;

    if (isPhoneVerified && isPhoneNumberExist) {
      res.status(200).json({
        success: true,
        info: "Your phone number has been successfully found. You can proceed with your actions.",
      });
    } else {
      res.status(501).json({
        success: false,
        info: "Your phone number could not be found. Please make sure you have provided a valid phone number.",
      });
    }

    console.log(
      "Phone verified =>",
      isPhoneVerified,
      "Phone number (current) =>",
      isPhoneNumberExist
    );
  } catch {
    res.status(500).json({ error: "User not found !" });
  }
};

module.exports = {
  handleThisUserPhoneVerified,
};
