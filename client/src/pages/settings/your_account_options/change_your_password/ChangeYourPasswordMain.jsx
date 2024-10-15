import { useContext, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function ChangeYourPasswordMain() {
  const { width } = useWindowDimensions();
  const [{ themeName }] = useContext(ThemeContext);
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [errorInputStyle, seterrorInputStyle] = useState(false);
  const [errorInputStyle2, seterrorInputStyle2] = useState(false);
  const [errorInputStyle3, seterrorInputStyle3] = useState(false);
  const [errorInputStyle4, seterrorInputStyle4] = useState(false);
  const [errorInput, seterrorInput] = useState("");
  const [errorInput2, seterrorInput2] = useState("");
  const [errorInput3, seterrorInput3] = useState("");
  const [errorInput4, seterrorInput4] = useState("");

  const handleChangePassword = () => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (newPassword === oldPassword) {
      seterrorInputStyle2(true);
      seterrorInput2(
        "New password cannot be the same as your existing password.      "
      );
      seterrorInput("");
      seterrorInputStyle(false);

      seterrorInputStyle3(false);
      seterrorInput3("");

      seterrorInputStyle4(false);
      seterrorInput4("");
    } else if (newPassword === confirmNewPassword) {
      axios
        .post(
          `${API_URL}/profile/change-password`,
          {
            userId: userInfo._id,
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
        .then(() => {
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          seterrorInputStyle(false);
          seterrorInputStyle2(false);
          seterrorInputStyle3(false);
          seterrorInputStyle4(false);
          seterrorInput("");
          seterrorInput2("");
          seterrorInput3("");
          seterrorInput4("");

          showCustomMessage("Your password has been successfully updated.", 4);
        })
        .catch((error) => {
          if (error.response.status === 402) {
            seterrorInput4(
              "Your password needs to be at least 8 characters. Please enter a longer one."
            );
            seterrorInputStyle4(true);

            seterrorInput("");
            seterrorInputStyle(false);

            seterrorInputStyle2(false);
            seterrorInput2("");

            seterrorInputStyle3(false);
            seterrorInput3("");
          }
          if (error.response.status === 401) {
            seterrorInput3("The password you entered was incorrect.");
            seterrorInputStyle3(true);

            seterrorInput("");
            seterrorInputStyle(false);

            seterrorInputStyle2(false);
            seterrorInput2("");

            seterrorInput4("");
            seterrorInputStyle4(false);
          }
        });
    } else if (!regex.test(newPassword) || newPassword.length < 6) {
      seterrorInput4(
        "Your password needs to be at least 8 characters. Please enter a longer one."
      );
      seterrorInputStyle4(true);
      seterrorInput3("");
      seterrorInputStyle3(false);

      seterrorInput("");
      seterrorInputStyle(false);

      seterrorInputStyle2(false);
      seterrorInput2("");
    } else {
      seterrorInput("Passwords do not match.");
      seterrorInputStyle(true);

      seterrorInputStyle2(false);
      seterrorInput2("");

      seterrorInputStyle3(false);
      seterrorInput3("");

      seterrorInput4("");
      seterrorInputStyle4(false);
    }
  };
  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      {contextHolder}
      <SettingsNavigation />
      <Col
        xs={10}
        sm={10}
        md={11}
        lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        xxl={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        className={`right-side-column-settings-account-page`}
        style={{
          borderLeft:
            width < 1000
              ? themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          margin: "0px",
          width: width > 1400 ? "600px" : width <= 500 ? "100%" : null,
          position: "relative",
          right: "10px",
        }}
      >
        <div className="settings-header-with-arrow ">
          <div
            onClick={() => {
              navigate(-1);
            }}
            className={`arrow arrow-${themeName} mt-2`}
            style={{
              position: "relative",
              width: "36px",
              height: " 36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "5px",
            }}
          >
            {" "}
            <svg
              color={themeName === "dark-theme" ? "white" : ""}
              fill="currentColor"
              style={{
                position: "absolute",
                border: "none",
              }}
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
              </g>
            </svg>
          </div>
          <div
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change your password
          </div>
        </div>{" "}
        <div
          style={{
            padding: "0px 24px",
          }}
        >
          <FormControl
            className="mt-4"
            sx={{
              width: "100%",
            }}
            variant="outlined"
          >
            <InputLabel
              sx={{
                color: errorInputStyle3 ? "rgb(244, 33, 46)" : "#606368",
                "&.MuiInputLabel-shrink": {
                  color: errorInputStyle3
                    ? "rgb(244, 33, 46)!important"
                    : "#1f9cf0 !important",
                },
              }}
              htmlFor="outlined-adornment-password"
            >
              Current password
            </InputLabel>
            <OutlinedInput
              inputProps={{
                sx: {
                  color: themeName === "dark-theme" ? "white" : "black",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: errorInputStyle3
                    ? "rgb(244, 33, 46)!important"
                    : "#cfd9de !important",
                  border:
                    themeName === "dark-theme" && !errorInputStyle3
                      ? "1px solid rgb(70, 70, 70) !important"
                      : themeName === "dark-theme" && errorInputStyle3
                      ? "1px solid rgb(244, 33, 46) !important"
                      : "",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: errorInputStyle3
                    ? "2px solid rgb(244, 33, 46)!important"
                    : "2px solid #1d9bf0 !important",
                },
              }}
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              id="outlined-adornment-password"
              type={"password"}
              label="Current password"
            />
          </FormControl>
          {errorInputStyle3 ? (
            <>
              <div
                className="mt-1 chirp-regular-font"
                style={{
                  display: "inline-block",
                  color: "rgba(244,39,49,255)",
                  textAlign: "left",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  width: "92%",
                  position: "relative",
                  left: "5px",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "10px",
                  }}
                >
                  {errorInput3}
                </span>
              </div>
            </>
          ) : null}{" "}
          <div
            className="mt-1 chirp-regular-font"
            onClick={() => {
              navigate("/account/send_password_reset");
            }}
            style={{
              display: !errorInputStyle3 ? "inline-block" : "none",
              color: "rgb(29, 155, 240)",
              textAlign: "left",
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              width: "92%",
              position: "relative",
            }}
          >
            <span
              className="forgot-password-logout-settings-and-privacy-modal"
              style={{
                cursor: "pointer",
                position: "relative",
                left: "10px",
              }}
            >
              Forgot password?
            </span>{" "}
          </div>
        </div>{" "}
        <div
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            display: "inline-block",
            width: "100%",
          }}
        ></div>
        <div style={{ padding: "0px 24px" }}>
          <FormControl
            className="mt-3"
            sx={{
              width: "100%",
            }}
            variant="outlined"
          >
            <InputLabel
              sx={{
                color:
                  errorInputStyle4 || errorInputStyle2
                    ? "rgb(244, 33, 46)"
                    : "#606368",
                "&.MuiInputLabel-shrink": {
                  color:
                    errorInputStyle4 || errorInputStyle2
                      ? "rgb(244, 33, 46)!important"
                      : "#1f9cf0 !important",
                },
              }}
              htmlFor="outlined-adornment-password"
            >
              New password
            </InputLabel>
            <OutlinedInput
              inputProps={{
                sx: {
                  color: themeName === "dark-theme" ? "white" : "black",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    errorInputStyle4 || errorInputStyle2
                      ? "rgb(244, 33, 46)!important"
                      : "#cfd9de !important",
                  border:
                    themeName === "dark-theme" &&
                    !errorInputStyle4 &&
                    !errorInputStyle2
                      ? "1px solid rgb(70, 70, 70) !important"
                      : themeName === "dark-theme" &&
                        errorInputStyle4 &&
                        errorInputStyle2
                      ? "1px solid rgb(244, 33, 46) !important"
                      : "",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border:
                    errorInputStyle4 || errorInputStyle2
                      ? "2px solid rgb(244, 33, 46)!important"
                      : "2px solid #1d9bf0 !important",
                },
              }}
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              id="outlined-adornment-password"
              type={"password"}
              label="New password"
            />
          </FormControl>
          {errorInputStyle4 ? (
            <>
              <div
                className="mt-1 chirp-regular-font"
                style={{
                  display: "inline-block",
                  color: "rgba(244,39,49,255)",
                  textAlign: "left",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  width: "92%",
                  position: "relative",
                  left: "5px",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "10px",
                  }}
                >
                  {errorInput4}
                </span>
              </div>
            </>
          ) : null}
          {errorInputStyle2 ? (
            <>
              <div
                className="mt-1 chirp-regular-font"
                style={{
                  display: "inline-block",
                  color: "rgba(244,39,49,255)",
                  textAlign: "left",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  width: "92%",
                  position: "relative",
                  left: "5px",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "10px",
                  }}
                >
                  {errorInput2}
                </span>
              </div>
            </>
          ) : null}
        </div>
        <div style={{ padding: "0px 24px" }}>
          <FormControl
            className="mt-4"
            sx={{
              width: "100%",
            }}
            variant="outlined"
          >
            <InputLabel
              sx={{
                color: errorInputStyle ? "rgb(244, 33, 46)" : "#606368",
                "&.MuiInputLabel-shrink": {
                  color: errorInputStyle
                    ? "rgb(244, 33, 46)!important"
                    : "#1f9cf0 !important",
                },
              }}
              htmlFor="outlined-adornment-password"
            >
              Confirm password
            </InputLabel>
            <OutlinedInput
              inputProps={{
                sx: {
                  color: themeName === "dark-theme" ? "white" : "black",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: errorInputStyle
                    ? "rgb(244, 33, 46)!important"
                    : "#cfd9de !important",
                  border:
                    themeName === "dark-theme" && !errorInputStyle
                      ? "1px solid rgb(70, 70, 70) !important"
                      : themeName === "dark-theme" && errorInputStyle
                      ? "1px solid rgb(244, 33, 46) !important"
                      : "",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: errorInputStyle
                    ? "2px solid rgb(244, 33, 46)!important"
                    : "2px solid #1d9bf0 !important",
                },
              }}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              id="outlined-adornment-password"
              type={"password"}
              label="Confirm password"
            />
          </FormControl>
          {errorInputStyle ? (
            <>
              <div
                className="mt-1 chirp-regular-font"
                style={{
                  display: "inline-block",
                  color: "rgba(244,39,49,255)",
                  textAlign: "left",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  width: "92%",
                  position: "relative",
                  left: "5px",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    left: "10px",
                  }}
                >
                  {errorInput}
                </span>
              </div>
            </>
          ) : null}{" "}
        </div>{" "}
        <div
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            display: "inline-block",
            width: "100%",
          }}
        ></div>
        <div
          className="mt-1"
          style={{
            textAlign: "right",
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        >
          <Button
            style={{
              height: "45px",
              marginTop: "15px",
              position: "relative",
              right: "20px",
              border: "none",
              maxWidth: "69.17px",
              maxHeight: "36px",
              minHeight: "36px",
              fontSize: font15.fontSize,
              cursor:
                oldPassword && newPassword && confirmNewPassword
                  ? "pointer"
                  : "default",

              opacity:
                !oldPassword || !newPassword || !confirmNewPassword
                  ? "0.5"
                  : null,
            }}
            onClick={
              oldPassword && newPassword && confirmNewPassword
                ? () => handleChangePassword()
                : null
            }
            className={
              oldPassword && newPassword && confirmNewPassword
                ? "change-password-btn"
                : "disabled-change-password-btn"
            }
          >
            Save
          </Button>
        </div>
      </Col>
    </>
  );
}

export default ChangeYourPasswordMain;
