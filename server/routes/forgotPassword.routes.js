const express = require("express");
const router = express();
const forgotPasswordController = require("../controllers/forgotPasswordController");

router.post(
  "/check-find-account",
  forgotPasswordController.handleGetForgotPasswordProcessUser
);

router.post(
  "/send-forgot-password-code-to-email",
  forgotPasswordController.handleSendForgotPasswordProcessCodeToEmail
);

router.post(
  "/forgot-password-change-password",
  forgotPasswordController.handleChangePasswordForgotPasswordTab
);
router.post(
  "/login-after-forgot-password-process",
  forgotPasswordController.handleLoginAfterForgotPasswordProcess
);

router.post(
  "/change-password-forgot-password-process",
  forgotPasswordController.changePasswordInForgotPasswordProcess
);

router.post(
  "/check-username",
  forgotPasswordController.handleiSEmailAndUsernameMatchForgotPasswordProcess
);

module.exports = router;
