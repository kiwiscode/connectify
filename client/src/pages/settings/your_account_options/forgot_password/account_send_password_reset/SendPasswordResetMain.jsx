import { useContext, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import BootstrapTooltip from "../../../../../components/BootstrapToolTip/BootstrapToolTip";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Radio } from "@mui/material";
import { Button, Stack } from "react-bootstrap";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useFontSizeHandler } from "../../../../../utils/useFontSizeHandler";
const API_URL = import.meta.env.VITE_APP_API_URL;

function SendPasswordResetMain() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const getMaskedEmail = (str) => {
    const atIndex = str.indexOf("@");
    const userName = str.slice(0, atIndex);
    const domainIndex = str.indexOf(".");
    const domain = str.slice(atIndex + 1, domainIndex);

    const maskedUsername = userName.slice(0, 2) + "*".repeat(10);
    const maskedDomain = domain.charAt(0) + "*".repeat(4);
    const maskedDot = "*".repeat(3);

    return maskedUsername + "@" + maskedDomain + "." + maskedDot;
  };
  const [
    receivedVerificationCodeForPasswordChange,
    setReceivedVerificationCodeForPasswordChange,
  ] = useState(null);
  const [
    isWaitingForConfirmationCodeSendingProcess,
    setIsWaitingForConfirmationCodeSendingProcess,
  ] = useState(false);
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
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
          navigate("/account/confirm_pin_reset");
          setIsWaitingForConfirmationCodeSendingProcess(false);
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  return (
    <>
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
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              color: "#66757f",
            }}
          >
            {" "}
            Password Reset
          </div>
          <div
            style={{
              color: "#66757f",
              fontSize: font14.fontSize,
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
            className="chirp-bold-font"
            style={{
              fontSize: font31.fontSize,
              lineHeight: font31.lineHeight,
              padding: "16px 0px",
            }}
          >
            How do you want to reset your password?
          </span>
          <div
            className="mt-4"
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
              <div>
                <img
                  className="profile-img logout-profile-img"
                  src={userInfo?.imageUrl}
                  width={48}
                  height={48}
                  alt=""
                  style={{
                    borderRadius: "50%",
                  }}
                />
              </div>
            ) : (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={48}
                  height={48}
                  fill={"rgb(83, 100, 113)"}
                  className="profile-svg-logout-modal bi bi-person-circle"
                  viewBox="0 0 16 16"
                  style={{
                    borderRadius: "50%",
                  }}
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  fontSize: font14.fontSize,
                  lineHeight: "18px",
                }}
              >
                {userInfo.fullname}
              </div>
              <div
                style={{
                  color: "#657786",
                  fontSize: font14.fontSize,
                  lineHeight: "18px",
                }}
              >
                @{userInfo.username}
              </div>
            </div>
          </div>{" "}
          <div
            className="mt-3"
            style={{
              fontSize: font14.fontSize,
              lineHeight: "18px",
            }}
          >
            You can use the information associated with your account.
          </div>{" "}
          <div
            className="mt-4"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <input type="radio" name="method" checked="true"></input>
            <span
              style={{
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Send an email to
            </span>
            <strong> {getMaskedEmail(userInfo.email)}</strong>
          </div>
          <div className="mt-3">
            <Button
              style={{
                height: "45px",
                border: "none",
                maxWidth: "69.17px",
                maxHeight: "36px",
                minHeight: "36px",
                fontSize: font15.fontSize,
              }}
              className={"change-password-btn"}
              onClick={() => {
                handleSendForgotPasswordCodeToEmail();
              }}
            >
              Next
            </Button>
          </div>{" "}
          <div
            className="mt-4 chirp-regular-font"
            style={{
              cursor: "pointer",
              color: "#55acee",
              width: "100%",
              fontSize: font13.fontSize,
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            <span>
              <BootstrapTooltip
                title="This feature is not yet active. "
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                Don’t have access to these?
              </BootstrapTooltip>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SendPasswordResetMain;
