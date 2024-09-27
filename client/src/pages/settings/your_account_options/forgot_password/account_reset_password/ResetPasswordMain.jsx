import { Button, Stack } from "react-bootstrap";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useFontSizeHandler } from "../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function ResetPasswordMain() {
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
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo, getToken } = useContext(UserContext);
  const [errorResetPassword, setErrorResetPassword] = useState("");
  const [errorResetPassword2, setErrorResetPassword2] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(null);

  const [newPasswordResetPassword, setnewPasswordResetPassword] = useState("");
  const [newPasswordResetPasswordRepeat, setnewPasswordResetPasswordRepeat] =
    useState("");

  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  useEffect(() => {
    setIsValidPassword(passwordRegex.test(newPasswordResetPassword));
  }, [newPasswordResetPassword]);

  const handleChangePasswordSubmit = () => {
    axios
      .post(
        `${API_URL}/change-password-forgot-password-process`,
        {
          newPassword: newPasswordResetPassword,
          user: userInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {})
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const resetPassword = () => {
    if (!isValidPassword) {
      setErrorResetPassword(
        "Your password needs to be at least 8 characters. Please enter a longer one."
      );
      setErrorResetPassword2("");
    } else if (newPasswordResetPassword !== newPasswordResetPasswordRepeat) {
      setErrorResetPassword("");
      setErrorResetPassword2("Passwords do not match.");
    } else {
      setErrorResetPassword("");
      setErrorResetPassword2("");
      handleChangePasswordSubmit();
      navigate("/account/password_reset_survey");
    }
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
              lineHeight: font31.fontSize,
              padding: "16px 0px",
            }}
          >
            Reset your password
          </span>
          <div
            className="mt-4"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              width: "100%",
            }}
          >
            {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
              <div>
                <img
                  className="profile-img logout-profile-img"
                  src={userInfo?.imageUrl}
                  width={40}
                  height={40}
                  alt=""
                  style={{
                    borderRadius: "50%",
                  }}
                />
              </div>
            ) : (
              <div>
                <img
                  style={{
                    borderRadius: "50%",
                  }}
                  width="40"
                  height="40"
                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                  alt=""
                />
              </div>
            )}
            <div
              style={{
                marginLeft: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                position: "relative",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                {userInfo.fullname}
              </div>
              <div
                className="chirp-regular-font"
                style={{
                  textDecoration: "none",
                  color: "rgb(83, 100, 113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                @{userInfo.username}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <span
              className="chirp-regular-font"
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Strong passwords include numbers, letters, and punctuation marks.
            </span>{" "}
            <span
              className="chirp-regular-font"
              style={{
                cursor: "pointer",
                color: "#55acee",
                width: "100%",
                fontSize: font13.fontSize,
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Learn more
            </span>
          </div>
          <div>
            <FormControl
              size="small"
              className="mt-3"
              sx={{
                width: "340px",
              }}
              variant="outlined"
            >
              <InputLabel
                sx={{
                  color: errorResetPassword ? "rgb(244, 33, 46)" : "#606368",
                  "&.MuiInputLabel-shrink": {
                    color: errorResetPassword
                      ? "rgb(244, 33, 46)!important"
                      : "#1f9cf0 !important",
                  },
                  position: "absolute !important",
                  bottom: "15px !important",
                }}
                htmlFor="outlined-adornment-password"
              >
                Enter your new password
              </InputLabel>
              <OutlinedInput
                inputProps={{
                  sx: {
                    color: themeName === "dark-theme" ? "white" : "black",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: errorResetPassword
                      ? "rgb(244, 33, 46)!important"
                      : "#cfd9de !important",
                    border:
                      themeName === "dark-theme" && !errorResetPassword
                        ? "1px solid rgb(70, 70, 70) !important"
                        : themeName === "dark-theme" && errorResetPassword
                        ? "1px solid rgb(244, 33, 46) !important"
                        : "",
                    borderRadius: "9999px !important",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: errorResetPassword
                      ? "2px solid rgb(244, 33, 46)!important"
                      : "2px solid #1d9bf0 !important",
                  },
                }}
                onChange={(e) => setnewPasswordResetPassword(e.target.value)}
                value={newPasswordResetPassword}
                id="outlined-adornment-password"
                type={"password"}
                label="Enter your new password"
              />
            </FormControl>
          </div>
          {errorResetPassword ? (
            <>
              <span
                className="mt-1 chirp-regular-font"
                style={{
                  display: "flex",
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
                  {errorResetPassword}
                </span>
              </span>
            </>
          ) : null}
          <FormControl
            size="small"
            className="mt-4"
            sx={{
              width: "340px",
            }}
            variant="outlined"
          >
            <InputLabel
              sx={{
                color: errorResetPassword2 ? "rgb(244, 33, 46)" : "#606368",
                "&.MuiInputLabel-shrink": {
                  color: errorResetPassword2
                    ? "rgb(244, 33, 46)!important"
                    : "#1f9cf0 !important",
                },
              }}
              htmlFor="outlined-adornment-password"
            >
              Enter your password one more time
            </InputLabel>
            <OutlinedInput
              inputProps={{
                sx: {
                  color: themeName === "dark-theme" ? "white" : "black",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: errorResetPassword2
                    ? "rgb(244, 33, 46)!important"
                    : "#cfd9de !important",
                  border:
                    themeName === "dark-theme" && !errorResetPassword2
                      ? "1px solid rgb(70, 70, 70) !important"
                      : themeName === "dark-theme" && errorResetPassword2
                      ? "1px solid rgb(244, 33, 46) !important"
                      : "",
                  borderRadius: "9999px !important",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: errorResetPassword2
                    ? "2px solid rgb(244, 33, 46)!important"
                    : "2px solid #1d9bf0 !important",
                },
              }}
              onChange={(e) =>
                setnewPasswordResetPasswordRepeat(e.target.value)
              }
              value={newPasswordResetPasswordRepeat}
              id="outlined-adornment-password"
              type={"password"}
              label="Enter your password one more time
                      "
            />
          </FormControl>{" "}
          {errorResetPassword2 ? (
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
                  {errorResetPassword2}
                </span>
              </div>
            </>
          ) : null}{" "}
          <FormControlLabel
            sx={{
              color: themeName === "dark-theme" ? "white" : "black",
              "& .MuiSvgIcon-root": {
                color: themeName === "dark-theme" ? "white" : "",
              },
            }}
            className="mt-2"
            control={<Checkbox />}
            label="Remember me"
          />{" "}
          <div className="mt-2">
            <span
              className="chirp-regular-font"
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Resetting your password will log you out of all your active
              Connectify sessions.
            </span>{" "}
          </div>{" "}
          <div
            className="mt-1"
            style={{
              textAlign: "left",
            }}
          >
            <Button
              className="reset-password-btn"
              onClick={resetPassword}
              style={{
                height: "45px",
                marginTop: "15px",
                border: "none",
                minWidth: "142px",
                maxWidth: "145px",
                maxHeight: "36px",
                minHeight: "36px",
                fontSize: font15.fontSize,
                cursor: "pointer",
                borderRadius: "9999px",
              }}
            >
              Reset password
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordMain;
