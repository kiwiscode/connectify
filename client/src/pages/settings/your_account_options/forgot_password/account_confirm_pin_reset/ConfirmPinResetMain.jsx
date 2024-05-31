import { Button, Stack } from "react-bootstrap";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../context/UserContext";
import { useAntdMessageHandler } from "../../../../../utils/useAntdMessageHandler";
import { ThemeContext } from "../../../../../context/ThemeContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function ConfirmPinResetMain() {
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo, getToken } = useContext(UserContext);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const { showCustomMessage, contextHolder } = useAntdMessageHandler();
  const [
    receivedVerificationCodeForPasswordChange,
    setReceivedVerificationCodeForPasswordChange,
  ] = useState(null);
  const [
    isWaitingForConfirmationCodeSendingProcess,
    setIsWaitingForConfirmationCodeSendingProcess,
  ] = useState(false);
  const navigate = useNavigate();
  const handleSendForgotPasswordCodeToEmail = () => {
    axios
      .post(
        `${API_URL}/send-forgot-password-code-to-email
  `,
        { forgotPasswordInProcessUser: userInfo }
      )
      .then((response) => {
        setReceivedVerificationCodeForPasswordChange(
          response.data.result.verificationCode.toString()
        );
        setIsWaitingForConfirmationCodeSendingProcess(true);

        setTimeout(() => {
          setVerificationCodeInput("");
          setIsWaitingForConfirmationCodeSendingProcess(false);
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };
  return (
    <>
      {contextHolder}
      <div
        style={{
          boxShadow: "0 0 3px #aaa",
          minHeight: "40px",
          maxHeight: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          style={{
            width: width < 500 ? "100%" : "45%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            minWidth: "fit-content",
          }}
          direction="horizontal"
          gap={3}
        >
          <div>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={50}
              height={30}
              viewBox="0 0 100 100"
            >
              {/* İçi dolu bir kare */}
              <rect
                x="5"
                y="5"
                width="90"
                height="90"
                fill="#1C9BEF"
                rx="5"
                ry="5"
              />

              <text
                x="27.5"
                y="70"
                fontFamily="Arial"
                fontSize="60"
                fill="#FFF"
                stroke="#FFF"
                strokeWidth="2"
              >
                C
              </text>
            </svg>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#66757f",
              lineHeight: "40px",
            }}
          >
            {" "}
            Password Reset
          </div>
          <div
            style={{
              color: "#66757f",
              fontSize: "14px",
            }}
            className="ms-auto"
          >
            English
          </div>
        </Stack>
      </div>
      <div
        className="mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            minWidth: width < 500 ? "100%" : "fit-content",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: "700",
              lineHeight: "24px",
              padding: "16px 0px",
            }}
          >
            Check your email
          </span>
          <div
            className="mt-3"
            style={{
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            You'll receive a code to verify here so you can reset your account
            password.
          </div>{" "}
          <TextField
            className="mt-4"
            autoFocus={true}
            value={verificationCodeInput}
            onChange={(e) => {
              setVerificationCodeInput(e.target.value);
            }}
            type="text"
            id="outlined-basic"
            variant={"outlined"}
            label={`Enter your code`}
            style={{
              width: "340px",
            }}
            InputProps={{
              style: {
                color: themeName === "dark-theme" ? "white" : "black",
              },
            }}
            InputLabelProps={{
              style: {
                color: themeName === "dark-theme" ? "#606368" : "black",
              },
            }}
            size="small"
            sx={{
              "& .Mui-focused input + fieldset": {
                border: "2px solid #1d9bf0 !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border:
                  themeName === "dark-theme"
                    ? "1px solid rgb(70,70,70) !important"
                    : "1px solid #cfd9de !important",
                borderRadius: "9999px !important",
              },
              "& .MuiInputLabel-shrink": {
                color: "#1f9cf0 !important",
              },
            }}
          />{" "}
          <div className="mt-3">
            <Button
              style={{
                height: "45px",
                border: "none",
                maxWidth: "69.17px",
                maxHeight: "36px",
                minHeight: "36px",
                fontSize: "15px",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
              onClick={() => {
                if (
                  verificationCodeInput ===
                  receivedVerificationCodeForPasswordChange
                ) {
                  setTimeout(() => {
                    navigate("/account/reset_password");
                  }, 500);
                } else {
                  showCustomMessage("Incorrect code. Please try again.", 4);
                  setVerificationCodeInput("");
                }
              }}
              className={"change-password-btn"}
            >
              Verify
            </Button>
          </div>{" "}
          <div
            className="mt-3"
            style={{
              fontSize: "14px",
              lineHeight: "18px",
            }}
          >
            If you don't see the email, check other places it might be, like
            your junk, spam, social, or other folders.
          </div>{" "}
          <div
            onClick={() => {
              handleSendForgotPasswordCodeToEmail();
            }}
            className="mt-4"
            style={{
              cursor: "pointer",
              color: "#55acee",
              width: "100%",
              fontSize: "13px",
              fontWeight: "400",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            <span>Didn’t receive your code?</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmPinResetMain;
