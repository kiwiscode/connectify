import { useContext, useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { useAntdMessageHandler } from "../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import SettingsNavigation from "../../../../../components/SettingsNavigation/SettingsNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { UserContext } from "../../../../../context/UserContext";
import LoadingSpinner from "../../../../../components/ui/LoadingSpinner";
import { ThemeContext } from "../../../../../context/ThemeContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function AccountInformationMain() {
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo, getToken } = useContext(UserContext);
  const { contextHolder } = useAntdMessageHandler();
  const navigate = useNavigate();
  const [verifyPasswordInput, setverifyPasswordInput] = useState(null);
  const [verifyPasswordErrorMessage, setverifyPasswordErrorMessage] =
    useState(null);

  const [loading, setLoading] = useState(true);
  // confirm your password

  const [showAccountInformation, setShowAccountInformation] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handlePasswordConfirmation = () => {
    axios
      .post(`${API_URL}/auth/password-check`, {
        verifyPasswordInput,
        forAccountInfoDetail: true,
        userId: userInfo._id,
      })
      .then(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setShowAccountInformation(true);
        }, 300);
      })
      .catch(() => {
        setverifyPasswordErrorMessage(
          "The password you entered was incorrect."
        );
      });
  };

  useEffect(() => {
    if (verifyPasswordInput?.length < 1) {
      setverifyPasswordErrorMessage(null);
    }
  }, [verifyPasswordInput]);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        .then((response) => {
          if (response.data.user.hasPhoneVerifiedForAccountInformationDetail) {
            setShowAccountInformation(true);
          }
        })
        .catch((error) => {
          console.log("Error =>", error);
        });
    }, 300);
  }, []);

  function formatDateTime(inputDate) {
    const dateObj = new Date(inputDate);

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const output = `${formattedDate}, ${formattedTime}`;

    return output;
  }

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
        <>
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
            <div className="mt-2 first-head">Account information</div>
          </div>
          {loading && !showAccountInformation ? (
            <div>
              <LoadingSpinner
                strokeColor={"rgb(29, 155, 240)"}
              ></LoadingSpinner>
            </div>
          ) : !loading && !showAccountInformation ? (
            <>
              <div
                style={{
                  width: "100%",
                  paddingLeft: "16px",
                }}
                className="mt-4"
              >
                <div
                  className="mt-4"
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    lineHeight: "24px",
                  }}
                >
                  Confirm your password
                </div>
                <div
                  className="mt-4"
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    lineHeight: "16px",
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                  }}
                >
                  Please enter your password in order to get this.
                </div>
              </div>
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
                        color:
                          verifyPasswordErrorMessage &&
                          verifyPasswordInput?.length > 0
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
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
                          themeName === "dark-theme" &&
                          !verifyPasswordErrorMessage
                            ? "1px solid rgb(70, 70, 70) !important"
                            : themeName !== "dark-theme" &&
                              !verifyPasswordErrorMessage
                            ? "1px solid #cfd9de !important"
                            : verifyPasswordErrorMessage
                            ? "2px solid rgb(244, 33, 46)!important"
                            : null,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border:
                          verifyPasswordErrorMessage &&
                          verifyPasswordInput?.length > 0
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
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
                  className="mt-1"
                  style={{
                    display: "inline-block",
                    color: "rgb(29, 155, 240)",
                    textAlign: "left",
                    fontSize: "13px",
                    lineHeight: "16px",
                    fontWeight: "400",
                    width: "92%",
                    position: "relative",
                  }}
                >
                  <span
                    onClick={() => {
                      navigate("/account/send_password_reset");
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
                  {verifyPasswordErrorMessage &&
                    verifyPasswordInput?.length > 0 && (
                      <>
                        <div
                          className="mt-1"
                          style={{
                            display: "inline-block",
                            color: "rgba(244,39,49,255)",
                            textAlign: "left",
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            width: "92%",
                          }}
                        >
                          <span
                            style={{
                              position: "relative",
                              left: "10px",
                            }}
                          >
                            {verifyPasswordErrorMessage}
                          </span>
                        </div>
                      </>
                    )}
                </div>
              </div>{" "}
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
                    maxWidth: "92px",
                    maxHeight: "36px",
                    minHeight: "36px",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                  onClick={
                    verifyPasswordInput
                      ? () => {
                          handlePasswordConfirmation();
                        }
                      : null
                  }
                  className={"hover-blue-btn-light-theme"}
                >
                  Confirm
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                width: "100%",
              }}
              className="mt-2"
            >
              <div
                onClick={() => navigate("/settings/screen_name")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "make-dark-theme-bej-color-dark-theme"
                        : "make-light-theme-color-light-theme"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Username
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  >
                    @{userInfo.username}
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                onClick={() => navigate("/settings/phone")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "make-dark-theme-bej-color-dark-theme"
                        : "make-light-theme-color-light-theme"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Phone
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                onClick={() => navigate("/settings/email")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "make-dark-theme-bej-color-dark-theme"
                        : "make-light-theme-color-light-theme"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Email
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  >
                    {userInfo.email}
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "make-dark-theme-bej-color-dark-theme"
                        : "make-light-theme-color-light-theme"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Verified</span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      {userInfo.verified ? "Yes." : "No"}{" "}
                      <span
                        className="hover-blue-underline"
                        style={{
                          lineHeight: "16px",
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Learn more
                      </span>
                    </span>
                  </div>
                </div>
              </div>{" "}
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
              <div
                onClick={() => navigate("/settings/audience_and_tagging")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "make-dark-theme-bej-color-dark-theme"
                        : "make-light-theme-color-light-theme"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Protected posts
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  >
                    No
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "make-dark-theme-bej-color-dark-theme"
                        : "make-light-theme-color-light-theme"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Account creation
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  >
                    <div>{formatDateTime(userInfo.createdAt)}</div>
                    <div>
                      {userInfo.ipAddress === "::1" ? "::1 (Localhost)" : ""}
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
              <div
                onClick={() => navigate("/settings/country")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "make-dark-theme-bej-color-dark-theme"
                          : "make-light-theme-color-light-theme"
                      }
                    >
                      Country
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      {userInfo.registeredCountry
                        ? userInfo.registeredCountry
                        : "?"}
                    </span>
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  ></div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                onClick={() => navigate("/settings/languages")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "make-dark-theme-bej-color-dark-theme"
                          : "make-light-theme-color-light-theme"
                      }
                    >
                      Languages
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      English, Turkish, No linguistic content, French
                    </span>
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  ></div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                onClick={() => navigate("/settings/your_twitter_data/gender")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "make-dark-theme-bej-color-dark-theme"
                          : "make-light-theme-color-light-theme"
                      }
                    >
                      Gender
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      ?
                    </span>
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  ></div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "make-dark-theme-bej-color-dark-theme"
                          : "make-light-theme-color-light-theme"
                      }
                    >
                      Birth date
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      {userInfo.birthDate && (
                        <>
                          <span>{userInfo.birthDate.month.slice(0, 3)} </span>
                          <span>{userInfo.birthDate.day}, </span>
                          <span>{userInfo.birthDate.year}</span>
                        </>
                      )}
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Add your date of birth to your{" "}
                      <span
                        onClick={() => navigate(`/profile`)}
                        style={{
                          lineHeight: "16px",
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "rgb(29, 155, 240)",
                        }}
                        className="hover-blue-underline"
                      >
                        profile
                      </span>
                      .
                    </span>
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  ></div>
                </div>{" "}
              </div>{" "}
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
              <div
                onClick={() => navigate("/settings/your_twitter_data/age")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "make-dark-theme-bej-color-dark-theme"
                          : "make-light-theme-color-light-theme"
                      }
                    >
                      Age
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      {userInfo.birthDate?.year && (
                        <>
                          {new Date().getFullYear() - userInfo.birthDate.year}
                        </>
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  ></div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                onClick={() => navigate("/settings/your_twitter_data/account")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "60px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "make-dark-theme-bej-color-dark-theme"
                          : "make-light-theme-color-light-theme"
                      }
                    >
                      Automation
                    </span>
                    <span
                      style={{
                        lineHeight: "16px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                      }}
                    >
                      Manage your automated account.
                    </span>
                  </div>
                  <div
                    style={{
                      lineHeight: "16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                    }}
                  ></div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
            </div>
          )}
        </>
      </Col>
    </>
  );
}

export default AccountInformationMain;
