import { useContext, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function DeactivateYourAccountMain() {
  const { width } = useWindowDimensions();
  const { userInfo, logout, getToken } = useContext(UserContext);
  const [{ themeName }] = useContext(ThemeContext);
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const navigate = useNavigate();

  const [deactivateTabIndex, setDeactivateTabIndex] = useState(1);

  const openSecondTabDeactivate = () => {
    setDeactivateTabIndex(deactivateTabIndex + 1);
  };
  const [verifyPasswordInput, setverifyPasswordInput] = useState(null);

  const handleDeactivateUser = () => {
    axios
      .post(
        `${API_URL}/profile/deactivate-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then(() => {
        navigate("/settings/deactivated");
        logout();
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const handlePasswordConfirmation = () => {
    axios
      .post(`${API_URL}/auth/password-check`, {
        verifyPasswordInput,
        userId: userInfo._id,
      })
      .then(() => {
        handleDeactivateUser();
      })
      .catch(() => {
        setTimeout(() => {
          setDeactivateTabIndex(1);
          showCustomMessage("The password you entered was incorrect.");
        }, 200);
      });
  };

  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Deactivate account
          </div>
        </div>
        {deactivateTabIndex === 1 ? (
          <>
            <div
              className={
                themeName === "dark-theme"
                  ? "has-children-dark-theme_sub mt-2"
                  : "has-children-light-theme_sub mt-2"
              }
              style={{
                display: "flex",
                gap: "15px",
                padding: "12px 0px 12px 16px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/profile/${userInfo._id}`)}
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
              className="mt-2"
              style={{
                paddingLeft: "16px",
              }}
            >
              <div
                style={{
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
              >
                This will deactivate your account
              </div>
              <div
                style={{
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-2 mt-3 chirp-regular-font"
                    : "very-dark-gray-light-theme-text-variant-2 mt-3 chirp-regular-font"
                }
              >
                You’re about to start the process of deactivating your C
                account. Your display name, @username, and public profile will
                no longer be viewable on Connectify.com, C for iOS, or C for
                Android.
              </div>
              <div
                style={{
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                }
              >
                What else you should know
              </div>
              <div
                style={{
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-2 mt-3 chirp-regular-font"
                    : "very-dark-gray-light-theme-text-variant-2 mt-3 chirp-regular-font"
                }
              >
                You can restore your C account if it was accidentally or
                wrongfully deactivated for up to 30 days after deactivation.
              </div>
            </div>
            <div
              className="mt-2"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>
            <div
              style={{
                paddingLeft: "16px",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 mt-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 mt-2 chirp-regular-font"
              }
            >
              Some account information may still be available in search engines,
              such as Google or Bing.{" "}
              <span className="hover-blue-underline">Learn more</span>
            </div>{" "}
            <div
              className="mt-2"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>{" "}
            <div
              style={{
                paddingLeft: "16px",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 mt-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 mt-2 chirp-regular-font"
              }
            >
              If you just want to change your @username, you don’t need to
              deactivate your account — edit it in your{" "}
              <span
                onClick={() => navigate("/settings/your_twitter_data/account")}
                className="hover-blue-underline"
              >
                {" "}
                settings
              </span>
              .
            </div>{" "}
            <div
              className="mt-2"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>{" "}
            <div
              style={{
                paddingLeft: "16px",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 mt-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 mt-2 chirp-regular-font"
              }
            >
              To use your current @username or email address with a different C
              account,{" "}
              <span
                onClick={() => {
                  navigate("/settings/your_twitter_data/account");
                }}
                className="hover-blue-underline"
              >
                {" "}
                change them{" "}
              </span>{" "}
              before you deactivate this account.
            </div>{" "}
            <div
              className="mt-2"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>{" "}
            <div
              style={{
                paddingLeft: "16px",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 mt-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 mt-2 chirp-regular-font"
              }
            >
              If you want to download{" "}
              <span
                onClick={() => navigate("/i/flow/verify_account_ownership")}
                className="hover-blue-underline"
              >
                your C data
              </span>
              , you’ll need to complete both the request and download process
              before deactivating your account. Links to download your data
              cannot be sent to deactivated accounts.
            </div>{" "}
            <div
              className="mt-2"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>{" "}
            <div
              onClick={() => {
                openSecondTabDeactivate();
              }}
              className={
                themeName === "dark-theme"
                  ? "mt-1 chirp-regular-font deactivate-btn-dark-theme"
                  : "mt-1 chirp-regular-font deactivate-btn-light-theme"
              }
              style={{
                color: "#F4212D",
                textAlign: "center",
                padding: "16px",
                cursor: "pointer",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
            >
              Deactivate
            </div>
          </>
        ) : deactivateTabIndex === 2 ? (
          <>
            {" "}
            <div
              style={{
                width: "100%",
                paddingLeft: "16px",
              }}
              className="mt-4"
            >
              <div
                className="mt-4 chirp-heavy-font"
                style={{
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Confirm your password
              </div>
              <div
                className="mt-4 chirp-regular-font"
                style={{
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                }}
              >
                Complete your deactivation request by entering the password
                associated with your account.
              </div>{" "}
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
            ></div>{" "}
            <div
              style={{
                padding: "0px 16px",
              }}
            >
              <FormControl
                className="mt-2"
                sx={{
                  width: "100%",
                }}
                variant="outlined"
              >
                <InputLabel
                  sx={{
                    color: themeName === "dark-theme" ? "#71767B" : "",
                    "&.MuiInputLabel-shrink": {
                      color: "#1f9cf0 !important",
                    },
                  }}
                  htmlFor="outlined-adornment-password"
                >
                  Password{" "}
                </InputLabel>
                <OutlinedInput
                  autoFocus
                  sx={{
                    color: themeName === "dark-theme" ? "white" : "black",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border:
                        themeName === "dark-theme"
                          ? "1px solid rgb(70, 70, 70) !important"
                          : themeName !== "dark-theme"
                          ? "1px solid #cfd9de !important"
                          : null,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #1d9bf0 !important",
                    },
                  }}
                  onChange={(e) => setverifyPasswordInput(e.target.value)}
                  value={verifyPasswordInput}
                  id="outlined-adornment-password"
                  type={"password"}
                  label="Password"
                />
              </FormControl>{" "}
              <div
                className="mt-1 chirp-regular-font"
                style={{
                  display: "inline-block",
                  color: "rgb(29, 155, 240)",
                  textAlign: "left",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  width: "92%",
                  position: "relative",
                }}
              >
                <span
                  onClick={() => {
                    navigate("/i/flow/password_reset");
                  }}
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
              className="mt-2"
              style={{
                borderBottom:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>
            <div
              className="mt-1"
              style={{
                textAlign: "right",
                width: "100%",
              }}
            >
              <Button
                style={{
                  height: "36px !important",
                  marginTop: "15px",
                  position: "relative",
                  right: "20px",
                  border: "none",
                  maxWidth: "112.45px",
                  maxHeight: "36px",
                  minHeight: "36px",
                  cursor: "pointer",
                  backgroundColor: "#F4212D",
                  outlineStyle: "none",
                  outline: "none",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
                onClick={
                  verifyPasswordInput
                    ? () => {
                        handlePasswordConfirmation();
                      }
                    : null
                }
                className="background-hover-effect-red-btn chirp-bold-font"
              >
                Deactivate
              </Button>
            </div>
          </>
        ) : (
          <> tab index 3 </>
        )}
      </Col>
    </>
  );
}

export default DeactivateYourAccountMain;
